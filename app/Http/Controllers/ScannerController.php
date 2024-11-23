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
        // get city code
        $salesman = 'IRQ009';
        $weekNumber = $this->get_salesbuzz_week_number();
        $dayString = $this->get_today_name();
        if (!$city = $this->get_today_routes_from_salesbuzz($salesman,$weekNumber,$dayString))
            return response()->json('No Customers In Today\'s Route',500);
        $city = $city[0]->CityNO;
        // get customers's route:
        if (!$todayCustomers = $this->get_not_visited_3months($city))
            return response()->json('No Customers In Today\'s Route',500);
        return $todayCustomers;
    }

    public function catch_readings(Request $request)
    {
        $readings = $request->post('readings',false);
        if ($readings === false || count($readings)==0)
            return response()->json('No readings',200);
//        $last_read = ScannerGPS::where('times','=',ScannerGPS::max('times'))->first();
        $readings = collect($readings)->map(function ($a){
            $a['times'] = Carbon::createFromTimestampMs($a['datetime'])->toDateTimeString();
            return $a;
        });

        foreach ($readings as $reading){
            ScannerGPS::create([
                'datetime'  => $reading['times'],
                'salesman'  => $reading['salesman'],
                'lat'  => $reading['lat'],
                'lng'  => $reading['lng'],
            ]);
        }

        return response()->json('done',200);
        /*************************************/
        /*************************************/
        /*************************************/
//        $roads = $this->google_road_api($readings,$last_read);
//        if ($roads===false){
//            return response()->json('Google Error',401);
//        }
//        $this->save_road($roads);
    }

    private function get_not_visited_3months($city){
        $customers = DB::connection('wri')->select("
SELECT
	cus.CustomerNo as cusCode
	, cus.CustomerNameA as cusName
	, cus.Latitude as cusLat
	, cus.Longitude as cusLng
	, s.maxo as lastDate
FROM
	HH_Customer as cus
inner join (SELECT x.CustomerNo , Max(x.Date) as maxo FROM AR_order as x WHERE x.BUID = 105 group by x.customerno) as s on s.CustomerNo = cus.CustomerNo
WHERE
	cus.BUID = 105
	and cus.Inactive = 0
	and cus.Latitude !=0 and cus.Latitude is not null
	and cus.Longitude !=0 and cus.Longitude is not null
	and s.maxo >= DATEADD(DAY, -90, GETDATE())
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
        $todayReadings = ScannerGPS::where('times','>=',today()->subDays(2)->toDateString())->where('times','<',$next_day->toDateString())->get();
        if (empty($todayReadings) || $todayReadings->isEmpty())
            $asd = '';
        else {
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
        }
        $xx = $todayReadings[0];
        return view('here',compact('asd','xx'));
    }

    public function askg_v2($salesman = 'IRQ004' , Request $request)
    {
        $from = $request->get('from');
        $to = $request->get('to');
        $area = $request->get('area');
        if (empty($from) || $from=='null')
            $from = today();//->subDays(2);
        else $from = Carbon::parse($from);
        if (empty($to) || $to=='null')
            $to = today()->addDay();
        else $to = Carbon::parse($to);

        $polygon = collect([]);
        if (!empty($area) && $area != 'null'){
            $p = collect(DB::connection('wri')->select(" SELECT * FROM WR_Area_Polygon WHERE Code = ? " , [$area]));
            if (!empty($p)){
                $polygon = $p[0]->polypoints;
            }
        }
        $todayReadings = ScannerGPS::where('salesman',$salesman)
            ->where('times','>=',$from->toDateString())
            ->where('times','<',$to->toDateString())
            ->orderBy('times','ASC')
            ->get();
        $todayReadings = collect($todayReadings);
        return view('googleScanner',compact('todayReadings','polygon'));
    }

    public function fetchAllReadings(Request $request)
    {
        if ($request->method()==='GET'){
            $salesman = $request->get('salesman');
            $from = $request->get('from');
            $area = $request->get('area');
        }
        else{
            $salesman = $request->post('salesman');
            $from = $request->post('from');
            $area = $request->post('area');
        }

        if (empty($from) || $from=='null')
            $from = today()->subWeeks(3);//->subDays(2);
        else $from = Carbon::parse($from);
        $Readings = ScannerGPS::where('salesman',$salesman)
            ->where('datetime','>=',$from->toDateString())
//            ->where('datetime','>=','2022-06-07')
//            ->where('datetime','<','2022-06-08')
            ->orderBy('datetime','ASC')
            ->get();
        $polygon = collect([]);
        $res = [];$res['today']=[];$res['past']=[];
        if (!empty($area) && $area != 'null'){
            $p = collect(DB::connection('wri')->select(" SELECT * FROM WR_Area_Polygon WHERE Code = ? " , [$area]));
            if (!empty($p)){
                $polygon = $p[0]->polypoints;
                $polygon = json_decode($polygon);
            }
        }
        else return collect($res);
        foreach ($Readings as $reading){
            $point = $reading['lat'].','.$reading['lng'];
            if ($this->pointInPolygon($point,$polygon)!='outside'){
                $t = Carbon::parse($reading['datetime']);
                if( $t->isToday() ){
                    $res['today'][] = $reading;
                }
                else
                    $res['past'][] = $reading;
            }
        }
        return collect($res);
    }

    public function fetchAllReadingsAdmin(Request $request)
    {
        $salesman = $request->post('salesman');
        $area = $request->post('area');
        $datetime = $request->post('datetime');

        $datetime = Carbon::createFromTimestampMs($datetime);
//        $datetime = today()->subDay(1);
        $Readings = ScannerGPS::where('salesman',$salesman)
            ->where('datetime','>=',$datetime)
            ->orderBy('datetime','ASC')
            ->get();
        $polygon = collect([]);
        $res = [];
        if (!empty($area) && $area != 'null'){
            $p = collect(DB::connection('wri')->select(" SELECT * FROM WR_Area_Polygon WHERE Code = ? " , [$area]));
            if (!empty($p)){
                $polygon = $p[0]->polypoints;
                $polygon = json_decode($polygon);
            }
        }
        else return collect($res);
        foreach ($Readings as $reading){
            $point = $reading['lat'].','.$reading['lng'];
            if ($this->pointInPolygon($point,$polygon)!='outside'){
                $res[] = $reading;
            }
        }
        return collect($res);
    }

    public function AmeenMap(Request $request)
    {
        $area = $request->post('area');
        $salesman = $request->post('salesman');

        $SQL1 = "
        select
v.CUstomerNo
, c.CustomerNameA
, reg.RegionNameA
, dis.DistrictNameA
, cit.CityNameA
, c.RegionNo
, c.DistrictNo
, c.CityNo
, c.Latitude
, c.Longitude
from V_HH_VisitDuration v
LEFT JOIN HH_VisitVerification ver on ver.VisitNo = v.ID
INNER JOIN HH_Customer c on c.CustomerNo = v.CUstomerNo
INNER JOIN hh_CustomerAttr atr on atr.CustomerNO = v.CUstomerNo and atr.AttrID = 'Company_2' and atr.AttrVal = 1
LEFT JOIN HH_Region reg on reg.RegionNo = c.RegionNo
LEFT JOIN HH_District dis on dis.RegionNo = c.RegionNo and dis.DistrictNo = c.DistrictNo
LEFT JOIN HH_City cit on cit.RegionNo = c.RegionNo and cit.DistrictNo = c.DistrictNo and cit.CITYNO = c.CityNo
LEFT JOIN (
SELECT vv.CUstomerNo , MIN(vv.starttime) fv FROM V_HH_VisitDuration vv
INNER JOIN hh_MeasureTake m on m.visitId = vv.ID
GROUP BY vv.CUstomerNo
) x on x.CUstomerNo = v.CUstomerNo and x.fv = v.starttime
where ((PositiveVisit=1) OR (PositiveVisit=0 and NCReasonID IS NOT NULL))
and c.CustomerNameA not like 'xx%'
and x.CUstomerNo IS NOT NULL
and c.CityNo = ?

UNION ALL

SELECT
c.CUstomerNo
, c.CustomerNameA
, reg.RegionNameA
, dis.DistrictNameA
, cit.CityNameA
, c.RegionNo
, c.DistrictNo
, c.CityNo
, c.Latitude
, c.Longitude
FROM HH_Customer c
INNER JOIN hh_CustomerAttr atr on atr.CustomerNO = c.CUstomerNo and atr.AttrID = 'Company_2' and atr.AttrVal = 2
LEFT JOIN HH_Region reg on reg.RegionNo = c.RegionNo
LEFT JOIN HH_District dis on dis.RegionNo = c.RegionNo and dis.DistrictNo = c.DistrictNo
LEFT JOIN HH_City cit on cit.RegionNo = c.RegionNo and cit.DistrictNo = c.DistrictNo and cit.CITYNO = c.CityNo
WHERE c.CityNo = ?

        ";

        $dataSB = collect(DB::connection('wri')->select($SQL1 , [$area , $area]));

        $SQL2 = "
DECLARE @city nvarchar(6) = '$area'
DECLARE @bgh nvarchar(5) = (SELECT top 1 x.regionNo from HH_City x WHERE CITYNO = @city)
SELECT *
FROM
(
SELECT
am.CustomerName as CustomerNameA
, am.lat as Latitude
, am.lon as Longitude
, regionNo
, RegionName as RegionNameA
, DistrictName as DistrictNameA
, CityName as CityNameA
, 'IQ' + RIGHT('000'+CAST(cityNo AS VARCHAR(3)),3) citySB
FROM WR_IRQ_AmeenCustomers am
WHERE 1=1
and lat IS NOT NULL and lat != 0
and am.DealAmeen = 1 and DealSB IS NULL
) tbl
WHERE
(@bgh = 'BGH' and tbl.citySB = @city)
OR
(@bgh != 'BGH' and tbl.regionNo = @bgh)
        ";
        $SQL2 = "
SELECT *
FROM
(
SELECT
am.CustomerName as CustomerNameA
, am.lat as Latitude
, am.lon as Longitude
, regionNo
, RegionName as RegionNameA
, DistrictName as DistrictNameA
, CityName as CityNameA
, 'IQ' + RIGHT('000'+CAST(cityNo AS VARCHAR(3)),3) citySB
FROM WR_IRQ_AmeenCustomers am
WHERE 1=1
and lat IS NOT NULL and lat != 0
and am.DealAmeen = 1 and DealSB IS NULL
) tbl
WHERE
((SELECT top 1 x.regionNo from HH_City x WHERE CITYNO = ?) = 'BGH' and tbl.citySB = ?)
OR
((SELECT top 1 x.regionNo from HH_City x WHERE CITYNO = ?) != 'BGH' and tbl.regionNo = (SELECT top 1 x.regionNo from HH_City x WHERE CITYNO = ?))
        ";

        $dataAmeen = collect(DB::connection('wri')->select(DB::raw($SQL2) , [$area , $area , $area , $area]));
        if ($salesman == 'NIRQ017'){
            $SQLM = "
            SELECT
c.CUstomerNo
, c.CustomerNameA
, reg.RegionNameA
, dis.DistrictNameA
, cit.CityNameA
, c.RegionNo
, c.DistrictNo
, c.CityNo
, c.Latitude
, c.Longitude
FROM HH_Customer c
LEFT JOIN HH_Region reg on reg.RegionNo = c.RegionNo
LEFT JOIN HH_District dis on dis.RegionNo = c.RegionNo and dis.DistrictNo = c.DistrictNo
LEFT JOIN HH_City cit on cit.RegionNo = c.RegionNo and cit.DistrictNo = c.DistrictNo and cit.CITYNO = c.CityNo
WHERE CustomerNameA like 'زبون خريطة%' and c.CityNo = ?
            ";
            $dataSB = collect(DB::connection('wri')->select($SQLM , [$area]));

            $SQLL = "
SELECT
c.CUstomerNo
, c.CustomerNameA
, reg.RegionNameA
, dis.DistrictNameA
, cit.CityNameA
, c.RegionNo
, c.DistrictNo
, c.CityNo
, c.Latitude
, c.Longitude
FROM HH_Customer c
INNER JOIN hh_CustomerAttr atr on atr.CustomerNO = c.CUstomerNo and atr.AttrID = 'IRQ_VCus' and atr.AttrVal = 2
LEFT JOIN HH_Region reg on reg.RegionNo = c.RegionNo
LEFT JOIN HH_District dis on dis.RegionNo = c.RegionNo and dis.DistrictNo = c.DistrictNo
LEFT JOIN HH_City cit on cit.RegionNo = c.RegionNo and cit.DistrictNo = c.DistrictNo and cit.CITYNO = c.CityNo
WHERE c.CityNo = ?
            ";
            $dataAmeen = collect(DB::connection('wri')->select(DB::raw($SQLL) , [$area]));
        }


        $polygon = collect([]);
        $p = collect(DB::connection('wri')->select(" SELECT * FROM WR_Area_Polygon WHERE Code = ? " , [$area]));
        if (!empty($p)){
            $polygon = $p[0]->polypoints;
        }

        return compact('dataSB' , 'dataAmeen','polygon');

    }


    public function getNewCustomersScannersData(Request $request)
    {
        $area = $request->post('area');
        $salesman = $request->post('salesman');
        $SQL2 = "
SELECT
c.CustomerNo
, c.CustomerNameA
, c.Latitude
, c.Longitude
FROM HH_Customer c
INNER JOIN hh_CustomerAttr atr on atr.CustomerNO = c.CustomerNo and atr.AttrID = 'company_2'
WHERE 1=1
and c.Inactive = 0
and (c.CityNo IS NOT NULL OR c.CityNo != '')
and c.SalesmanNo = ?
and c.CityNo = ?
        ";

        $scanner = collect(DB::connection('wri')->select($SQL2 , [$salesman , $area]));
        if ($salesman == 'NIRQ017'){
            $scanner = collect([]);
        }
        return compact('scanner');
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

    private function get_today_routes_from_salesbuzz($salesman , $weekNum , $day){
        $routes = DB::connection('wri')->select("
      SELECT distinct HH_Customer.CityNo as CityNO
      FROM [dbo].[V_JPlans]
      INNER JOIN HH_Customer ON HH_Customer.CustomerNo = V_JPlans.CustomerID
      WHERE V_JPlans.[AssignedTO] = ?   AND  V_JPlans.[StartWeek] = ?  AND V_JPlans.$day = 1
      and HH_Customer.CityNo is not null
        " , [$salesman , $weekNum]);

        return empty($routes)? false : $routes;
    }


    function pointInPolygon($point, $polygon, $pointOnVertex = true) {
        $this->pointOnVertex = $pointOnVertex;

        // Transform string coordinates into arrays with x and y values
        $point = $this->pointStringToCoordinates($point);
        $vertices = array();
        foreach ($polygon as $vertex) {
            $vertices[] = $this->polygonToCoordinates($vertex);
        }

        // Check if the point sits exactly on a vertex
        if ($this->pointOnVertex == true and $this->pointOnVertex($point, $vertices) == true) {
            return "vertex";
        }

        // Check if the point is inside the polygon or on the boundary
        $intersections = 0;
        $vertices_count = count($vertices);

        for ($i=1; $i < $vertices_count; $i++) {
            $vertex1 = $vertices[$i-1];
            $vertex2 = $vertices[$i];
            if ($vertex1['y'] == $vertex2['y'] and $vertex1['y'] == $point['y'] and $point['x'] > min($vertex1['x'], $vertex2['x']) and $point['x'] < max($vertex1['x'], $vertex2['x'])) { // Check if point is on an horizontal polygon boundary
                return "boundary";
            }
            if ($point['y'] > min($vertex1['y'], $vertex2['y']) and $point['y'] <= max($vertex1['y'], $vertex2['y']) and $point['x'] <= max($vertex1['x'], $vertex2['x']) and $vertex1['y'] != $vertex2['y']) {
                $xinters = ($point['y'] - $vertex1['y']) * ($vertex2['x'] - $vertex1['x']) / ($vertex2['y'] - $vertex1['y']) + $vertex1['x'];
                if ($xinters == $point['x']) { // Check if point is on the polygon boundary (other than horizontal)
                    return "boundary";
                }
                if ($vertex1['x'] == $vertex2['x'] || $point['x'] <= $xinters) {
                    $intersections++;
                }
            }
        }
        // If the number of edges we passed through is odd, then it's in the polygon.
        if ($intersections % 2 != 0) {
            return "inside";
        } else {
            return "outside";
        }
    }

    function pointOnVertex($point, $vertices) {
        foreach($vertices as $vertex) {
            if ($point == $vertex) {
                return true;
            }
        }

    }

    function pointStringToCoordinates($pointString) {
        $coordinates = explode(",", $pointString);
        return array("x" => $coordinates[0], "y" => $coordinates[1]);
    }
    function polygonToCoordinates($pointString) {
        return array("x" => $pointString->lat, "y" => $pointString->lng);
    }


    private function getAllAreas(){
        $SQL = "
        WITH Areas as (
SELECT
CASE WHEN reg.RegionNo = 'BGH' THEN cit.CityNameA ELSE ('م. ' + RegionNameA) end AreaName
, CASE WHEN reg.RegionNo = 'BGH' THEN (reg.RegionNo + '-' +cit.CITYNO) ELSE reg.RegionNo end AreaCode
FROM
HH_Region reg
INNER JOIN HH_District dis on dis.RegionNo = reg.RegionNo
INNER JOIN HH_City cit on cit.RegionNo = reg.RegionNo and cit.DistrictNo = dis.DistrictNo
WHERE reg.buid = 105
GROUP BY
CASE WHEN reg.RegionNo = 'BGH' THEN cit.CityNameA ELSE ('م. ' + RegionNameA) end
, CASE WHEN reg.RegionNo = 'BGH' THEN (reg.RegionNo + '-' +cit.CITYNO) ELSE reg.RegionNo end
)
, am as (
SELECT
am.CustomerName as CustomerNameA
, am.lat as Latitude
, am.lon as Longitude
, RegionName as RegionNameA
, DistrictName as DistrictNameA
, CityName as CityNameA
, am.regionNo
, 'IQ' + RIGHT('000'+CAST(cityNo AS VARCHAR(3)),3) citySB
, CASE WHEN RegionNo = 'BGH' THEN (RegionNo + '-' + 'IQ' + RIGHT('000'+CAST(cityNo AS VARCHAR(3)),3)) ELSE RegionNo end AreaCode
FROM WR_IRQ_AmeenCustomers am
WHERE 1=1
and lat IS NOT NULL and lat != 0
and am.DealAmeen = 1 and DealSB IS NULL
)

SELECT
*
, (SELECT COUNT(am.CustomerNameA) FROM am WHERE am.AreaCode = areas.AreaCode) ameenCustomers
, (SELECT polypoints from WR_Area_Polygon p where 'BGH-'+p.Code = areas.AreaCode) polypoints
FROM Areas
        ";
    }


}
