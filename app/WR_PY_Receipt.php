<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WR_PY_Receipt extends Model
{
    protected $connection = 'mysql';
    protected $table = 'wr_py_receipts';
    protected $guarded = [];
}
