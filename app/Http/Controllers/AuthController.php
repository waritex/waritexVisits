<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function auth(Request $request)
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
}
