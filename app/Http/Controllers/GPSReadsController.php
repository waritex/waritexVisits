<?php

namespace App\Http\Controllers;

use App\GPSReads;
use Carbon\Carbon;
use Illuminate\Http\Request;

class GPSReadsController extends Controller
{
    public function store(Request $request)
    {
        $lat = $request->get('lat',false);
        $lng = $request->get('lng',false);
        $satellite = $request->get('satellite',false);
        $accuracy = $request->get('accuracy',false);
        $provider = $request->get('provider',false);
        $time = Carbon::createFromTimeString($request->get('time',false));

        $data = [
            'lat'               => $lat,
            'lng'               => $lng,
            'satellite'         => $satellite,
            'accuracy'          => $accuracy,
            'provider'          => $provider,
            'time'              => $time,
        ];
        //return $data;

        GPSReads::create($data);
        return response()->json('true',200);
    }
}
