<?php

namespace App\Http\Controllers;

use App\Route;
use Illuminate\Http\Request;
use DB;

class MapController extends Controller
{

    public function get_customers(Request $request)
    {
        $salesman = $request->post('salesman',false);
        if (!$salesman)
            return response()->json('Error In User Please Ask Waritex For This',500);
        $today = now()->toDateString();
        //----------------------- test Value
//        $today = "2018-09-01";
        //----------------------- test Value
//        $salesman = "IRQ004";
        // get customers's route:
        if (!$todayCustomers = $this->get_today_routes($salesman,$today))
            return response()->json('No Customers In Today\'s Route',500);
        //----------------------- test Value
//        $today = "2018-07-31";
        // get today's visits:
        if (! $visits = $this->get_today_visits($salesman,$today)){
            return $todayCustomers;
//            return response()->json('No Visits Till Now',500);
        }

        $res = [];

        foreach ($todayCustomers as $customer){
            $customer_id = $customer->CustomerID;
            foreach ($visits as $visit){
                if ($visit->customer_id == $customer_id){
                    $customer->visited = 1;
                    break;
                }
            }
            $res[] = $customer;
        }

        return $res;
    }


    private function get_today_routes($salesman , $date){
        $routes = Route::where('Date',$date)
            ->where('SalesmanCode',$salesman)
            ->get();
        if ($routes->isEmpty())
            return false;
        return $routes;
    }

    private function get_today_visits($salesman , $date){
        $visits = DB::connection('wri')->select("
        SELECT 
        dbo.V_HH_VisitDuration.ID               AS visit_id
        ,dbo.V_HH_VisitDuration.CUstomerNo       AS customer_id
        ,CAST( dbo.V_HH_VisitDuration.starttime as Date ) AS visit_date
         
        FROM dbo.V_HH_VisitDuration
        
        WHERE        ( CAST( dbo.V_HH_VisitDuration.starttime as Date ) = ? )
			  AND ( dbo.V_HH_VisitDuration.SalesmanNo = ? )
        " , [$date , $salesman]);

        return empty($visits)? false : $visits;
    }

}
