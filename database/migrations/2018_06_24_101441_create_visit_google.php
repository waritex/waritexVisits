<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVisitGoogle extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('visits', function (Blueprint $table) {
            $table->increments('id');

            $table->string('visit_id',20);
            $table->string('salesman_id',10);
            $table->date('visit_date');
            $table->decimal('current_customer_lat',13,10);
            $table->decimal('current_customer_lng',13,10);
            $table->decimal('last_customer_lat',13,10);
            $table->decimal('last_customer_lng',13,10);
            $table->float('google_time_pessimistic',10,3);
            $table->float('google_distance',10,3);
            $table->timestamps();

            $table->unique('visit_id');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('visits');
    }
}
