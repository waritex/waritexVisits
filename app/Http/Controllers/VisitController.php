<?php

namespace App\Http\Controllers;

use App\Visit;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Carbon\Carbon;

class VisitController extends Controller
{
    public function get($visit_id , $date , $salesman , $lat1 , $lng1 , $lat2 , $lng2 , Request $request)
    {
        // check inputs
        if (!$visit_id || !$date || !$salesman || !$lat1 || !$lat2 || !$lng1 || !$lng2)
            return NULL;

        $date = Carbon::createFromFormat('d-m-Y', $date);
        $data = [
            'visit_id'                  =>  $visit_id,
            'salesman_id'               =>  $salesman,
            'visit_date'                =>  $date,
            'last_customer_lat'         =>  $lat1,
            'last_customer_lng'         =>  $lng1,
            'current_customer_lat'      =>  $lat2,
            'current_customer_lng'      =>  $lng2,
        ];
        // check if exist
        $exist = $this->check_exist($visit_id);

        if ($exist){
            $exist = $exist[0];
            return response()->json([
                "Time"          =>      $exist->google_time_pessimistic,
                "Distance"      =>      $exist->google_distance,
            ]);
        }

        // ask google if not exist
        $res_google = $this->ask_google($data);
        if ($res_google===false)
            return NULL;

        $g_time = $res_google['rows'][0]['elements'][0]['duration']['value'];
        $g_time_pess = $res_google['rows'][0]['elements'][0]['duration_in_traffic']['value'];
        $g_distance = $res_google['rows'][0]['elements'][0]['distance']['value'];

        // create if not exist
        $data['google_time_pessimistic'] = $g_time_pess;
        $data['google_distance'] = $g_distance;

        $this->create($data);

        // return time and distance
        return response()->json([
            "Time"          =>      $g_time_pess,
            "Distance"      =>      $g_distance,
        ]);
    }


    private function check_exist($visit_id){
        $visit = Visit::where('visit_id' , '=' , $visit_id)->get();
        return $visit->isEmpty()? false : $visit;
    }

    private function create($arr){
        if ( !is_array($arr) )
            return false;
        return Visit::create($arr);
    }

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


}
