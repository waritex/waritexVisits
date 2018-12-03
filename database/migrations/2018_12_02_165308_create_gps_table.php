<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGPSTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('GPSReads', function (Blueprint $table) {
            $table->increments('id');
            $table->decimal('lat',10,8);
            $table->decimal('lng',10,8);
            $table->string('satellite');
            $table->string('accuracy');
            $table->string('provider');
            $table->timestamp('time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('GPSReads');
    }
}
