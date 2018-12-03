<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GPSReads extends Model
{
    protected $connection = 'mysql';
    protected $table = 'gpsreads';
    protected $guarded = [];
}
