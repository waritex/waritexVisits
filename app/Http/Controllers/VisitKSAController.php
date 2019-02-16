<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\DB;
use App\VisitKSA;

class VisitKSAController extends Controller
{

    public function task()
    {
        // get last visits in our DB for each salesman
        $visit_times = $this->get_last_visit();
        // if error
        if (!$visit_times) return NULL;
        // try get new visits
        foreach ($visit_times as $visit_time){
            $new_visits = $this->get_new_visits($visit_time);
            if (!$new_visits) continue;

            // for each new visit ask google
            foreach ($new_visits as $visit){
                // check if there's a duplicate
                if ($this->check_duplicate($visit->visit_id))
                    continue;

                $data = [
                    'visit_id'                      =>  $visit->visit_id,
                    'visit_start'                   =>  $visit->visit_start,
                    'visit_finish'                  =>  $visit->visit_finish,
                    'current_customer_lng'          =>  $visit->Longitude,
                    'current_customer_lat'          =>  $visit->Latitude,
                    'last_visit_id'                 =>  $visit->last_id,
                    'last_customer_lng'             =>  $visit->last_lng,
                    'last_customer_lat'             =>  $visit->last_lat,
                    'first_gps_lat'                 =>  $visit->first_gps_lat,
                    'first_gps_lng'                 =>  $visit->first_gps_lng,
                    'second_gps_lat'                =>  $visit->second_gps_lat,
                    'second_gps_lng'                =>  $visit->second_gps_lng,
                ];

                // check if first visit in day
                if ($this->check_first_visit_inDay($data)===true){
                    $data['google_time_pessimistic'] = 0;
                    $data['google_distance'] = 0;
                    $data['last_read_distance'] = 0;
                }

                else{
                    // debug data
                    /*
                    echo "\n";
                    print_r($data);
                    echo "\n";
                    */
                    // check if error on lat || lng
                    if ($this->check_error_visit_latlng($data)===true){
                        $data['google_time_pessimistic'] = 0;
                        $data['google_distance'] = 0;
                    }

                    else{
                        // then ask google
                        // ask google
                        $res_google = $this->ask_google($data);
                        if ($res_google===false) {
                            $data['google_time_pessimistic'] = 0;
                            $data['google_distance'] = 0;
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
                            $data['google_time_pessimistic'] = $g_time_pess;
                            $data['google_distance'] = $g_distance;
                        }
                    }

                    // check last GPS readings
                    if ($this->check_last_GPS_is_Visit($data)===true){
                        $data['last_read_distance'] = 0;
                    }
                    else{
                        $r2_google = $this->calculateDistanceP($data);
                        if ($r2_google===FALSE){
                            $data['last_read_distance'] = 0;
                        }
                        else{
                            $data['last_read_distance'] = $r2_google;
                        }
                    }
                }


                // create
                $this->create($data);
            }
        }

    }

