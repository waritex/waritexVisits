<?php

namespace App\Http\Controllers;

use App\MapUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function auth_old(Request $request)
    {
        $data = $this->validate($request , [
           'username'   => ['required','string'],
           'password'   => ['required','string'],
        ]);
        if ( Auth::once($data) ){
            return response()->json('OK',200);
        }
        else{
            return response()->json('BAD',401);
        }
    }

    public function auth(Request $request)
    {
        $data = $this->validate($request , [
            'username'   => ['required','string'],
        ]);

        $username = $data['username'];

        $user = MapUser::where('username', $username)->first();
        if ( $user ){
            return response()->json($user,200);
        }
        else{
            throw new \Exception('BAD Username Or Password',401);
        }
    }

    public function get_all_salesman(Request $request)
    {
        $data = $this->validate($request , [
            'code'   => ['required','string'],
        ]);
        $code = $data['code'];
        $supervisor = MapUser::where('code', $code)->first();
        $salesmans = $this->get_all_supervisor_salesman($supervisor);
        if ( $salesmans ){
            return response()->json($salesmans,200);
        }
        else{
            throw new \Exception('Supervisor Has No Salesmans',401);
        }
    }

    private function get_all_supervisor_salesman($supervisor)
    {
        return MapUser::where('buid',$supervisor->buid)
            ->where('code','!=',$supervisor->code)
            ->where('supervisor','!=',1)
            ->get();
    }

}
