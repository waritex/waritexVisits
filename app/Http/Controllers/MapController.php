<?php

namespace App\Http\Controllers;

use App\MapUser;
use App\Nolocation;
use App\Route;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;

class MapController extends Controller
{
    // Show Web edition
    public function showWeb()
    {
        return view('map');
    }

    // Get today's Customers in Route
    public function get_customers(Request $request)
    {
        $salesman = $request->post('salesman',false);
        if (!$salesman)
            return response()->json('Error In User Please Ask Waritex For This',500);
        $today = now()->toDateString();
        $weekNumber = $this->get_salesbuzz_week_number();
        $dayString = $this->get_today_name();
        // get customers's route:
        if (!$todayCustomers = $this->get_today_routes_from_salesbuzz($salesman , $weekNumber , $dayString))
            return response()->json('No Customers In Today\'s Route',500);
        // get today's visits:
        $date_range = now()->addDays(-6)->toDateString();
        if (! $visits = $this->get_today_visits_ordered($salesman,$today,$date_range)){
            return $todayCustomers;
        }
        $res = [];
        foreach ($todayCustomers as $customer){
            foreach ($visits as $visit){
                if ( trim($visit->customer_id) === trim($customer->CustomerID) ){
                    $customer->visited = 1;
                    $customer->visit_info = $visit;
                    if ( trim($visit->visit_date) !== $today){
                        continue 2;
                    }
                    break;
                }
            }
            $res[] = $customer;
        }

        $res = collect($res);
        $res = $res->sortBy('visit_info.visit_time');
        return $res->values()->all();
//        return $res;
//        return response()->json($res , 200 ,['Content-type'=> 'application/json; charset=utf-8'], JSON_UNESCAPED_UNICODE);
    }

    // Get Customers without location data
    public function get_no_loc(Request $request){
        $salesman = $request->post('salesman',false);
        if (!$salesman)
            return response()->json('Error In User Please Retry Or Select Salesman',500);
        $today = now()->toDateString();
        $weekNumber = $this->get_salesbuzz_week_number();
        $dayString = $this->get_today_name();
        return $this->get_no_location_customers_salesbuzz($salesman,$weekNumber,$dayString);
        if (!$todayCustomers = $this->get_no_location_customers_salesbuzz($salesman,$weekNumber,$dayString))
            return response()->json('No Customers With No Location Data In Today\'s Route',500);
        $date_range = now()->addDays(-6)->toDateString();
        if (! $visits = $this->get_today_visits_ordered($salesman,$today,$date_range)){
            return $todayCustomers;
        }
        $res = [];
        foreach ($todayCustomers as $customer){
            foreach ($visits as $visit){
                if ( trim($visit->customer_id) === trim($customer->CustomerID) ){
                    $customer->visited = 1;
                    if ( trim($visit->visit_date) !== $today){
                        continue 2;
                    }
                    break;
                }
            }
            $res[] = $customer;
        }

        $res = collect($res);
        $res = $res->sortBy('visit_info.visit_time');
        return $res->values()->all();
    }


    // Not Used Yet........................................
    public function get_custoemrs_supervisor(Request $request)
    {
        $salesman = $request->post('salesman',false);
        if (!$salesman)
            return response()->json('Error In User Please Ask Waritex For This',500);
        // check he's a supervisor
        $supervisor = MapUser::where('code',$salesman)->where('supervisor',1)->first();
        if(!$supervisor)
            return;

        // get all his salesmans
        $salesmans = MapUser::where('buid',$supervisor->buid)->get('code');

        // get all customers sorted by salesman
        $todayCustomers = Route::whereIn('SalesmanCode',$salesmans)->orderBy('SalesmanCode')->get();

        // get all visits

        // format response
    }


    ///////////////////////////////////////////////
    // Date Functions
    ///////////////////////////////////////////////
    /**
     * Get SalesBuzz Week Number for Journey/Route
     * @return int
     * get (number of days in the year) - (number of days in the first week of year if the year doesn't starts on Saturday)
     */
    public function get_salesbuzz_week_number(){
        /**
         * dayOfWeek+1          1 (for Sunday) through 7 (for Saturday)
         * dayOfYear            0 through 365 (for normal years)
         */

        $today = Carbon::today();

        $f1 = today()->firstOfYear();

        $diffDays = 7 - ($f1->dayOfWeek+1);

        $numDays = ($today->dayOfYear+1) - $diffDays;

        $numWeeks = ceil($numDays/7+1);

        $weekNum = $numWeeks % 4 ;

        return $weekNum==0 ? 4 : $weekNum;
    }

