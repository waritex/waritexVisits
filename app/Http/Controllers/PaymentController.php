<?php

namespace App\Http\Controllers;

use App\WR_PY_Receipt;
use App\WR_PY_User;
use Illuminate\Http\Request;
use Hash;

class PaymentController extends Controller
{

    public function __construct()
    {

    }

    public function auth(Request $request)
    {
        $data = $this->validate($request , [
            'username'   => ['required','string'],
            'password'   => ['required','string'],
        ]);
        $user = WR_PY_User::where('username',$data['username'])->first();
        if ( $user ){
            $ss = Hash::check($data['password'], $user->password);
            return $ss ? response()->json($user,200) : response()->json('BAD',401);
        }
        else{
            return response()->json('BAD',401);
        }
    }

    public function get_all_payments(Request $request)
    {
        $user_id = $request->post('user_id',false);
        if (false)
            return abort(500,'bad user name or password');
        $payments = WR_PY_Receipt::where('to_id',$user_id)->get();
        return $payments;
    }

    public function get_all_users(Request $request)
    {
        return $users = WR_PY_User::where('id','!=' , $request->post('id',''))->get();
    }


}
