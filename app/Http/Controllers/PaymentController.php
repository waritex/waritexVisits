<?php

namespace App\Http\Controllers;

use App\WR_PY_Receipt;
use App\WR_PY_User;
use Illuminate\Http\Request;
use Hash;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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

    public function updateAuth(Request $request)
    {
        $data = $this->validate($request , [
            'username'   => ['required','string'],
        ]);
        $user = WR_PY_User::where('username',$data['username'])->first();
        if ( $user ){
            return response()->json($user,200);
        }
        else{
            return response()->json('BAD',401);
        }
    }

    public function get_pay_by_id(Request $request , $id)
    {
        $SQL = "
        SELECT r.*
        , case WHEN r.status = 0 THEN 'انتظار المستلم'
               WHEN r.status = 1 THEN 'انتظار الادارة' 
               WHEN r.status = 2 THEN 'المستلم ألغى' 
               WHEN r.status = 3 THEN 'الادارة أكدت' 
               WHEN r.status = 4 THEN 'الادارة ألغت' 
          end as stext    
        , case WHEN r.status = 0 THEN 'medium'
               WHEN r.status = 1 THEN 'warning' 
               WHEN r.status = 2 THEN 'danger' 
               WHEN r.status = 3 THEN 'success' 
               WHEN r.status = 4 THEN 'danger' 
          end as scolor
        FROM wr_py_receipts r
        WHERE r.id = ?
        ";
        $payments = collect(DB::select($SQL , [$id]));
        return $payments;
    }

    public function get_all_users(Request $request)
    {
        return $users = WR_PY_User::where('id','!=' , $request->post('id',''))->get();
    }

    public function add_payment(Request $request)
    {
        $data = $request->validate([
            'to_id'         =>      ['required'],
            'from_id'       =>      ['required'],
            'date'          =>      ['required'],
            'amount'        =>      ['required'],
            'currency'      =>      ['required'],
            'notes'         =>      [],
        ]);
        try{
            $p = new WR_PY_Receipt();
            $p->to_id = $data['to_id'];
            $p->from_id = $data['from_id'];
            $p->amount = $data['amount'];
            $p->currency = $data['currency'];
            $p->notes = $data['notes'];
            $p->date = Carbon::parse($data['date']);
            $p->save();
            return $p;
        }
        catch (\Exception $exception){
            return response($exception , 400);
        }
    }

    public function update_status(Request $request)
    {
        $p_id = $request->post('p_id',false);
        $cancel = $request->post('cancel',false);
        if ($p_id===false)
            return abort(400,'please provide a rec to update');
        $p = WR_PY_Receipt::findOrFail($p_id);
        if ($cancel){
            if ($p->status==0){
                $p->status = 2;
                $p->to_status_update_at = now();
            }
            else{
                $p->status = 4;
                $p->status_update_at = now();
            }
        }
        else{
            if ($p->status==0){
                $p->status = 1;
                $p->to_status_update_at = now();
            }
            else{
                $p->status = 3;
                $p->status_update_at = now();
            }
        }
        $p->save();
        if ($p->status==3){
            $this->update_balance($p->from_id   , -$p->amount   , $p->currency);
            $this->update_balance($p->to_id     , $p->amount    , $p->currency);
        }
        return $this->get_pay_by_id($request,$p->id);
    }

    private function update_balance($user_id , $amount , $currency)
    {
        try{
            $user = WR_PY_User::findOrFail($user_id);
        }
        catch (\Exception $exception){return response($exception , 400);}
        try{
            if ($currency=='s1'){
                $user->balance = $user->balance + $amount;
            }
            elseif ($currency=='s2'){
                $user->balance_u = $user->balance_u + $amount;
            }
            $user->save();
            return $user;
        }
        catch (\Exception $exception){return response($exception , 400);}
    }

    public function get_user_payments_with_search(Request $request)
    {
        $user_id = $request->post('id',false);
        $page = $request->post('page',false);
        $search = $request->post('search',false);
        $notifs = $request->post('notify',false);

        if ($user_id == false)
            return abort(400,'please login...');
        DB::statement( DB::raw( "SET @s = $user_id "));
        if ($page===false)
            $page = 1;
        $itemPerPage = 18;
        $offset = ($page - 1) * $itemPerPage;
        $sQuery = " WHERE 1=1  ";
        if ($search!=false){
            $s = preg_split('/ +/', $search, null, PREG_SPLIT_NO_EMPTY);
            foreach ($s as $k=>$v){
                $sQuery = $sQuery . " and txt like '%$v%'  ";
            }
        }
        $nQuery = '  ';
        if ($notifs!=false){
            $nQuery = ' AND r.status in (0 , 1) ';
        }

        $SQL = "
SELECT * FROM
  (
    SELECT * 
    ,concat(id,'|',date,'|',to_name,'|',from_name,'|',type_text,'|',stext,'|',amount,'|',ifnull(notes,'')) txt
    FROM
        (SELECT r.*
        , u1.name as to_name
        , u2.name as from_name
        , case WHEN r.to_id = @s then 0 WHEN r.from_id = @s then 1 end as type
        , case WHEN r.to_id = @s then 'مستلم' WHEN r.from_id = @s then 'مرسل' end as type_text
        , case WHEN r.status = 0 THEN 'انتظار المستلم'
               WHEN r.status = 1 THEN 'انتظار الادارة' 
               WHEN r.status = 2 THEN 'المستلم ألغى' 
               WHEN r.status = 3 THEN 'الادارة أكدت' 
               WHEN r.status = 4 THEN 'الادارة ألغت' 
          end as stext    
        , case WHEN r.status = 0 THEN 'medium'
               WHEN r.status = 1 THEN 'warning' 
               WHEN r.status = 2 THEN 'danger' 
               WHEN r.status = 3 THEN 'success' 
               WHEN r.status = 4 THEN 'danger' 
          end as scolor
        FROM wr_py_receipts r
        INNER JOIN wr_py_users u1 on u1.id = r.to_id
        INNER JOIN wr_py_users u2 on u2.id = r.from_id
        WHERE (r.to_id = @s  OR  r.from_id = @s)
          $nQuery
        ) pyy
  ) py
$sQuery     
order by created_at desc
LIMIT $offset , $itemPerPage      
        ";
        $payments = collect(DB::select($SQL , []));
        return $payments;
    }

    public function get_admin_payments_with_search(Request $request)
    {
        $user_id = $request->post('id',false);
        $page = $request->post('page',false);
        $search = $request->post('search',false);
        $notifs = $request->post('notify',false);

        if ($user_id == false)
            return abort(400,'please login...');
        DB::statement( DB::raw( "SET @s = $user_id "));
        if ($page===false)
            $page = 1;
        $itemPerPage = 18;
        $offset = ($page - 1) * $itemPerPage;
        $sQuery = " WHERE 1=1  ";
        if ($search!=false){
            $s = preg_split('/ +/', $search, null, PREG_SPLIT_NO_EMPTY);
            foreach ($s as $k=>$v){
                $sQuery = $sQuery . " and txt like '%$v%'  ";
            }
        }
        $nQuery = '  ';
        if ($notifs!=false){
            $nQuery = ' AND r.status in (0 , 1) ';
        }

        $SQL = "
SELECT * FROM
  (
    SELECT * 
    ,concat(id,'|',date,'|',to_name,'|',from_name,'|',type_text,'|',stext,'|',amount,'|',ifnull(notes,'')) txt
    FROM
        (SELECT r.*
        , u1.name as to_name
        , u2.name as from_name
        , case WHEN r.to_id = @s then 0 ELSE 3 end as type
        , case WHEN r.to_id = @s then 'مستلم' WHEN r.from_id = @s then 'مرسل' ELSE 'إدارة' end as type_text
        , case WHEN r.status = 0 THEN 'انتظار المستلم'
               WHEN r.status = 1 THEN 'انتظار الادارة' 
               WHEN r.status = 2 THEN 'المستلم ألغى' 
               WHEN r.status = 3 THEN 'الادارة أكدت' 
               WHEN r.status = 4 THEN 'الادارة ألغت' 
          end as stext    
        , case WHEN r.status = 0 THEN 'medium'
               WHEN r.status = 1 THEN 'warning' 
               WHEN r.status = 2 THEN 'danger' 
               WHEN r.status = 3 THEN 'success' 
               WHEN r.status = 4 THEN 'danger' 
          end as scolor
        FROM wr_py_receipts r
        INNER JOIN wr_py_users u1 on u1.id = r.to_id
        INNER JOIN wr_py_users u2 on u2.id = r.from_id
        WHERE 1=1  
        $nQuery
        ) pyy
  ) py
$sQuery     
order by created_at desc
LIMIT $offset , $itemPerPage      
        ";
        $payments = collect(DB::select($SQL , []));
        return $payments;
    }



}
