<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use GuzzleHttp\Client;
use Carbon\Carbon;

class KsaDistinaceController extends Controller
{
    //

    public function distance()
    {
        $final_res = [];
        $salesmand = 'KSA003';
        $salesmandLat = '24.613018';
        $salesmandLng = '46.745869';
        $file = public_path('excel/ksavisit.xlsx');
        $reader = Excel::selectSheetsByIndex(9)->load($file);
        $all = $reader->get()->toArray();
//        dd($all);
        $groupbysalesman = collect($all)->groupBy('salesman_code');
        foreach ($groupbysalesman as $salesman){
            $groupbydate = $salesman->groupBy(function ($item,$key){
                return $item['visit_date']->toDateString();
            });
            foreach ($groupbydate as $day){
                $day = $day->toArray();
                for($i=0 ; $i< count($day) ; $i++){
                    if ($i == 0){
                        if ($day[$i]['salesman_code']==$salesmand){
                            $data = [
                                'last_customer_lat'         =>      $salesmandLat,
                                'last_customer_lng'         =>      $salesmandLng,
                                'current_customer_lat'      =>      $day[$i]['latitude'],
                                'current_customer_lng'      =>      $day[$i]['longitude'],
                            ];
                            $res_google = $this->ask_google($data);
                            $day[$i]['google_distance'] = 0;
                            if ($res_google===false) {
                                $day[$i]['google_time_pessimistic'] = 0;
                                $day[$i]['google_distance'] = 0;
                            }
                            else{
                                // get time & distance
                                try{
                                    $g_time_pess = $res_google['rows'][0]['elements'][0]['duration_in_traffic']['value'];
                                    $g_distance = $res_google['rows'][0]['elements'][0]['distance']['value'];
                                }
                                catch (\Exception $exception){
                                    $g_time_pess=0;
                                    $g_distance=0;
                                }
                                $day[$i]['google_time_pessimistic'] = $g_time_pess;
                                $day[$i]['google_distance'] = $g_distance;
                            }
                            $newar = [
                                'customer_id'               =>   0,
                                'customer_name'             => 'Home',
                                'salesman_code'             => $day[$i]['salesman_code'],
                                'visit_date'                => $day[$i]['visit_date'],
                                'latitude'                  => $data['last_customer_lat'],
                                'longitude'                 => $data['last_customer_lng'],
                                'google_distance'           => 0,
                            ];
                            $final_res[] = $newar;
                            $final_res[] = $day[$i];
                        }
                    }
                    elseif ($i == count($day)-1){
                        if ($day[$i]['salesman_code']==$salesmand){
                            $data = [
                                'current_customer_lat'         =>      $day[$i]['latitude'],
                                'current_customer_lng'         =>      $day[$i]['longitude'],
                                'last_customer_lat'      =>      $day[$i-1]['latitude'],
                                'last_customer_lng'      =>      $day[$i-1]['longitude'],
                            ];
                            $res_google = $this->ask_google($data);
                            $g_distance=0;
                            if ($res_google===false) {
                                $g_time_pess = 0;
                                $g_time_pess = 0;
                            }
                            else{
                                // get time & distance
                                try{
                                    $g_time_pess = $res_google['rows'][0]['elements'][0]['duration_in_traffic']['value'];
                                    $g_distance = $res_google['rows'][0]['elements'][0]['distance']['value'];
                                }
                                catch (\Exception $exception){
                                    $g_time_pess=0;
                                    $g_distance=0;
                                }
                            }
                            $day[$i]['google_distance'] = $g_distance;
                            $final_res[] = $day[$i];


                            $data = [
                                'current_customer_lat'         =>      $salesmandLat,
                                'current_customer_lng'         =>      $salesmandLng,
                                'last_customer_lat'      =>      $day[$i]['latitude'],
                                'last_customer_lng'      =>      $day[$i]['longitude'],
                            ];
                            $res_google = $this->ask_google($data);
                            $g_distance=0;
                            if ($res_google===false) {
                                $g_time_pess = 0;
                                $g_time_pess = 0;
                            }
                            else{
                                // get time & distance
                                try{
                                    $g_time_pess = $res_google['rows'][0]['elements'][0]['duration_in_traffic']['value'];
                                    $g_distance = $res_google['rows'][0]['elements'][0]['distance']['value'];
                                }
                                catch (\Exception $exception){
                                    $g_time_pess=0;
                                    $g_distance=0;
                                }
                            }
                            $newar = [
                                'customer_id'               =>   1,
                                'customer_name'             => 'Home',
                                'salesman_code'             => $day[$i]['salesman_code'],
                                'visit_date'                => $day[$i]['visit_date'],
                                'latitude'                  => $data['current_customer_lat'],
                                'longitude'                 => $data['current_customer_lng'],
                                'google_distance'           => $g_distance,
                            ];

                            $final_res[] = $newar;
                        }
                    }
                    else {
                        if ($day[$i]['salesman_code']==$salesmand){
                            $data = [
                                'current_customer_lat'         =>      $day[$i]['latitude'],
                                'current_customer_lng'         =>      $day[$i]['longitude'],
                                'last_customer_lat'      =>      $day[$i-1]['latitude'],
                                'last_customer_lng'      =>      $day[$i-1]['longitude'],
                            ];
                            $res_google = $this->ask_google($data);
                            $g_distance=0;
                            if ($res_google===false) {
                                $g_time_pess = 0;
                                $g_time_pess = 0;
                            }
                            else{
                                // get time & distance
                                try{
                                    $g_time_pess = $res_google['rows'][0]['elements'][0]['duration_in_traffic']['value'];
                                    $g_distance = $res_google['rows'][0]['elements'][0]['distance']['value'];
                                }
                                catch (\Exception $exception){
                                    $g_time_pess=0;
                                    $g_distance=0;
                                }
                            }
                            $day[$i]['google_distance'] = $g_distance;
                            $final_res[] = $day[$i];
                        }
                    }
                }
            }
        }

        //////////////////
        ///
        return view('ksaDis' , compact('final_res'));

    }

    /**
     * Send Request to Google
     * @param $data
     * @return bool|mixed
     */
    private function ask_google($data){
        $http = new Client;
        // Parameters:
        /////////////////////////////////////
        $lat1 = $data['last_customer_lat'];
        $lng1 = $data['last_customer_lng'];
        $lat2 = $data['current_customer_lat'];
        $lng2 = $data['current_customer_lng'];
        $traffic_model = "pessimistic";
        $departure_time = "now";
        $App_key = "AIzaSyCsY5zoDVH3drpV_vvJnD2y-ZiWQbXlNxw";
        /////////////////////////////////////
        try{
            $response = $http->get("https://maps.googleapis.com/maps/api/distancematrix/json?origins=$lat1,$lng1&destinations=$lat2,$lng2&departure_time=$departure_time&traffic_model=$traffic_model&key=$App_key");
        }
        catch (\Exception $exception){
            return false;
        }

        return json_decode((string) $response->getBody(), true);
    }


    public function getYesterdayOrders()
    {
        
    }
}
