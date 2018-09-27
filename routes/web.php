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
///////////////////////////////////////////////////////////////////
///
/// Map Application
///
///////////////////////////////////////////////////////////////////
// Web App
Route::get('/map','MapController@showWeb');
// API
Route::post('/login', 'AuthController@auth');
Route::post('/get_all_salesman', 'AuthController@get_all_salesman');
Route::post('/get_customers','MapController@get_customers');
Route::post('/get_noloc','MapController@get_no_loc');
//Test Routes:

////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///
/// Test URLs
///
///////////////////////////////////////////////////////////////////
Route::get('/test' , 'VisitController@test_task');

Route::get('/date' , 'MapController@get_today_name');
Route::get('/infoo' , function () {
echo phpinfo();
});