    public function fixTaskManually($startDate , $endDate)
    {
        // try get new visits
        $new_visits = $this->get_visits_bet_dates($startDate , $endDate);
        foreach ($new_visits as $k => $visit){
            print_r('visit: '.$k);
            echo "\n";
            // check if there's a duplicate
            if ($this->check_duplicate($visit->visit_id))
                continue;

            $data = [
                'visit_id'                      =>  $visit->visit_id,
                'visit_start'                   =>  $visit->visit_start,
                'visit_finish'                  =>  $visit->visit_finish,
                'current_customer_lng'          =>  $visit->Longitude,
                'current_customer_lat'          =>  $visit->Latitude,
                'last_visit_id'                 =>  $visit->last_id,
                'last_customer_lng'             =>  $visit->last_lng,
                'last_customer_lat'             =>  $visit->last_lat,
                'first_gps_lat'                 =>  $visit->first_gps_lat,
                'first_gps_lng'                 =>  $visit->first_gps_lng,
                'second_gps_lat'                =>  $visit->second_gps_lat,
                'second_gps_lng'                =>  $visit->second_gps_lng,
            ];

            // check if first visit in day
            if ($this->check_first_visit_inDay($data)===true){
                $data['google_time_pessimistic'] = 0;
                $data['google_distance'] = 0;
                $data['last_read_distance'] = 0;
            }

            else{
                // debug data
                /*
                echo "\n";
                print_r($data);
                echo "\n";
                */
                // check if error on lat || lng
                if ($this->check_error_visit_latlng($data)===true){
                    $data['google_time_pessimistic'] = 0;
                    $data['google_distance'] = 0;
                }

                else{
                    // then ask google
                    // ask google
                    $res_google = $this->ask_google($data);
                    if ($res_google===false) {
                        $data['google_time_pessimistic'] = 0;
                        $data['google_distance'] = 0;
                    }
                    else{
                        // get time & distance
                        // $g_time = $res_google['rows'][0]['elements'][0]['duration']['value'];
                        try{
                            $g_time_pess = $res_google['rows'][0]['elements'][0]['duration_in_traffic']['value'];
                            $g_distance = $res_google['rows'][0]['elements'][0]['distance']['value'];
                        }
                        catch (\Exception $exception){
                            $g_time_pess=0;
                            $g_distance=0;
                        }
                        $data['google_time_pessimistic'] = $g_time_pess;
                        $data['google_distance'] = $g_distance;
                    }
                }

                // check last GPS readings
                if ($this->check_last_GPS_is_Visit($data)===true){
                    $data['last_read_distance'] = 0;
                }
                else{
                    $r2_google = $this->calculateDistanceP($data);
                    if ($r2_google===FALSE){
                        $data['last_read_distance'] = 0;
                    }
                    else{
                        $data['last_read_distance'] = $r2_google;
                    }
                }
            }

            // create
            $this->create($data);
            print_r('created...');
            echo "\n";
        }
    }

    /************************************************************/
    // Private Functions
    /************************************************************/

