<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateScannerGPSTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('scannerGPS', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamp('time');
            $table->decimal('lat',11,8);
            $table->decimal('lng',11,8);
            $table->float('speed',11,8)->nullable();
            $table->float('heading',11,8)->nullable();
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
        Schema::dropIfExists('scannerGPS');
    }
}
