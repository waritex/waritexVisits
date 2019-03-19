<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use GuzzleHttp\Client;
use App\ScannerGoogle;
use App\ScannerGPS;
use Carbon\Carbon;

class ScannerController extends Controller
{
    public function test()
    {
        return view('here');
    }
    public function get_customers(Request $request)
    {
        $city = 'IQ010';
        // get customers's route:
        if (!$todayCustomers = $this->get_not_visited_3m($city))
            return response()->json('No Customers In Today\'s Route',500);
        return $todayCustomers;
    }

    public function catch_readings(Request $request)
    {
        $readings = $request->post('readings',false);
        if ($readings === false || count($readings=json_decode($readings,true))==0)
            return response()->json('No readings',200);
        $last_read = ScannerGPS::where('times','=',ScannerGPS::max('times'))->first();
        $readings = collect($readings)->map(function ($a){
            $a['times'] = Carbon::createFromTimestampMs($a['times'])->toDateTimeString();
            return $a;
        });
        ScannerGPS::insert($readings->toArray());
        return response()->json('done',200);
        /*************************************/
        /*************************************/
        /*************************************/
        $roads = $this->google_road_api($readings,$last_read);
        if ($roads===false){
            return response()->json('Google Error',401);
        }
        $this->save_road($roads);
    }

    private function get_not_visited_3m($city){
        $customers = DB::connection('wri')->select("
        SELECT
cus.CustomerNo as cusCode
, cus.CustomerNameA as cusName
, cus.Latitude as cusLat
, cus.Longitude as cusLng
, ord.Date as lastDate
, ord.NetTotal as NetTotal
FROM
HH_Customer as cus
inner join AR_order as ord on ord.CustomerNo = cus.CustomerNo and ord.Date >= DATEADD(DAY, -90, GETDATE())

WHERE cus.BUID = 105
and cus.Inactive = 0
and cus.Latitude !=0 and cus.Latitude is not null
and cus.Longitude !=0 and cus.Longitude is not null
and cus.cityno = ?	  
        " , [$city]);

        return empty($customers)? false : $customers;
    }

    private function google_road_api($data , $last_read){
        if (!empty($last_read) && Carbon::createFromTimeString($last_read['times'])->isSameDay(Carbon::createFromTimeString($data->first()['times']))){
            $data->push($last_read);
        }
        $http = new Client;
        // Parameters:
        /////////////////////////////////////
        $path = $this->create_path($data);
        $App_key = "AIzaSyCsY5zoDVH3drpV_vvJnD2y-ZiWQbXlNxw";
        $App_key = "AIzaSyDUnRgnrJrCZokOFnAu1oqtfrd6GlUegzs";
        /////////////////////////////////////
        try{
            $response = $http->get("https://roads.googleapis.com/v1/snapToRoads?path=$path&interpolate=true&key=$App_key");
        }
        catch (\Exception $exception){
            return false;
        }
        return json_decode((string) $response->getBody(), true);
    }

    private function create_path($data){
        $path = "";
        $i=0;
        foreach ($data as $k => $d){
            $lat = $d['lat'];
            $lng = $d['lng'];
            $i++;
            if ($i==$data->count())
                $path = $path . "$lat,$lng";
            else $path = $path . "$lat,$lng|";
        }
        return $path;
    }

    private function save_road($road){
        return ($road);
    }

    public function ask_here(){
        $next_day = today()->addDay();
        $todayReadings = ScannerGPS::where('times','>=',today()->subDay()->toDateString())->where('times','<',$next_day->toDateString())->get();
        $s = "SEQNR,	LATITUDE,	LONGITUDE \n";
        foreach ($todayReadings as $k => $reading){
            $str = $k .", ". $reading->lat .", ". $reading->lng;
            $s = $s . $str . "\n";
        }
        // return $s;
        $app_code = "RGNknF0atqjNJtKv6jqNng";
        $app_id = "wJfp8Qci1Gq0vlw64DRH";
        $utl = "https://fleet.cit.api.here.com/2/calculateroute.json?routeMatch=1&mode=fastest;car;traffic:disabled&app_id=$app_id&app_code=$app_code";
        $http = new Client;
        try{
            $response = $http->post($utl ,['body' => $s]);
//            return $response;
        }
        catch (\Exception $exception){
            return false;
        }
//        return json_decode((string) $response->getBody(), true);
        $asd = $response->getBody();
        return view('here',compact('asd'));
    }
}
