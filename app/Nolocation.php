<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Nolocation extends Model
{
    protected $table = 'nolocation';
    public $timestamps = false;
    protected $guarded = [];
}
