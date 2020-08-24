<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class InfoEvents extends Model
{
    protected $guarded = [];
    protected $table = 'WR_Map_Info_Events';
    public $timestamps = false;
    protected $connection = 'wri';
}
