<?php

namespace App\Http\Controllers;

use App\MapUser;
use App\Nolocation;
use App\Route;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
use Maatwebsite\Excel\Facades\Excel;

class MapController extends Controller
{

    public function get_customers(Request $request)
    {
        $salesman = $request->post('salesman',false);
        if (!$salesman)
            return response()->json('Error In User Please Ask Waritex For This',500);
        $today = now()->toDateString();
        //----------------------- test Value
        $today = "2018-09-13";
        //----------------------- test Value
//        $salesman = "IRQ004";
        /////////////////////////////////////
        // get customers's route:
        if (!$todayCustomers = $this->get_today_routes($salesman,$today))
            return response()->json('No Customers In Today\'s Route',500);

        //----------------------- test Value
//        $today = "2018-07-31";
        ////////////////////////////////
        // get today's visits:
        $date_range = now()->addDays(-6)->toDateString();
//        $date_range = "2018-09-01";
        if (! $visits = $this->get_today_visits($salesman,$today,$date_range)){
            return $todayCustomers;
//            return response()->json('No Visits Till Now',500);
        }

        $res = [];

        foreach ($todayCustomers as $customer){
            foreach ($visits as $visit){
                if ( trim($visit->customer_id) === trim($customer->CustomerID) ){
                    $customer->visited = 1;
                    if ( trim($visit->visit_date) !== $today){
//                        continue 2;
                    }
                    break;
                }
            }
            $res[] = $customer;
        }

        return $res;
    }

    public function get_no_loc(Request $request){
        $salesman = $request->post('salesman',false);
        if (!$salesman)
            return response()->json('Error In User Please Ask Waritex For This',500);
        $today = now()->toDateString();
        $today = "2018-09-06"; //------------------------------Test Value you should delete it
        if (!$todayCustomers = $this->get_no_location_customers($salesman,$today))
            return response()->json('No Customers In Today\'s Route',500);
        $date_range = now()->addDays(-6)->toDateString();
        if (! $visits = $this->get_today_visits($salesman,$today,$date_range)){
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

    private function get_today_visits($salesman , $date , $dateRange){
        $visits = DB::connection('wri')->select("
        SELECT 
        dbo.V_HH_VisitDuration.ID               AS visit_id
        ,dbo.V_HH_VisitDuration.CUstomerNo       AS customer_id
        ,CAST( dbo.V_HH_VisitDuration.starttime as Date ) AS visit_date
         
        FROM dbo.V_HH_VisitDuration
        
        WHERE        ( CAST( dbo.V_HH_VisitDuration.starttime as Date ) between ? and  ? )
			  AND ( dbo.V_HH_VisitDuration.SalesmanNo = ? )
        " , [$dateRange , $date , $salesman]);

        return empty($visits)? false : $visits;
    }

    private function get_no_location_customers($salesman , $date)
    {
        $customers = Nolocation::where('Date',$date)
            ->where('SalesmanCode',$salesman)
            ->get();
        if ($customers->isEmpty())
            return false;
        return $customers;
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


    public function get_week_number(){
        $today = Carbon::today();
        $today = Carbon::createFromDate(2018,1,6);

        $weekd = $today->addDay()->dayOfWeek+1;
        print_r('weekd '.$weekd);print_r('<br>');
        $yeard = $today->addDays(7)->subDays($weekd)->year;
        print_r('yeard '.$yeard);print_r('<br>');
        $xx = Carbon::createFromDate($yeard,1,1);
        print_r($xx);print_r('<br>');
        $x1 = $today->subDays($weekd);
        print_r($x1);print_r('<br>');
        print_r($xx->dayOfYear+1);print_r('<br>');
        $x2 = $today->subDays($xx->dayOfYear+1);
        print_r($x2);print_r('<br>');
        $yy = $today->subDays($weekd)->subDays($xx->dayOfYear+1);
        $vv = $yy->dayOfYear+1;
        dd((INT)($vv/7));
        $fullStart = Carbon::today()->startOfYear()->isSaturday();
        if ($fullStart)
            $weekNo = $today->weekOfYear;
        else
            $weekNo = $today->dayOfYear+1;


//        echo $today->formatLocalized('%w');echo '<br>';

        print_r($today);print_r('<br>');
        print_r($today->isSaturday());print_r('<br>');
        print_r($today->toDayDateTimeString());print_r('<br>');
        print_r((($weekNo/7)%4+1));print_r('<br>');
        print_r('Salesbuzz Week '.(($weekNo/7)%4+1));print_r('<br>');

        dd($weekNo);
        return $today;
    }


    function getDayOfWeek(\DateTimeImmutable $date)
    {
        return ($date->format('N') + 2) % 7;
    }

    function getWeekNumber(\DatetimeImmutable $date)
    {
        // Recursive function that loops through every day until it gets the start of a week
        $startOfWeek = function (\DateTimeImmutable $date) use (&$startOfWeek) {
            return ($this->getDayOfWeek($date) === 1)
                ? $date : $startOfWeek($date->modify('+1 day'));
        };

        // The z option tells us what day of the year this is,
        // not a 100% sure this step is necessary
        if ($this->getDayOfWeek($date === 1)) {
            $nbDays = $date->format('z');
        } else {
            $nbDays = $startOfWeek($date->modify('-7 days'))->format('z');
        }
        // Divides by the number of days in a week to get the number of weeks
        return ceil($nbDays / 7);
    }


}
