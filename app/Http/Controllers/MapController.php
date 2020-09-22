<?php

namespace App\Http\Controllers;

use App\InfoEvents;
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

    // Get today's Customers in Route for a Salesman
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
        $info = $this->get_customer_items_info($salesman,$weekNumber,$dayString);
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
            foreach ($info as $i=>$v){
                if ( trim($i) === trim($customer->CustomerID) ){
                    $customer->info = $info[$i];
                }
            }
            $res[] = $customer;
        }

        $res = collect($res);
        $res = $res->sortBy('visit_info.visit_time');
        $this->save_info($request);
        return $res->values()->all();
//        return $res;
//        return response()->json($res , 200 ,['Content-type'=> 'application/json; charset=utf-8'], JSON_UNESCAPED_UNICODE);
    }

    // Get today's Customers in Route for all Salesmans
    public function get_all_customers(Request $request)
    {
        $salesmans = ['IRQ004','IRQ006','IRQ007','IRQ008','IRQ011'];
        $today = now()->toDateString();
        $weekNumber = $this->get_salesbuzz_week_number();
        $dayString = $this->get_today_name();
        $date_range = now()->addDays(-6)->toDateString();
        $result = [];
        foreach ($salesmans as $salesman){
            try{
                // get car code
                $user = MapUser::where('code',$salesman)->first();
                $name = $user->name;
                $result[$salesman]['name'] = $name;
                $carcode = $user->carcode;
                // get from gettyTrack API
                $postionData = $this->get_car_postion($carcode);
                if ($postionData === false){
                    $result[$salesman]['car'] = 'no car data';
                }
                else{
                    try{
                        $data['lat'] = $postionData['vehicles'][0]['latitude'];
                        $data['lng'] = $postionData['vehicles'][0]['longitude'];
                        $data['time'] = Carbon::createFromTimestamp($postionData['vehicle'][0]['unix_ts']);
                    }
                    catch (\Exception $e){}
                    $result[$salesman]['car'] = $data;
                }
                $todayCustomers = $this->get_today_routes_from_salesbuzz($salesman , $weekNumber , $dayString);
                if (! $visits = $this->get_today_visits_ordered($salesman,$today,$date_range)){
                    $result[$salesman]['customers'] = $todayCustomers;
                }
                else{
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
                    $result[$salesman]['customers'] = $res->values()->all();
                }
            }
            catch (\Exception $exception){
                $result[$salesman]['customers'] = $exception;
                continue;
            }
        }
        return $result;
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
                $data['lat'] = $postionData['vehicles'][0]['latitude'];
                $data['lng'] = $postionData['vehicles'][0]['longitude'];
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

    public function get_customers_by_areas(Request $request)
    {
        $salesman = $request->post('salesman',false);
        if (!$salesman)
            return response()->json('Error In User Please Ask Waritex For This',500);
        $today = now()->toDateString();
        // get customers's route:
        if (!$Customers = $this->get_routes_customers_by_area($salesman))
            return response()->json('No Customers In Today\'s Route',500);
        $info = $this->get_customer_items_info($salesman,false,false);
        $res = [];
        foreach ($Customers as $customer){
            foreach ($info as $i=>$v){
                if ( trim($i) === trim($customer->CustomerID) ){
                    $customer->info = $info[$i];
                }
            }
            $res[] = $customer;
        }
        $res = collect($res)->groupBy('city');
        try{
            $buid = MapUser::where('code', $salesman)->first()->buid;
            $avgs = $this->getVisitsAvg($buid , $salesman);
        }
        catch (\Exception $exception){}
        return compact('res' , 'avgs');
    }

    public function get_report_by_areas(Request $request)
    {
        $salesman = $request->post('salesman',false);
        if (!$salesman)
            return response()->json('Error In User Please Ask Waritex For This',500);
        $today = now()->toDateString();
        // get customers's route:
        if (!$Customers = $this->getReportInfo($salesman))
            return response()->json('No Customers In Today\'s Route',500);
        return $Customers;
    }

    public function save_info(Request $request)
    {
        $info = $request->post('info',false);
        if ($info!==false && $info!=='null' && $info!==null){
            foreach ($info as $i){
                if (empty($i))
                    continue;
                $data = [
                    'customerID'        => $i['cus_id'],
                    'salesmanID'        => $i['salesman_id'],
                    'dateTime'          => Carbon::parse($i['date_time']),
                ];
                InfoEvents::create($data);
            }
        }

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
SELECT *
, CASE WHEN t.LastInvoiceDate > 90 THEN 1 ELSE CASE WHEN t.LastInvoiceDate > 30 THEN 2 ELSE 0 END END as DealCut
, CASE WHEN t.LastVisitDate > 28 THEN 1 ELSE 0 END as VisitCut
, CASE WHEN t.LastVisitDate < 28 THEN 1 ELSE 0 END AS visited
, ISNULL(CONVERT(DECIMAL(10,0),(t.TotalSales/t.InvNumber) ),0) as AVGSales
, CASE WHEN RegionNo != 'BGH' THEN ('م. ' + RegionNameA) ELSE CityNameA end as city
,
CASE WHEN (t.LastVisitDate > 15 AND t.LastVisitDate <= 28) THEN '{\"fillColor\":\"green\" , \"path\":\"M 0 -7 C -1 -7 -1 -7 -3 -7 A 10 10 0 1 1 3 -7 C 2 -7 1 -7 0 -7 z M -2 -6 a 2 2 0 1 1 4 0 a 2 2 0 1 1 -4 0\"}' ELSE
	CASE WHEN (t.LastVisitDate <= 15 AND t.distance < 100 AND t.opened = 1) THEN '{\"fillColor\":\"lawngreen\" , \"path\":\"M 0 -7 C -1 -7 -1 -7 -3 -7 A 10 10 0 1 1 3 -7 C 2 -7 1 -7 0 -7 z M -2 -6 a 2 2 0 1 1 4 0 a 2 2 0 1 1 -4 0\"}' ELSE
		CASE WHEN (t.LastVisitDate <= 15 AND t.distance < 100 AND t.opened is NULL) THEN '{\"fillColor\":\"orange\" , \"path\":\"M 0 -7 C -1 -7 -1 -7 -3 -7 A 10 10 0 1 1 3 -7 C 2 -7 1 -7 0 -7 z M -2 -6 a 2 2 0 1 1 4 0 a 2 2 0 1 1 -4 0\"}' ELSE
			CASE WHEN (t.LastVisitDate <= 15 AND t.distance > 100) THEN '{\"fillColor\":\"red\" , \"path\":\"M 0 -7 C -1 -7 -1 -7 -3 -7 A 10 10 0 1 1 3 -7 C 2 -7 1 -7 0 -7 z M -2 -6 a 2 2 0 1 1 4 0 a 2 2 0 1 1 -4 0\"}' ELSE NULL
			END
		END
	END
END as svg
FROM
(
SELECT 
V_JPlans.[AssignedTO]			as SalesmanCode
,V_JPlans.[CustomerID]			as CustomerID
,HH_Customer.[CustomerNameA]		as CustomerName
,HH_Customer.[Latitude]			as Lat
,HH_Customer.[Longitude]			as Lng
, ( SELECT ISNULL(DATEDIFF(DAY,MAX(ord.Date),GETDATE()),999) FROM AR_Order as ord WHERE ord.CustomerNo = V_JPlans.CustomerID ) as LastInvoiceDate
, ( SELECT ISNULL(DATEDIFF(DAY,MAX(visit.starttime),GETDATE()),999) FROM V_HH_VisitDuration as visit WHERE visit.CUstomerNo = V_JPlans.CustomerID AND ( (visit.PositiveVisit=1) OR (visit.PositiveVisit=0 and visit.NCReasonID IS NOT NULL) ) ) as LastVisitDate
, ( SELECT CONVERT(VARCHAR(10),MAX(ord.Date),111) FROM AR_Order as ord WHERE ord.CustomerNo = V_JPlans.CustomerID ) as LastInvoiceD
, ( SELECT CONVERT(VARCHAR(10),MAX(visit.starttime),111) FROM V_HH_VisitDuration as visit WHERE visit.CUstomerNo = V_JPlans.CustomerID AND ( (visit.PositiveVisit=1) OR (visit.PositiveVisit=0 and visit.NCReasonID IS NOT NULL) ) ) as LastVisitD
, ( SELECT SUM(ord.Total) FROM WR_IRQ_ALL_SALES as ord WHERE ord.CustomerNo = V_JPlans.CustomerID ) as TotalSales
, ( SELECT count(ord.OrderID) FROM (SELECT OrderID FROM WR_IRQ_ALL_SALES as ord WHERE ord.CustomerNo = V_JPlans.CustomerID group by ord.OrderID) as ord ) as InvNumber
, ( SELECT CONVERT(VARCHAR(10),MAX(s.Date),111) FROM WR_IRQ_ALL_SALES as s WHERE s.CustomerNo = V_JPlans.CustomerID and s.ItemID = 'IRQ034') as Stand
, ( SELECT DATEDIFF(DAY,MAX(s.Date),GETDATE()) FROM WR_IRQ_ALL_SALES as s WHERE s.CustomerNo = V_JPlans.CustomerID and s.ItemID = 'IRQ034') as Standday
, ( SELECT ISNULL(CONVERT(DECIMAL(10,0),(MAX(tsales.total)) ),0) FROM (SELECT SUM(s.Total) as total FROM WR_IRQ_ALL_SALES as s WHERE s.CustomerNo = V_JPlans.CustomerID group by s.OrderID) as tsales ) as MaxSales
, HH_Customer.CityNo
, HH_Customer.RegionNo
, HH_Region.RegionNameA
, HH_City.CityNameA
, CASE WHEN wr.last_visit_lat is null or wr.last_visit_lon is NULL THEN NULL ELSE (geography::Point(ISNULL(wr.last_visit_lat,0), isnull(wr.last_visit_lon,0), 4326).STDistance( geography::Point(HH_Customer.Latitude, HH_Customer.Longitude, 4326) ) ) END distance
, (
	SELECT top 1 1 FROM WR_Map_Info_Events as ev 
	WHERE ev.customerID = V_JPlans.CustomerID and ev.salesmanID = V_JPlans.[AssignedTO] 
	and ( (DATEDIFF(MINUTE,ev.dateTime,last_visit_date)-180 between -5 and 30)  ) 
) as opened

FROM [dbo].[V_JPlans]
INNER JOIN HH_Customer ON HH_Customer.CustomerNo = V_JPlans.CustomerID
LEFT JOIN hh_CustomerAttr as atr on atr.CustomerNO = V_JPlans.CustomerID and atr.AttrID = 'زبائن موجودة'
LEFT JOIN HH_Region on HH_Region.RegionNo = HH_Customer.RegionNo
LEFT JOIN HH_City on HH_City.CITYNO = HH_Customer.CityNo and HH_City.RegionNo = HH_Customer.RegionNo 
LEFT JOIN WR_Customers wr on wr.CustomerNo = V_JPlans.CustomerID and DATEDIFF(DAY , wr.last_visit_date , GETDATE() ) < 28
      WHERE V_JPlans.[AssignedTO] = ?   AND  V_JPlans.[StartWeek] = ?  AND V_JPlans.$day = 1
      AND (HH_Customer.[Latitude] != 0 AND HH_Customer.[Latitude] IS NOT NULL) and HH_Customer.inactive = 0
	  AND atr.AttrID is null
) as t
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

      FROM [dbo].[V_JPlans]
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
      FROM [dbo].[V_JPlans]
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
      FROM [dbo].[V_JPlans]
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
      FROM [dbo].[V_JPlans]
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
      FROM [dbo].[V_JPlans]
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
      FROM [dbo].[V_JPlans]
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
      FROM [dbo].[V_JPlans]
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

    public function get_customer_items_info($salesman=false , $weekNum=false , $day=false){
        $user = MapUser::where('code', $salesman)->first();
        $buid = $user->buid;
        $SQL = "
SELECT 
vp.[CustomerID]			as CustomerID
, t.*
, Convert(int,Round(t.QTY/t.DealNumber,0)) as avgQty
FROM [dbo].[V_JPlans] as vp
INNER JOIN HH_Customer ON HH_Customer.CustomerNo = vp.CustomerID
INNER JOIN
(
SELECT
ord.CustomerNo
, l.ItemID
, HH_Item.ItemNameA
, COUNT(distinct ord.Date) DealNumber
, DATEDIFF(DAY,MAX(ord.Date),GETDATE()) as days
, CASE WHEN DATEDIFF(DAY,MAX(ord.Date),GETDATE()) > 90 THEN 1 ELSE 0 END as CUT
, SUM(l.Qty) as QTY
FROM AR_OrderLines as l
INNER JOIN AR_Order as ord on ord.OrderID = l.OrderID
INNER JOIN HH_Item on HH_Item.ItemNo = l.ItemID
WHERE 1=1
and ord.BUID = ?
and l.FreeItem=0
AND HH_item.barcode2 != 2
GROUP BY ord.CustomerNo , l.ItemID , ItemNameA
) as t on t.CustomerNo = vp.CustomerID
";
        if ($weekNum===false && $day===false)
            $SQL = $SQL . " WHERE vp.[AssignedTO] = ?   ";
        else
            $SQL = $SQL . " WHERE vp.[AssignedTO] = ?   AND  vp.[StartWeek] = '$weekNum'  AND vp.$day = 1";

        $SQL = $SQL . " AND (HH_Customer.[Latitude] != 0 AND HH_Customer.[Latitude] IS NOT NULL)
ORDER BY t.DealNumber desc";

        $info = DB::connection('wri')->select($SQL , [$buid , $salesman ]);

        return empty($info)? false : collect($info)->groupBy('CustomerID');
    }

    private function get_routes_customers_by_area($salesman){
        $SQL = "
SELECT *
, CASE WHEN t.LastInvoiceDate > 90 THEN 1 ELSE CASE WHEN t.LastInvoiceDate > 30 THEN 2 ELSE 0 END END as DealCut
, CASE WHEN t.LastVisitDate > 28 THEN 1 ELSE 0 END as VisitCut
, CASE WHEN t.LastVisitDate < 28 THEN 1 ELSE 0 END AS visited
, ISNULL(CONVERT(DECIMAL(10,0),(t.TotalSales/t.InvNumber) ),0) as AVGSales
, CASE WHEN RegionNo != 'BGH' THEN ('م. ' + RegionNameA) ELSE CityNameA end as city
,
CASE WHEN (t.LastVisitDate > 15 AND t.LastVisitDate <= 28) THEN '{\"fillColor\":\"green\" , \"path\":\"M 0 -7 C -1 -7 -1 -7 -3 -7 A 10 10 0 1 1 3 -7 C 2 -7 1 -7 0 -7 z M -2 -6 a 2 2 0 1 1 4 0 a 2 2 0 1 1 -4 0\"}' ELSE
	CASE WHEN (t.LastVisitDate <= 15 AND t.distance < 100 AND t.opened = 1) THEN '{\"fillColor\":\"lawngreen\" , \"path\":\"M 0 -7 C -1 -7 -1 -7 -3 -7 A 10 10 0 1 1 3 -7 C 2 -7 1 -7 0 -7 z M -2 -6 a 2 2 0 1 1 4 0 a 2 2 0 1 1 -4 0\"}' ELSE
		CASE WHEN (t.LastVisitDate <= 15 AND t.distance < 100 AND t.opened is NULL) THEN '{\"fillColor\":\"orange\" , \"path\":\"M 0 -7 C -1 -7 -1 -7 -3 -7 A 10 10 0 1 1 3 -7 C 2 -7 1 -7 0 -7 z M -2 -6 a 2 2 0 1 1 4 0 a 2 2 0 1 1 -4 0\"}' ELSE
			CASE WHEN (t.LastVisitDate <= 15 AND t.distance > 100) THEN '{\"fillColor\":\"red\" , \"path\":\"M 0 -7 C -1 -7 -1 -7 -3 -7 A 10 10 0 1 1 3 -7 C 2 -7 1 -7 0 -7 z M -2 -6 a 2 2 0 1 1 4 0 a 2 2 0 1 1 -4 0\"}' ELSE NULL
			END
		END
	END
END as svg
FROM
(
SELECT 
V_JPlans.AssignedTO			as SalesmanCode
,V_JPlans.CustomerID			as CustomerID
,HH_Customer.CustomerNameA		as CustomerName
,HH_Customer.Latitude			as Lat
,HH_Customer.Longitude			as Lng
, HH_Customer.CityNo
, HH_Customer.RegionNo
, HH_Region.RegionNameA
, HH_City.CityNameA
, ( SELECT ISNULL(DATEDIFF(DAY,MAX(ord.Date),GETDATE()),999) FROM AR_Order as ord WHERE ord.CustomerNo = V_JPlans.CustomerID ) as LastInvoiceDate
, ( SELECT ISNULL(DATEDIFF(DAY,MAX(visit.starttime),GETDATE()),999) FROM V_HH_VisitDuration as visit WHERE visit.CUstomerNo = V_JPlans.CustomerID AND ( (visit.PositiveVisit=1) OR (visit.PositiveVisit=0 and visit.NCReasonID IS NOT NULL) ) ) as LastVisitDate
, ( SELECT CONVERT(VARCHAR(10),MAX(ord.Date),111) FROM AR_Order as ord WHERE ord.CustomerNo = V_JPlans.CustomerID ) as LastInvoiceD
, ( SELECT CONVERT(VARCHAR(10),MAX(visit.starttime),111) FROM V_HH_VisitDuration as visit WHERE visit.CUstomerNo = V_JPlans.CustomerID AND ( (visit.PositiveVisit=1) OR (visit.PositiveVisit=0 and visit.NCReasonID IS NOT NULL) ) ) as LastVisitD
, ( SELECT SUM(ord.Total) FROM WR_IRQ_ALL_SALES as ord WHERE ord.CustomerNo = V_JPlans.CustomerID ) as TotalSales
, ( SELECT count(ord.OrderID) FROM (SELECT OrderID FROM WR_IRQ_ALL_SALES as ord WHERE ord.CustomerNo = V_JPlans.CustomerID group by ord.OrderID) as ord ) as InvNumber
, ( SELECT CONVERT(VARCHAR(10),MAX(s.Date),111) FROM WR_IRQ_ALL_SALES as s WHERE s.CustomerNo = V_JPlans.CustomerID and s.ItemID = 'IRQ034') as Stand
, ( SELECT DATEDIFF(DAY,MAX(s.Date),GETDATE()) FROM WR_IRQ_ALL_SALES as s WHERE s.CustomerNo = V_JPlans.CustomerID and s.ItemID = 'IRQ034') as Standday
, ( SELECT ISNULL(CONVERT(DECIMAL(10,0),(MAX(tsales.total)) ),0) FROM (SELECT SUM(s.Total) as total FROM WR_IRQ_ALL_SALES as s WHERE s.CustomerNo = V_JPlans.CustomerID group by s.OrderID) as tsales ) as MaxSales
, atr.AttrID
, CASE WHEN (wr.valid = 1) THEN 9999 ELSE CASE WHEN (wr.valid = 2 OR wr.valid = 3) THEN 5 ELSE 9999 END END distance
, CASE WHEN (wr.valid = 1 OR wr.valid = 2) THEN NULL ELSE CASE WHEN (wr.valid = 3) THEN 1 ELSE NULL END END opened

FROM V_JPlans
INNER JOIN HH_Customer ON HH_Customer.CustomerNo = V_JPlans.CustomerID
LEFT JOIN hh_CustomerAttr as atr on atr.CustomerNO = V_JPlans.CustomerID and atr.AttrID = 'زبائن موجودة'
LEFT JOIN HH_Region on HH_Region.RegionNo = HH_Customer.RegionNo
LEFT JOIN HH_City on HH_City.CITYNO = HH_Customer.CityNo and HH_City.RegionNo = HH_Customer.RegionNo
LEFT JOIN (
SELECT
wr.CustomerNo, wr.visit_date, MAX(wr.valid) as valid
FROM WR_Visit_Validation wr
WHERE wr.last_visit = wr.visit_date
GROUP BY wr.CustomerNo , wr.visit_date
) wr ON wr.CustomerNo = V_JPlans.CustomerID AND DATEDIFF(DAY , wr.visit_date , GETDATE() ) < 28

WHERE 1=1
AND V_JPlans.AssignedTO = ?
AND V_JPlans.fri = 0
AND (HH_Customer.Latitude != 0 AND HH_Customer.Latitude IS NOT NULL) 
AND HH_Customer.inactive = 0
AND atr.AttrID is null
) as t
ORDER BY RegionNo , CityNameA
        ";

        $SQL2 = "
        SELECT *
, CASE WHEN t.LastInvoiceDate > 90 THEN 1 ELSE CASE WHEN t.LastInvoiceDate > 30 THEN 2 ELSE 0 END END as DealCut
, CASE WHEN t.LastVisitDate > 28 THEN 1 ELSE 0 END as VisitCut
, CASE WHEN t.LastVisitDate < 28 THEN 1 ELSE 0 END AS visited
, ISNULL(CONVERT(DECIMAL(10,0),(t.TotalSales/t.InvNumber) ),0) as AVGSales
, CityNameA + ' - ' + AreaNameA as city
,
CASE WHEN (t.LastVisitDate > 15 AND t.LastVisitDate <= 28) THEN '{\"fillColor\":\"green\" , \"path\":\"M 0 -7 C -1 -7 -1 -7 -3 -7 A 10 10 0 1 1 3 -7 C 2 -7 1 -7 0 -7 z M -2 -6 a 2 2 0 1 1 4 0 a 2 2 0 1 1 -4 0\"}' ELSE
	CASE WHEN (t.LastVisitDate <= 15 AND t.distance < 100 AND t.opened = 1) THEN '{\"fillColor\":\"lawngreen\" , \"path\":\"M 0 -7 C -1 -7 -1 -7 -3 -7 A 10 10 0 1 1 3 -7 C 2 -7 1 -7 0 -7 z M -2 -6 a 2 2 0 1 1 4 0 a 2 2 0 1 1 -4 0\"}' ELSE
		CASE WHEN (t.LastVisitDate <= 15 AND t.distance < 100 AND t.opened is NULL) THEN '{\"fillColor\":\"orange\" , \"path\":\"M 0 -7 C -1 -7 -1 -7 -3 -7 A 10 10 0 1 1 3 -7 C 2 -7 1 -7 0 -7 z M -2 -6 a 2 2 0 1 1 4 0 a 2 2 0 1 1 -4 0\"}' ELSE
			CASE WHEN (t.LastVisitDate <= 15 AND t.distance > 100) THEN '{\"fillColor\":\"red\" , \"path\":\"M 0 -7 C -1 -7 -1 -7 -3 -7 A 10 10 0 1 1 3 -7 C 2 -7 1 -7 0 -7 z M -2 -6 a 2 2 0 1 1 4 0 a 2 2 0 1 1 -4 0\"}' ELSE NULL
			END
		END
	END
END as svg
FROM
(
SELECT 
V_JPlans.[AssignedTO]			as SalesmanCode
,V_JPlans.[CustomerID]			as CustomerID
,HH_Customer.[CustomerNameA]		as CustomerName
,HH_Customer.[Latitude]			as Lat
,HH_Customer.[Longitude]			as Lng
, ( SELECT ISNULL(DATEDIFF(DAY,MAX(ord.Date),GETDATE()),999) FROM AR_Order as ord WHERE ord.CustomerNo = V_JPlans.CustomerID ) as LastInvoiceDate
, ( SELECT ISNULL(DATEDIFF(DAY,MAX(visit.starttime),GETDATE()),999) FROM V_HH_VisitDuration as visit WHERE visit.CUstomerNo = V_JPlans.CustomerID AND ( (visit.PositiveVisit=1) OR (visit.PositiveVisit=0 and visit.NCReasonID IS NOT NULL) ) ) as LastVisitDate
, ( SELECT CONVERT(VARCHAR(10),MAX(ord.Date),111) FROM AR_Order as ord WHERE ord.CustomerNo = V_JPlans.CustomerID ) as LastInvoiceD
, ( SELECT CONVERT(VARCHAR(10),MAX(visit.starttime),111) FROM V_HH_VisitDuration as visit WHERE visit.CUstomerNo = V_JPlans.CustomerID AND ( (visit.PositiveVisit=1) OR (visit.PositiveVisit=0 and visit.NCReasonID IS NOT NULL) ) ) as LastVisitD
, ( SELECT SUM(ord.NetTotal) FROM AR_Order as ord WHERE ord.CustomerNo = V_JPlans.CustomerID ) as TotalSales
, ( SELECT count(ord.OrderID) FROM (SELECT OrderID FROM AR_Order as ord WHERE ord.CustomerNo = V_JPlans.CustomerID group by ord.OrderID) as ord ) as InvNumber
, ( SELECT CONVERT(VARCHAR(10),MAX(s.Date),111) FROM AR_Order as s INNER JOIN AR_OrderLines as ln ON ln.OrderID = s.OrderID WHERE s.CustomerNo = V_JPlans.CustomerID and ln.ItemID = 'IRQ034') as Stand
, ( SELECT DATEDIFF(DAY,MAX(s.Date),GETDATE()) FROM AR_Order as s INNER JOIN AR_OrderLines as ln ON ln.OrderID = s.OrderID WHERE s.CustomerNo = V_JPlans.CustomerID and ln.ItemID = 'IRQ034') as Standday
, ( SELECT ISNULL(CONVERT(DECIMAL(10,0),(MAX(s.NetTotal)) ),0) FROM AR_Order as s WHERE s.CustomerNo = V_JPlans.CustomerID ) as MaxSales
, HH_Customer.CityNo
, HH_Customer.AreaNo
, HH_Customer.RegionNo
, HH_Region.RegionNameA
, HH_City.CityNameA
, AreaNameA
, CASE WHEN (wr.valid = 1) THEN 9999 ELSE CASE WHEN (wr.valid = 2 OR wr.valid = 3) THEN 5 ELSE 9999 END END distance
, 1 opened

FROM [dbo].[V_JPlans]
INNER JOIN HH_Customer ON HH_Customer.CustomerNo = V_JPlans.CustomerID
LEFT JOIN hh_CustomerAttr as atr on atr.CustomerNO = V_JPlans.CustomerID and atr.AttrID = 'زبائن موجودة'
LEFT JOIN HH_Region on HH_Region.RegionNo = HH_Customer.RegionNo
LEFT JOIN HH_City on HH_City.CITYNO = HH_Customer.CityNo and HH_City.RegionNo = HH_Customer.RegionNo 
LEFT JOIN HH_Area on HH_Area.AreaNo = HH_Customer.AreaNo and HH_Area.CITYNO = HH_Customer.CityNo and HH_Area.RegionNo = HH_Customer.RegionNo 
LEFT JOIN (
SELECT
wr.CustomerNo, wr.visit_date, MAX(wr.valid) as valid
FROM WR_Visit_Valid_JOR wr
WHERE wr.last_visit = wr.visit_date
GROUP BY wr.CustomerNo , wr.visit_date
) wr ON wr.CustomerNo = V_JPlans.CustomerID AND DATEDIFF(DAY , wr.visit_date , GETDATE() ) < 28

WHERE 1=1
AND V_JPlans.AssignedTO = ?
AND (HH_Customer.Latitude != 0 AND HH_Customer.Latitude IS NOT NULL) 
AND HH_Customer.inactive = 0
AND atr.AttrID is null
) as t        
        ";
        $user = MapUser::where('code', $salesman)->first();
        if ($user->buid==102){
            $custs = DB::connection('wri')->select($SQL2 , [$salesman]);
        }
        else{
            $custs = DB::connection('wri')->select($SQL , [$salesman]);
        }

        return empty($custs)? false : $custs;
    }

    private function getReportInfo($salesman)
    {
        $SQL = "
WITH 
order_tbl AS (
SELECT 
CASE WHEN HH_Customer.RegionNo != 'BGH' THEN ('م. ' + RegionNameA) ELSE CityNameA end as city
, CONCAT(YEAR(AR_Order.date),'--',Month(AR_Order.date)) as date
, SUM(NetTotal) as nettotal
, COUNT(OrderID) as orderid
FROM AR_Order
INNER JOIN HH_Customer ON HH_Customer.CustomerNo = AR_Order.CustomerNo
LEFT JOIN HH_Region on HH_Region.RegionNo = HH_Customer.RegionNo
LEFT JOIN HH_City on HH_City.CITYNO = HH_Customer.CityNo and HH_City.RegionNo = HH_Customer.RegionNo
WHERE AR_Order.BUID = 105
GROUP BY
CASE WHEN HH_Customer.RegionNo != 'BGH' THEN ('م. ' + RegionNameA) ELSE CityNameA end
, CONCAT(YEAR(AR_Order.date),'--',Month(AR_Order.date))
)
, 
city_tbl AS (
SELECT CASE WHEN cus.RegionNo != 'BGH' THEN ('م. ' + RegionNameA) ELSE CityNameA end as city
, CASE WHEN MAX(v.starttime) IS NULL THEN 0 ELSE 1 END as LastVisit
FROM
V_JPlans
INNER JOIN HH_Customer cus ON cus.CustomerNo = V_JPlans.CustomerID
LEFT JOIN HH_Region on HH_Region.RegionNo = cus.RegionNo
LEFT JOIN HH_City on HH_City.CITYNO = cus.CityNo and HH_City.RegionNo = cus.RegionNo
LEFT JOIN V_HH_VisitDuration as v ON v.CUstomerNo = cus.CustomerNo and DATEDIFF(DAY,GETDATE(),v.starttime) = 0
WHERE 1=1
AND V_JPlans.AssignedTO = ?
AND V_JPlans.fri = 0
AND cus.inactive = 0
GROUP BY 
CASE WHEN cus.RegionNo != 'BGH' THEN ('م. ' + RegionNameA) ELSE CityNameA end
)
-----------------------------------------------------
SELECT
city_tbl.city as city
, ( SELECT ISNULL(CONVERT(DECIMAL(10,0),MAX(tbl.nettotal) ),0) FROM order_tbl tbl WHERE tbl.city = city_tbl.city ) as maxtotal
, ( SELECT MAX(tbl.orderid) FROM order_tbl tbl WHERE tbl.city = city_tbl.city ) as invoiceNo
, ( SELECT ISNULL(CONVERT(DECIMAL(10,0),SUM(o1.nettotal) ),0) FROM order_tbl o1 WHERE o1.city = city_tbl.city and o1.date = CONCAT(YEAR(GETDATE()),'--',Month(GETDATE())) ) as currentSales
, ( SELECT MAX(o1.orderid) FROM order_tbl o1 WHERE o1.city = city_tbl.city and o1.date = CONCAT(YEAR(GETDATE()),'--',Month(GETDATE())) ) as currentInv
, ( SELECT SUM(o2.orderid) FROM order_tbl o2 WHERE o2.city = city_tbl.city and o2.nettotal = (SELECT MAX(nettotal) FROM order_tbl WHERE order_tbl.city = city_tbl.city) ) maxSalesInv
, LastVisit
FROM
city_tbl
WHERE city is NOT NULL
ORDER BY city
        ";

        $custs = DB::connection('wri')->select($SQL , [$salesman]);
        return empty($custs)? false : $custs;
    }

    private function getVisitsAvg($buid ,$salesman){
        $SQL = "
DECLARE @buid nvarchar(MAX)
DECLARE @salesmanno nvarchar(MAX)
DECLARE @dt DATETIME
DECLARE @StartDate DATETIME
DECLARE @EndDate DATETIME
DECLARE @cufridays int
DECLARE @fridays int
DECLARE @remain_holidays int
set datefirst 5
SET @buid = ?
SET @salesmanno = ?
SET @dt = GETDATE()
SET @StartDate = DATEADD(month, DATEDIFF(month, 0, @dt), 0)
SET @EndDate = EOMONTH(@dt)
SET @fridays = datepart(wk, @EndDate) - datepart(wk,dateadd(m, DATEDIFF(M, 0, @EndDate), 0)) + 1 - CASE WHEN DATENAME(dw, @StartDate) != 'Friday' THEN 1 ELSE 0 END
SET @cufridays = datepart(wk, @dt) - datepart(wk,dateadd(m, DATEDIFF(M, 0, @dt), 0)) + 1 - CASE WHEN DATENAME(dw, @StartDate) != 'Friday' THEN 1 ELSE 0 END
SET @remain_holidays = (SELECT COUNT(WR_Holidays.date) FROM WR_Holidays WHERE WR_Holidays.buid = @buid AND WR_Holidays.date >= @dt AND WR_Holidays.date < @EndDate+1)
SELECT
*
, CASE WHEN tbl.WorkinkDays = 0 THEN tbl.TotalCustomers/tbl.RemainWokingDays ELSE (tbl.CustomerVisits/tbl.WorkinkDays) END AvgVisits
, ((tbl.TotalCustomers - tbl.CustomerVisits) / tbl.RemainWokingDays) as AvgShould
FROM
(
SELECT
(DATEDIFF(dd, @dt, @EndDate)) - (@fridays-@cufridays) - @remain_holidays as RemainWokingDays
, (SELECT COUNT(distinct v.CUstomerNo) FROM V_HH_VisitDuration v WHERE v.SalesmanNo = @salesmanno and v.starttime >= @StartDate) as CustomerVisits
, (SELECT COUNT(distinct CAST(v.starttime as date)) FROM V_HH_VisitDuration v WHERE v.SalesmanNo = @salesmanno and v.starttime >= @StartDate) as WorkinkDays
, (SELECT COUNT(p.CustomerID) FROM V_JPlans as p INNER JOIN HH_Customer on HH_Customer.CustomerNo = p.CustomerID LEFT JOIN hh_CustomerAttr atr on atr.CustomerNO = p.CustomerID and atr.AttrID = 'زبائن موجودة'  WHERE p.AssignedTO = @salesmanno and atr.AttrID IS NULL AND p.fri = 0 AND (HH_Customer.Latitude != 0 AND HH_Customer.Latitude IS NOT NULL) AND HH_Customer.inactive = 0 ) TotalCustomers
) tbl
        ";
        $avg = DB::connection('wri')->select($SQL , [$buid , $salesman]);
        dd($avg);
        return empty($avg)? false : $avg;
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
