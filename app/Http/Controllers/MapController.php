<?php

namespace App\Http\Controllers;

use App\MapUser;
use GuzzleHttp\Client;
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

    public function showKSAWeb()
    {
        $ksaData = DB::connection('wri')->select("
SELECT
cus.CustomerNo
, cus.CustomerNameA
, cus.SalesmanNo
, cus.Balance
, cus.Latitude  , cus.Longitude
, ord.total
, ord.numbero
, reg.RegionNameA , dis.DistrictNameA , city.CityNameA , area.AreaNameA
FROM HH_Customer as cus
left join HH_Region reg on cus.RegionNo = reg.RegionNo and reg.buid = cus.BUID
left join HH_District dis on cus.DistrictNo = dis.DistrictNo and dis.buid = cus.BUID
left join HH_City city on cus.CityNo = city.CityNo and city.buid = cus.BUID and city.CityNameA!='ملغي'
left join HH_Area area on cus.AreaNo = area.AreaNo and area.buid = cus.BUID
left join (
SELECT SUM(NetTotal)as total , count(OrderID)as numbero , CustomerNo from AR_Order where buid = 103 group by CustomerNo
)
as ord on cus.CustomerNo = ord.CustomerNo
WHERE cus.BUID = 103
order by Balance desc
        " );
        $ksaData =  json_encode($ksaData);
        return view('KSA' , compact('ksaData'));
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

    // get Schedule routes
    public function get_schedule(Request $request)
    {
        $salesman = $request->post('salesman',false);
        if (!$salesman)
            return response()->json('Error In User Please Retry Or Select Salesman',500);
        $today = now()->toDateString();
        $weekNumber = $this->get_salesbuzz_week_number();
        $dayString = $this->get_today_name();
        if (!$schedule = $this->get_route_schedule($salesman))
            return response()->json('Error In User Please Retry',500);
        $res = collect($schedule);
        $weeks =  $res->groupBy('Week');
        $s = [];
        foreach ($weeks as $w => $week){
            $s[$w] = $week->groupBy('OrDay');
        }
        return ['route'=>$s , 'week'=>$weekNumber , 'day'=>strtoupper($dayString)];
    }

    public function get_car_location(Request $request){
        $salesman = $request->post('salesman',false);
        if (!$salesman)
            return response()->json('Error In User Please Retry Or Select Salesman',500);
        // get car code
        $user = MapUser::where('code',$salesman)->first();
        $carcode = $user->carcode;
        // get from gettyTrack API
        $postionData = $this->get_car_postion($carcode);
        if ($postionData === false){
            return response()->json('No Car Data From GettyTrack' , 500);
        }
        else{
            try{
                $data['lat'] = $postionData['vehicle'][0]['latitude'];
                $data['lng'] = $postionData['vehicle'][0]['longitude'];
                $data['time'] = Carbon::createFromTimestamp($postionData['vehicle'][0]['unix_ts']);
            }
            catch (\Exception $e){}
            return response()->json($data , 200);
        }
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
      ,case  when ROUND(Balance , 0) =0 then null else    ROUND(Balance , 0)  end          as Balance
      ,CASE WHEN hh_CustomerAttr.AttrID = 'مقطوع جلي' OR hh_CustomerAttr.AttrID = 'غير متعامل جلي' THEN 1 ELSE 0 END as Deal
      FROM [WaritexLive].[dbo].[V_JPlans]
      INNER JOIN HH_Customer ON HH_Customer.CustomerNo = V_JPlans.CustomerID
      LEFT JOIN hh_CustomerAttr on hh_CustomerAttr.CustomerNo = V_JPlans.CustomerID and hh_CustomerAttr.AttrID in ('مقطوع جلي','متعامل جلي','غير متعامل جلي')
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

    private function get_route_schedule($salesman)
    {
        $SQL = "
        SELECT 
       distinct (AreaNameA) as Area
	   , CityNameA as City
	   , DistrictNameA as District
	   , RegionNameA as Region
      ,V_JPlans.[StartWeek] as Week  
      ,'SAT' as Day , 'السبت' as ArDay , 1 as OrDay
      FROM [WaritexLive].[dbo].[V_JPlans]
      INNER JOIN HH_Customer ON HH_Customer.CustomerNo = V_JPlans.CustomerID
	  INNER JOIN HH_Region ON HH_Customer.RegionNo = HH_Region.RegionNo
	  INNER JOIN HH_District ON HH_Customer.DistrictNo = HH_District.DistrictNo
	  INNER JOIN HH_City ON HH_Customer.CityNo = HH_City.CITYNO
	  INNER JOIN HH_Area ON HH_Customer.AreaNo = HH_Area.AreaNo
      WHERE V_JPlans.[AssignedTO] = ?   and V_JPlans.sat  = 1
	  union 
	  (SELECT 
       distinct (AreaNameA)
	   , CityNameA
	   , DistrictNameA
	   , RegionNameA
      ,V_JPlans.[StartWeek]
      ,'SUN' , 'الأحد'  , 2
      FROM [WaritexLive].[dbo].[V_JPlans]
      INNER JOIN HH_Customer ON HH_Customer.CustomerNo = V_JPlans.CustomerID
	  INNER JOIN HH_Region ON HH_Customer.RegionNo = HH_Region.RegionNo
	  INNER JOIN HH_District ON HH_Customer.DistrictNo = HH_District.DistrictNo
	  INNER JOIN HH_City ON HH_Customer.CityNo = HH_City.CITYNO
	  INNER JOIN HH_Area ON HH_Customer.AreaNo = HH_Area.AreaNo
      WHERE V_JPlans.[AssignedTO] = ?   and V_JPlans.sun  = 1
	  )
	  union 
	  (SELECT 
       distinct (AreaNameA)
	   , CityNameA
	   , DistrictNameA
	   , RegionNameA
      ,V_JPlans.[StartWeek]
      ,'MON', 'الأثنين' , 3
      FROM [WaritexLive].[dbo].[V_JPlans]
      INNER JOIN HH_Customer ON HH_Customer.CustomerNo = V_JPlans.CustomerID
	  INNER JOIN HH_Region ON HH_Customer.RegionNo = HH_Region.RegionNo
	  INNER JOIN HH_District ON HH_Customer.DistrictNo = HH_District.DistrictNo
	  INNER JOIN HH_City ON HH_Customer.CityNo = HH_City.CITYNO
	  INNER JOIN HH_Area ON HH_Customer.AreaNo = HH_Area.AreaNo
      WHERE V_JPlans.[AssignedTO] = ?   and V_JPlans.mon  = 1
	  )
	  union 
	  (SELECT 
       distinct (AreaNameA)
	   , CityNameA
	   , DistrictNameA
	   , RegionNameA
      ,V_JPlans.[StartWeek]
      ,'TUE', 'الثلاثاء' , 4
      FROM [WaritexLive].[dbo].[V_JPlans]
      INNER JOIN HH_Customer ON HH_Customer.CustomerNo = V_JPlans.CustomerID
	  INNER JOIN HH_Region ON HH_Customer.RegionNo = HH_Region.RegionNo
	  INNER JOIN HH_District ON HH_Customer.DistrictNo = HH_District.DistrictNo
	  INNER JOIN HH_City ON HH_Customer.CityNo = HH_City.CITYNO
	  INNER JOIN HH_Area ON HH_Customer.AreaNo = HH_Area.AreaNo
      WHERE V_JPlans.[AssignedTO] = ?   and V_JPlans.tue  = 1
	  )
	  union 
	  (SELECT 
       distinct (AreaNameA)
	   , CityNameA
	   , DistrictNameA
	   , RegionNameA
      ,V_JPlans.[StartWeek]
      ,'WED', 'الأربعاء' , 5
      FROM [WaritexLive].[dbo].[V_JPlans]
      INNER JOIN HH_Customer ON HH_Customer.CustomerNo = V_JPlans.CustomerID
	  INNER JOIN HH_Region ON HH_Customer.RegionNo = HH_Region.RegionNo
	  INNER JOIN HH_District ON HH_Customer.DistrictNo = HH_District.DistrictNo
	  INNER JOIN HH_City ON HH_Customer.CityNo = HH_City.CITYNO
	  INNER JOIN HH_Area ON HH_Customer.AreaNo = HH_Area.AreaNo
      WHERE V_JPlans.[AssignedTO] = ?   and V_JPlans.wed  = 1
	  )
	  union 
	  (SELECT 
       distinct (AreaNameA)
	   , CityNameA
	   , DistrictNameA
	   , RegionNameA
      ,V_JPlans.[StartWeek]
      ,'THU', 'الخميس' , 6
      FROM [WaritexLive].[dbo].[V_JPlans]
      INNER JOIN HH_Customer ON HH_Customer.CustomerNo = V_JPlans.CustomerID
	  INNER JOIN HH_Region ON HH_Customer.RegionNo = HH_Region.RegionNo
	  INNER JOIN HH_District ON HH_Customer.DistrictNo = HH_District.DistrictNo
	  INNER JOIN HH_City ON HH_Customer.CityNo = HH_City.CITYNO
	  INNER JOIN HH_Area ON HH_Customer.AreaNo = HH_Area.AreaNo
      WHERE V_JPlans.[AssignedTO] = ?   and V_JPlans.thu  = 1
	  )
	  ORDER BY StartWeek
        ";
        $schedule = DB::connection('wri')->select($SQL , [$salesman , $salesman , $salesman , $salesman , $salesman , $salesman]);
        return empty($schedule) ? false  : $schedule;
    }
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

    // Car functions
    private function get_car_postion($carcode){
        $http = new Client;
        // Parameters:
        /////////////////////////////////////
        $url = env('GPS_URL',false);
        $username = env('GPS_USER',false);
        $password = env('GPS_PASS',false);
        $car = $carcode;
        if ( !($username && $password && $car) )
            return false;
        /////////////////////////////////////
        try{
            $response = $http->get("$url?u=$username&p=$password&v=$car");
        }
        catch (\Exception $exception){
            return false;
        }

        return json_decode((string) $response->getBody(), true);
    }

}