    /**
     * Get Today's Name as String (Sat,Sun,Mon,...etc)
     * @return false|string
     */
    public function get_today_name(){
        return $today = date('D');
    }
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////


    ///////////////////////////////////////////////
    // DataBase Functions
    ///////////////////////////////////////////////
    private function get_today_routes_from_salesbuzz($salesman , $weekNum , $day){
        $routes = DB::connection('wri')->select("
      SELECT 
       V_JPlans.[AssignedTO]			as SalesmanCode
      ,V_JPlans.[CustomerID]			as CustomerID
	  ,HH_Customer.[CustomerNameA]		as CustomerName
	  ,HH_Customer.[Latitude]			as Lat
      ,HH_Customer.[Longitude]			as Lng
      ,ROUND(Balance , 0)               as Balance
      --,V_JPlans.[StartWeek]
      --,V_JPlans.[sat]
      --,V_JPlans.[sun]
      --,V_JPlans.[mon]
      --,V_JPlans.[tue]
      --,V_JPlans.[wed]
      --,V_JPlans.[thu]
      --,V_JPlans.[fri]
      FROM [WaritexLive].[dbo].[V_JPlans]
      INNER JOIN HH_Customer ON HH_Customer.CustomerNo = V_JPlans.CustomerID
      WHERE V_JPlans.[AssignedTO] = ?   AND  V_JPlans.[StartWeek] = ?  AND V_JPlans.$day = 1
      AND (HH_Customer.[Latitude] != 0 AND HH_Customer.[Latitude] IS NOT NULL)
        " , [$salesman , $weekNum]);

        return empty($routes)? false : $routes;
    }

    private function get_today_visits_ordered($salesman , $date , $dateRange){
        $visits = DB::connection('wri')->select("
        SELECT 
          dbo.V_HH_VisitDuration.ID					        AS visit_id
        , dbo.V_HH_VisitDuration.CUstomerNo			        AS customer_id
        , CAST( dbo.V_HH_VisitDuration.starttime AS Date )  AS visit_date
		, CAST( dbo.V_HH_VisitDuration.starttime AS Time )  AS visit_time
        , row_number() OVER (ORDER BY starttime asc)        AS 'order'			 
        FROM dbo.V_HH_VisitDuration
        
        WHERE 
        ( CAST( dbo.V_HH_VisitDuration.starttime as Date ) between ? and  ? ) AND ( dbo.V_HH_VisitDuration.SalesmanNo = ? )
		ORDER BY visit_time ASC	  
        " , [$dateRange , $date , $salesman]);

        return empty($visits)? false : $visits;
    }

    private function get_no_location_customers_salesbuzz($salesman , $weekNum , $day){
        $customers = DB::connection('wri')->select("
        SELECT 
       V_JPlans.[AssignedTO]			as SalesmanCode
      ,V_JPlans.[CustomerID]			as CustomerID
	  ,HH_Customer.[CustomerNameA]		as CustomerName
      ,ROUND(Balance , 0)               as Balance
	  ,HH_Area.areanamea				as Area
	  ,HH_City.citynamea				as City
	  ,HH_District.districtnamea		as District
	  ,HH_Region.regionnamea			as Region
	  ,HH_Customer.address				as Address
	  ,HH_Customer.tel					as Tel
	  ,HH_Customer.mobile				as Mobile

      FROM [WaritexLive].[dbo].[V_JPlans]
      INNER JOIN HH_Customer ON HH_Customer.CustomerNo = V_JPlans.CustomerID
	  LEFT JOIN HH_Area ON HH_Customer.areano = HH_Area.areano
	  LEFT JOIN HH_City ON HH_Customer.cityno = HH_City.cityno
	  LEFT JOIN HH_District ON HH_Customer.districtno = HH_District.districtno
	  LEFT JOIN HH_Region ON HH_Customer.regionno = HH_Region.regionno
	  WHERE 
	  V_JPlans.[AssignedTO] = ?   AND  V_JPlans.[StartWeek] = ?  AND V_JPlans.$day = 1
      AND (HH_Customer.[Latitude] = 0 OR HH_Customer.[Latitude] IS NULL)
        " , [$salesman , $weekNum]);
        return empty($customers)? false : $customers;
    }
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

}
