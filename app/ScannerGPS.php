<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ScannerGPS extends Model
{
    protected $connection = 'mysql';
    protected $table = 'scannerGPS';
    protected $guarded = [];
}
