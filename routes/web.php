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

Route::get('/', function () {
//    return view('welcome');
    return view('index');
});

Route::get('/get/{visit_id}/{date}/{salesman}/{lat1}/{lng1}/{lat2}/{lng2}' , 'VisitController@get');

Route::get('/get2/{visit_id}' , 'VisitController@get_v2');

Route::get('/get_distance/{lat1}/{lon1}/{lat2}/{lon2}/{unit}' , 'VisitController@calculateDistance');


Route::get('/test' , 'VisitController@test');
