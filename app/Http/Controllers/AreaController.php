<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AreaController extends Controller
{


    public function test($lat , $lng)
    {
        $cus = [];
        $cus['lat'] = $lat;
        $cus['lng'] = $lng;
        $areas = $this->getAreasPolygon(null);
        dd($this->getAreaForCustomer($cus , $areas));
    }

    public function test2()
    {
        // get new surveys
        $customers = $this->getNewScannerCustomers();
        if ($customers && count($customers)==0)
            return;
        // get all areas polygon info
        $areas = $this->getAreasPolygon(null);
        // check every customer area
        foreach ($customers as $customer){
            $city = $this->getAreaForCustomer($customer , $areas);
            if ($city != null){
                // update customer info
                print_r('<pre>');
                print_r($city['c']['CUstomerNo']);
                print_r('</pre>');
                print_r('<br>');
                print_r($city['area']->Name);
                print_r('<br>');
                print_r('<br>');
            }
        }
    }

    public function task()
    {
        // get new surveys
        $customers = $this->getNewScannerCustomers();
        if ($customers && count($customers)==0)
            return;
        // get all areas polygon info
        $areas = $this->getAreasPolygon(null);
        // check every customer area
        foreach ($customers as $customer){
            $city = $this->getAreaForCustomer($customer , $areas);
            if ($city != null){
                // update customer info
                $this->updateCustomer($customer , $city['area']['Code']);
            }
        }
    }

    private function getNewScannerCustomers(){
        $SQL = "
WITH survey as (
SELECT
visit.CUstomerNo
, MIN(visit.starttime) as firstVisit
FROM hh_MeasureTake as answers
INNER JOIN V_HH_VisitDuration as visit on visit.ID = answers.visitId
INNER JOIN HH_Customer c on c.CustomerNo = visit.CUstomerNo
WHERE visit.SalesmanNo like 'IRQ%'
and starttime >= '2022-05-01'
and c.Inactive = 0
and (c.CityNo IS NULL OR c.CityNo = '')
and ((PositiveVisit = 1) OR (PositiveVisit=0 and visit.NCReasonID IS NOT NULL)) 
GROUP BY visit.CUstomerNo
)

SELECT 
v.ID
,v.CUstomerNo
,v.SalesmanNo
,v.starttime
,ver.Latitude as lat
,ver.Longitude as lng
FROM V_HH_VisitDuration v
INNER JOIN HH_VisitVerification ver on ver.VisitNo = v.ID
INNER JOIN survey on survey.CUstomerNo = v.CUstomerNo and survey.firstVisit = v.starttime        
        ";
        return collect(DB::connection('wri')->select($SQL , []));
    }

    private function updateCustomer($cus , $city , $reg='BGH' , $dis='IQ01'){
        $c = $cus;
        if (is_object($cus)){
            $c = [];
            $c['lat'] = $cus->lat;
            $c['lng'] = $cus->lng;
            $c['CUstomerNo'] = $cus->CUstomerNo;
        }
        $SQL = " UPDATE HH_Customer SET Latitude = ? , Longitude = ? , RegionNo = ? , DistrictNo = ? , CityNo = ?  WHERE CustomerNo = ?  ";
        $up = DB::connection('wri')->update($SQL , [ $c['lat'] , $c['lng'] , $c['CUstomerNo'] , $reg , $dis , $city ]);
        return $up;
    }

    /********************************************************************/
    // Private Functions:
    /********************************************************************/

    private function getAreaForCustomer($cus , $areas){
        $c = $cus;
        if (is_object($cus)){
            $c = [];
            $c['lat'] = $cus->lat;
            $c['lng'] = $cus->lng;
            $c['CUstomerNo'] = $cus->CUstomerNo;
        }
        $cusPos = $c['lat'].','.$c['lng'];
        foreach ($areas as $area){
            $polygon = $area->polypoints;
            $polygon = json_decode($polygon);
            $pos = $this->pointInPolygon($cusPos , $polygon , true);
            if ($pos != 'outside')
                return compact('c' , 'area');
        }
        return null;
    }

    private function getAreasPolygon($area_code = null){
        if ($area_code == null)
            $res = collect(DB::connection('wri')->select(" SELECT * FROM WR_Area_Polygon " , []));
        else
            $res = collect(DB::connection('wri')->select(" SELECT * FROM WR_Area_Polygon WHERE Code = ? " , [$area_code]));
        return $res;
    }

    private function pointInPolygon($point, $polygon, $pointOnVertex = true) {
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

    private function pointOnVertex($point, $vertices) {
        foreach($vertices as $vertex) {
            if ($point == $vertex) {
                return true;
            }
        }
    }
    private function pointStringToCoordinates($pointString = '33.2481988,44.4584511') {
        $coordinates = explode(",", $pointString);
        return array("x" => $coordinates[0], "y" => $coordinates[1]);
    }
    private function polygonToCoordinates($pointString) {
        return array("x" => $pointString->lat, "y" => $pointString->lng);
    }

}
