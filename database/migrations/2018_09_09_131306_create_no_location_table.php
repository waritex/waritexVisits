<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNoLocationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nolocation', function (Blueprint $table) {
            $table->increments('id');
            $table->string('customerId',12)->unique();
            $table->string('customerName');
            $table->string('salesmanCode',8);
            $table->string('region');
            $table->string('district');
            $table->string('city');
            $table->string('area');
            $table->string('address');
            $table->string('tel');
            $table->string('mobile');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('nolocation');
    }
}
