<?php

namespace App\Http\Controllers;

use App\Visit;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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

    public function test()
    {
        // dd($this->get_new_visits(now()->addMinutes(-10)));
        // dd($this->get_visit_salesbuzz('IRD009-0100095'));
        // dd($this->get_last_visit());
        // dd($this->task());
    }

    public function get_v2($visit_id)
    {
        // check inputs
        if (!$visit_id)
            return NULL;

        // check if exist
        $exist = $this->check_exist($visit_id);

        // if exist return Time and Distance
        if ($exist){
            $exist = $exist[0];
            return response()->json([
                "Time"          =>      $exist->google_time_pessimistic,
                "Distance"      =>      $exist->google_distance,
            ]);
        }

        // if not exist
        // get it from salesbuzz
        $visit = $this->get_visit_salesbuzz($visit_id);
        if (!$visit)
            return NULL;

        $data = [
            'visit_id'                      =>  $visit->visit_id,
            'visit_start'                   =>  $visit->visit_start,
            'visit_finish'                  =>  $visit->visit_finish,
            'current_customer_lng'          =>  $visit->Longitude,
            'current_customer_lat'          =>  $visit->Latitude,
            'last_visit_id'                 =>  $visit->last_id,
            'last_customer_lng'             =>  $visit->last_lng,
            'last_customer_lat'             =>  $visit->last_lat,
        ];
        // then ask google
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

    public function task()
    {
        // get last visit in our DB
        $visit_time = $this->get_last_visit();
        // if error
        if (!$visit_time) return NULL;
        // try get new visits
        $new_visits = $this->get_new_visits($visit_time);
        if (!$new_visits) return NULL;

        // return $visit_time;

        // for each new visit ask google
        foreach ($new_visits as $visit){
            $data = [
                'visit_id'                      =>  $visit->visit_id,
                'visit_start'                   =>  $visit->visit_start,
                'visit_finish'                  =>  $visit->visit_finish,
                'current_customer_lng'          =>  $visit->Longitude,
                'current_customer_lat'          =>  $visit->Latitude,
                'last_visit_id'                 =>  $visit->last_id,
                'last_customer_lng'             =>  $visit->last_lng,
                'last_customer_lat'             =>  $visit->last_lat,
            ];
            // then ask google
            // ask google
            $res_google = $this->ask_google($data);
            if ($res_google===false) return NULL;

            // get time & distance
            $g_time = $res_google['rows'][0]['elements'][0]['duration']['value'];
            $g_time_pess = $res_google['rows'][0]['elements'][0]['duration_in_traffic']['value'];
            $g_distance = $res_google['rows'][0]['elements'][0]['distance']['value'];

            $data['google_time_pessimistic'] = $g_time_pess;
            $data['google_distance'] = $g_distance;
            // create
            $this->create($data);
            DB::update('
            UPDATE `visits` SET `visit_start`=? ,`visit_finish`=? 
            WHERE
            ' , [$visit->visit_start  , $visit->visit_finish ]);
        }
    }

    /************************************************************/
    // Private Functions
    /************************************************************/
    /**
     * check visit exist in our DB
     * @param $visit_id
     * @return Visit[]|bool|\Illuminate\Database\Eloquent\Collection|\Illuminate\Support\Collection
     */
    private function check_exist($visit_id){
        $visit = Visit::where('visit_id' , '=' , $visit_id)->get();
        return $visit->isEmpty()? false : $visit;
    }

    /**
     * Create new Visit in our DB
     * @param $arr
     * @return Visit|bool|\Illuminate\Database\Eloquent\Model
     */
    private function create($arr){
        if ( !is_array($arr) )
            return false;

        return Visit::create($arr);
//        return DB::insert('
//        INSERT INTO `visits`(`visit_id`, `visit_start`, `visit_finish`, `current_customer_lat`, `current_customer_lng`, `last_visit_id`, `last_customer_lat`, `last_customer_lng`, `google_time_pessimistic`, `google_distance`, `created_at`, `updated_at`)
//        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
//        ' , [
//            $arr['visit_id'],
//            $arr['visit_start'],
//            $arr['visit_finish'],
//            $arr['current_customer_lng'],
//            $arr['current_customer_lat'],
//            $arr['last_visit_id'],
//            $arr['last_customer_lng'],
//            $arr['last_customer_lat'],
//            $arr['google_time_pessimistic'],
//            $arr['google_distance'],
//            now(),
//            now(),
//        ]);
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

    /**
     * get New Visits from SalesBuzz DataBase
     * @param $stat_time
     * @return array
     */
    private function get_new_visits($stat_time){
        $new_visits = DB::connection('wri')->select("
      SELECT 
	  visit.[ID]					AS visit_id
      ,visit.[starttime]			AS visit_start
      ,visit.[finishtime]			AS visit_finish
	  ,verify.[Longitude]			AS Longitude
	  ,verify.[Latitude]			AS Latitude
	  ,		(select top 1  ID
			from V_HH_VisitDuration 
			INNER JOIN dbo.HH_VisitVerification ON V_HH_VisitDuration.ID = dbo.HH_VisitVerification.VisitNo
			where CAST(visit.starttime as Date) = CAST(V_HH_VisitDuration.starttime as Date)
			and visit.salesmanno = V_HH_VisitDuration.salesmanno
			and visit.starttime > V_HH_VisitDuration.starttime
			order by starttime desc
			) as last_id
		,	(select top 1  [Longitude]
			from V_HH_VisitDuration 
			INNER JOIN dbo.HH_VisitVerification ON V_HH_VisitDuration.ID = dbo.HH_VisitVerification.VisitNo
			where CAST(visit.starttime as Date) = CAST(V_HH_VisitDuration.starttime as Date)
			and visit.salesmanno = V_HH_VisitDuration.salesmanno
			and visit.starttime > V_HH_VisitDuration.starttime
			order by starttime desc
			) as last_lng
		,	(select top 1 [Latitude]
			from V_HH_VisitDuration 
			INNER JOIN dbo.HH_VisitVerification ON V_HH_VisitDuration.ID = dbo.HH_VisitVerification.VisitNo
			where CAST(visit.starttime as Date) = CAST(V_HH_VisitDuration.starttime as Date)
			and visit.salesmanno = V_HH_VisitDuration.salesmanno
			and visit.starttime > V_HH_VisitDuration.starttime
			order by starttime desc
			) as last_lat
      FROM [dbo].[V_HH_VisitDuration] as visit
      INNER JOIN dbo.HH_VisitVerification as verify ON visit.ID = verify.VisitNo
      WHERE visit.starttime > ?
            AND visit.SalesmanNo LIKE 'IRD%'
        ", [$stat_time]);

        return empty($new_visits)? false : $new_visits;
    }

    // get visit from salesbuzz
    private function get_visit_salesbuzz($visit_id)
    {
        $visit = DB::connection('wri')->select("
      SELECT 
	  visit.[ID]					AS visit_id
      ,visit.[starttime]			AS visit_start
      ,visit.[finishtime]			AS visit_finish
	  ,verify.[Longitude]			AS Longitude
	  ,verify.[Latitude]			AS Latitude
	  ,		(select top 1  ID
			from V_HH_VisitDuration 
			INNER JOIN dbo.HH_VisitVerification ON V_HH_VisitDuration.ID = dbo.HH_VisitVerification.VisitNo
			where CAST(visit.starttime as Date) = CAST(V_HH_VisitDuration.starttime as Date)
			and visit.salesmanno = V_HH_VisitDuration.salesmanno
			and visit.starttime > V_HH_VisitDuration.starttime
			order by starttime desc
			) as last_id
		,	(select top 1  [Longitude]
			from V_HH_VisitDuration 
			INNER JOIN dbo.HH_VisitVerification ON V_HH_VisitDuration.ID = dbo.HH_VisitVerification.VisitNo
			where CAST(visit.starttime as Date) = CAST(V_HH_VisitDuration.starttime as Date)
			and visit.salesmanno = V_HH_VisitDuration.salesmanno
			and visit.starttime > V_HH_VisitDuration.starttime
			order by starttime desc
			) as last_lng
		,	(select top 1 [Latitude]
			from V_HH_VisitDuration 
			INNER JOIN dbo.HH_VisitVerification ON V_HH_VisitDuration.ID = dbo.HH_VisitVerification.VisitNo
			where CAST(visit.starttime as Date) = CAST(V_HH_VisitDuration.starttime as Date)
			and visit.salesmanno = V_HH_VisitDuration.salesmanno
			and visit.starttime > V_HH_VisitDuration.starttime
			order by starttime desc
			) as last_lat
      FROM [dbo].[V_HH_VisitDuration] as visit
      INNER JOIN dbo.HH_VisitVerification as verify ON visit.ID = verify.VisitNo
      WHERE visit.[ID] = ?
            AND visit.SalesmanNo LIKE 'IRD%'
        ", [$visit_id]);

        return empty($visit)? false : $visit[0];
    }

    /**
     * get Last visit in our database
     */
    private function get_last_visit()
    {
        $last_visit_time = DB::select('SELECT concat( MAX(visit_start) ) as last_visit FROM visits');
        return empty($last_visit_time)? false : $last_visit_time[0]->last_visit;
    }




}
