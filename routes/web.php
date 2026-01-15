<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

///////////////////////////////////////////////////////////////////
///
/// Waritex Website
///
///////////////////////////////////////////////////////////////////
Route::get('/', function () {
//    return view('welcome');
    return view('index');
});
///////////////////////////////////////////////////////////////////
///
/// Google Visit API
///
///////////////////////////////////////////////////////////////////
Route::get('/get/{visit_id}/{date}/{salesman}/{lat1}/{lng1}/{lat2}/{lng2}' , 'VisitController@get');
Route::get('/get2/{visit_id}' , 'VisitController@get_v2');
Route::get('/get_distance/{lat1}/{lon1}/{lat2}/{lon2}/{unit}' , 'VisitController@calculateDistance');
Route::get('/get_distance2/{lat1}/{lon1}/{lat2}/{lon2}' , 'VisitController@getDistance');
Route::get('/readgps' , 'GPSReadsController@store');

// KSA distinace
Route::get('/calcd' , 'KsaDistinaceController@distance');
///////////////////////////////////////////////////////////////////
///
/// Map Application
///
///////////////////////////////////////////////////////////////////
// Web App
Route::get('/map','MapController@showWeb');
Route::get('/jmap','MapController@showWebJor');
Route::get('/Adminmap',function(){return view('AdminMap');});
Route::get('/ksamap','MapController@showKSAWeb');
Route::get('/webmap','MapController@showMapWeb');
// API
Route::post('/login', 'AuthController@auth');
Route::post('/get_all_salesman', 'AuthController@get_all_salesman');
Route::post('/get_all_customers','MapController@get_all_customers')->name('get_all_customers');
Route::post('/get_customers','MapController@get_customers');
Route::post('/get_customers_area','MapController@get_customers_by_areas');
Route::post('/get_all_scanner_area','MapController@getScannerAllArea');
Route::post('/get_report_area','MapController@get_report_by_areas');
Route::post('/saveinfo','MapController@save_info');
Route::post('/get_noloc','MapController@get_no_loc');
Route::post('/get_schedule','MapController@get_schedule');
Route::post('/get_car_location','MapController@get_car_location');
// Scanner API
Route::get('/get_scanner','ScannerController@get_customers');
Route::post('/readings','ScannerController@catch_readings');
Route::get('/get_gpsreadings','ScannerController@fetchAllReadings');
Route::post('/get_gpsreadings','ScannerController@fetchAllReadings');
Route::post('/get_gpsreadings_admin','ScannerController@fetchAllReadingsAdmin');
Route::post('/get_Ameencc','ScannerController@AmeenMap');
Route::post('/get_Scannerc','ScannerController@getNewCustomersScannersData');
//Test Routes:
Route::get('/ttt','AreaController@test2');
Route::get('/taskk','AreaController@task');

// WR_Payments:
Route::post('/py/login','PaymentController@auth')->name('py_login');
Route::post('/py/updatelogin','PaymentController@updateAuth')->name('py_login');
Route::post('/py/users','PaymentController@get_all_users')->name('py_users');
Route::post('/py/add','PaymentController@add_payment')->name('py_add');
Route::post('/py/getpy','PaymentController@get_user_payments_with_search')->name('py_getpy');
Route::post('/py/getpyadmin','PaymentController@get_admin_payments_with_search')->name('py_getpyadmin');
Route::post('/py/uppyst','PaymentController@update_status')->name('py_uppyst');
Route::get('/py/payments','PaymentController@get_all_payments')->name('py_payments');

// New Waritex Map:
Route::post('/wr_get_regions','MapController@get_regions');
Route::post('/wr_get_areas','MapController@get_areas');
Route::post('/wr_get_cust_in_areas','MapController@get_customers_in_areas');

////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///
/// Test URLs
///
///////////////////////////////////////////////////////////////////
Route::get('/test' , 'MapController@get_regions');
Route::get('/test1' , 'MapController@get_today_name');
Route::get('/test12' , 'MapController@get_salesbuzz_week_number');
Route::get('/tt' , 'ScannerController@ask_here');
Route::get('/gtt/{salesman?}' , 'ScannerController@askg_v2');

Route::get('/date' , 'MapController@get_today_name');
Route::get('/schedule' , 'MapController@get_schedule');
Route::get('/infoo' , function () {
// echo phpinfo();
    $salesman = 'NIRQ046';
    $area_code = 'انبار';
    $SQL = " EXEC WR_Map_Customers_By_Areas_2 ? , ? , ? ";
    $res = collect(DB::connection('wri')->select($SQL , [$salesman , null , $area_code]));
    $col = $res->map(function ($item){
        $xml = simplexml_load_string($item->info);
        $json = json_encode($xml);
        $item->info = $json;
        return $item;
    });
    return $col;
});
