<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MapUser extends Model
{
    protected $table = 'mapUsers';
    protected $guarded = [];
    protected $casts = ['supervisor'=>'boolean'];
    protected $connection = 'mysql';
}
