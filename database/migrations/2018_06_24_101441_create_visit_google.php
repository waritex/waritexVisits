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
            // $table->string('salesman_id',10);
            $table->dateTime('visit_start',3);
            $table->dateTime('visit_finish',3);
            // $table->dateTime('sync_time');
            $table->decimal('current_customer_lat',13,10);
            $table->decimal('current_customer_lng',13,10);
            $table->string('last_visit_id',20)->nullable();
            $table->decimal('last_customer_lat',13,10)->nullable();
            $table->decimal('last_customer_lng',13,10)->nullable();
            $table->integer('google_time_pessimistic')->nullable();
            $table->integer('google_distance')->nullable();
            $table->integer('last_read_distance')->nullable();
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