    /**
     * Create new Visit in our DB
     * @param $arr
     * @return VisitKSA|bool|\Illuminate\Database\Eloquent\Model
     */
    private function create($arr){
        if ( !is_array($arr) )
            return false;
        $data = [
            'visit_id'                      =>  $arr['visit_id'],
            'visit_start'                   =>  $arr['visit_start'],
            'visit_finish'                  =>  $arr['visit_finish'],
            'current_customer_lng'          =>  $arr['current_customer_lng'],
            'current_customer_lat'          =>  $arr['current_customer_lat'],
            'last_visit_id'                 =>  $arr['last_visit_id'],
            'last_customer_lng'             =>  $arr['last_customer_lng'],
            'last_customer_lat'             =>  $arr['last_customer_lat'],
            'google_time_pessimistic'       =>  $arr['google_time_pessimistic'],
            'google_distance'               =>  $arr['google_distance'],
            'last_read_distance'            =>  $arr['last_read_distance'],
        ];
        return VisitKSA::create($data);
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
     * @param $start_time
     * @return array
     */
    private function get_new_visits($start_time){
        $visit_time = $start_time->last_visit;
        $salesman = $start_time->salesman;
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
, (
			SELECT TOP 1 T.Latitude
			FROM 
				(
				SELECT TOP 1 (UTCDateTime) , (SatelliteCount) , (SatellitesInView) , Latitude, Longitude
				FROM [dbo].[hh_salesman_gps] as gps
				WHERE 
				CAST(gps.UTCDateTime as Date) = CAST(visit.starttime as Date)
				AND gps.SalesManNo = visit.SalesmanNo
				AND gps.UTCDateTime < visit.starttime
				ORDER BY UTCDateTime DESC
				) AS T
			WHERE  T.SatelliteCount is NULL
				   AND T.SatellitesInView is NULL
			ORDER BY T.UTCDateTime ASC
			) AS first_gps_lat
			, (
			SELECT TOP 1 T.Longitude
			FROM 
				(
				SELECT TOP 1 (UTCDateTime) , (SatelliteCount) , (SatellitesInView) , Latitude, Longitude
				FROM [dbo].[hh_salesman_gps] as gps
				WHERE 
				CAST(gps.UTCDateTime as Date) = CAST(visit.starttime as Date)
				AND gps.SalesManNo = visit.SalesmanNo
				AND gps.UTCDateTime < visit.starttime
				ORDER BY UTCDateTime DESC
				) AS T
			WHERE  T.SatelliteCount is NULL
				   AND T.SatellitesInView is NULL
			ORDER BY T.UTCDateTime ASC
			) AS first_gps_lng
			,(
			SELECT TOP 1 T.Latitude 
			FROM 
				(
				SELECT TOP 2 (UTCDateTime) , (SatelliteCount) , (SatellitesInView) , Latitude, Longitude
				FROM [dbo].[hh_salesman_gps] as gps
				WHERE 
				CAST(gps.UTCDateTime as Date) = CAST(visit.starttime as Date)
				AND gps.SalesManNo = visit.SalesmanNo
				AND gps.UTCDateTime < visit.starttime
				ORDER BY UTCDateTime DESC
				) AS T
			WHERE  T.SatelliteCount is NULL
				   AND T.SatellitesInView is NULL
			ORDER BY T.UTCDateTime ASC
			) AS second_gps_lat
			,(
			SELECT TOP 1 T.Longitude 
			FROM 
				(
				SELECT TOP 2 (UTCDateTime) , (SatelliteCount) , (SatellitesInView) , Latitude, Longitude
				FROM [dbo].[hh_salesman_gps] as gps
				WHERE 
				CAST(gps.UTCDateTime as Date) = CAST(visit.starttime as Date)
				AND gps.SalesManNo = visit.SalesmanNo
				AND gps.UTCDateTime < visit.starttime
				ORDER BY UTCDateTime DESC
				) AS T
			WHERE  T.SatelliteCount is NULL
				   AND T.SatellitesInView is NULL
			ORDER BY T.UTCDateTime ASC
			) AS second_gps_lng

      FROM [dbo].[V_HH_VisitDuration] as visit
      INNER JOIN dbo.HH_VisitVerification as verify ON visit.ID = verify.VisitNo
      WHERE visit.starttime > ? 
            AND visit.SalesmanNo = ?  
        ", [$visit_time , $salesman]);

        return empty($new_visits)? false : $new_visits;
    }

    // Get last visits between two dates
    private function get_visits_bet_dates($startDate , $endDate){
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
, (
			SELECT TOP 1 T.Latitude
			FROM 
				(
				SELECT TOP 1 (UTCDateTime) , (SatelliteCount) , (SatellitesInView) , Latitude, Longitude
				FROM [dbo].[hh_salesman_gps] as gps
				WHERE 
				CAST(gps.UTCDateTime as Date) = CAST(visit.starttime as Date)
				AND gps.SalesManNo = visit.SalesmanNo
				AND gps.UTCDateTime < visit.starttime
				ORDER BY UTCDateTime DESC
				) AS T
			WHERE  T.SatelliteCount is NULL
				   AND T.SatellitesInView is NULL
			ORDER BY T.UTCDateTime ASC
			) AS first_gps_lat
			, (
			SELECT TOP 1 T.Longitude
			FROM 
				(
				SELECT TOP 1 (UTCDateTime) , (SatelliteCount) , (SatellitesInView) , Latitude, Longitude
				FROM [dbo].[hh_salesman_gps] as gps
				WHERE 
				CAST(gps.UTCDateTime as Date) = CAST(visit.starttime as Date)
				AND gps.SalesManNo = visit.SalesmanNo
				AND gps.UTCDateTime < visit.starttime
				ORDER BY UTCDateTime DESC
				) AS T
			WHERE  T.SatelliteCount is NULL
				   AND T.SatellitesInView is NULL
			ORDER BY T.UTCDateTime ASC
			) AS first_gps_lng
			,(
			SELECT TOP 1 T.Latitude 
			FROM 
				(
				SELECT TOP 2 (UTCDateTime) , (SatelliteCount) , (SatellitesInView) , Latitude, Longitude
				FROM [dbo].[hh_salesman_gps] as gps
				WHERE 
				CAST(gps.UTCDateTime as Date) = CAST(visit.starttime as Date)
				AND gps.SalesManNo = visit.SalesmanNo
				AND gps.UTCDateTime < visit.starttime
				ORDER BY UTCDateTime DESC
				) AS T
			WHERE  T.SatelliteCount is NULL
				   AND T.SatellitesInView is NULL
			ORDER BY T.UTCDateTime ASC
			) AS second_gps_lat
			,(
			SELECT TOP 1 T.Longitude 
			FROM 
				(
				SELECT TOP 2 (UTCDateTime) , (SatelliteCount) , (SatellitesInView) , Latitude, Longitude
				FROM [dbo].[hh_salesman_gps] as gps
				WHERE 
				CAST(gps.UTCDateTime as Date) = CAST(visit.starttime as Date)
				AND gps.SalesManNo = visit.SalesmanNo
				AND gps.UTCDateTime < visit.starttime
				ORDER BY UTCDateTime DESC
				) AS T
			WHERE  T.SatelliteCount is NULL
				   AND T.SatellitesInView is NULL
			ORDER BY T.UTCDateTime ASC
			) AS second_gps_lng

      FROM [dbo].[V_HH_VisitDuration] as visit
      INNER JOIN dbo.HH_VisitVerification as verify ON visit.ID = verify.VisitNo
      WHERE visit.starttime >= ? AND visit.starttime < ?  AND visit.SalesmanNo like 'KSA%'
        ", [$startDate , $endDate]);

        return empty($new_visits)? false : $new_visits;
    }

    /**
     * get Last visit in our database
     */
    private function get_last_visit()
    {
        // $last_visit_time = DB::select('SELECT concat( MAX(visit_start) ) as last_visit FROM visits');
        // fix bug getting time for only one salesman
        $last_visit_times = DB::select("
        SELECT 
        MAX(visit_start)   as last_visit ,
        SUBSTRING(visit_id, 1, 6) as salesman 
        FROM [GoogleVisitsKSA]
        GROUP BY  SUBSTRING(visit_id, 1, 6)
        --HAVING  SUBSTRING(visit_id, 1, 6) LIKE 'IRQ%'
        ");
        $res = [];
        foreach ($last_visit_times as $last_visit_time){
            if (empty($last_visit_time)){
                continue;
            }
            $res[] = $last_visit_time;
        }
        return empty($res)? false : $res;
    }

    /**]
     * check if the visit exists in our DB
     * @param $visit_id
     * @return bool
     */
    private function check_duplicate($visit_id){
        $exist = DB::select('SELECT visit_id FROM GoogleVisitsKSA WHERE visit_id = ? ',[$visit_id]);
        return empty($exist)? false : true;
    }

    private function check_first_visit_inDay($visit_data){
        if ($visit_data['last_customer_lat']==0 || !isset($visit_data['last_customer_lat']) )
            return true;
        if ($visit_data['last_customer_lng']==0 || !isset($visit_data['last_customer_lng']))
            return true;
        return false;
    }

    private function check_error_visit_latlng($visit_data){
        if ($visit_data['current_customer_lng']==0 || !isset($visit_data['current_customer_lng']) )
            return true;
        if ($visit_data['current_customer_lat']==0 || !isset($visit_data['current_customer_lat']))
            return true;
        return false;
    }

    private function check_last_GPS_is_Visit($visit_data){
        if ($visit_data['first_gps_lat']==0 || !isset($visit_data['first_gps_lat']) )
            return true;
        if ($visit_data['first_gps_lng']==0 || !isset($visit_data['first_gps_lng']))
            return true;
        if ($visit_data['second_gps_lat']==0 || !isset($visit_data['second_gps_lat']) )
            return true;
        if ($visit_data['second_gps_lng']==0 || !isset($visit_data['second_gps_lng']))
            return true;
        return false;
    }

    /**
     * Calculate The Distance between two GPS readings
     * @param $data
     * @return bool|int
     */
    private function calculateDistanceP($data) {
        try{
            $lat1 = $data['first_gps_lat'];
            $lon1 = $data['first_gps_lng'];
            $lat2 = $data['second_gps_lat'];
            $lon2 = $data['second_gps_lng'];
            $theta = $lon1 - $lon2;
            $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
            $dist = acos($dist);
            $dist = rad2deg($dist);
            $miles = $dist * 60 * 1.1515;
            return (int)(($miles * 1.609344)*1000);
        }
        catch (\Exception $exception){
            return FALSE;
        }
    }

}
