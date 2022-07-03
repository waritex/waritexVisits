<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WR_PY_User extends Model
{
    protected $connection = 'mysql';
    protected $table = 'wr_py_users';
    protected $guarded = [];
    protected $hidden = ['password','updated_at','created_at'];
}
