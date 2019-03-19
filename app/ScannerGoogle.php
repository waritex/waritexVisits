<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ScannerGoogle extends Model
{
    protected $connection = 'mysql';
    protected $table = 'scannerGoogle';
    protected $guarded = [];
}
