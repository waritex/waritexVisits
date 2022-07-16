<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class WrPyReceipts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wr_py_receipts', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('from_id');
            $table->unsignedInteger('to_id');
            $table->decimal('amount');
            $table->string('currency',3)->default('SYP');
            $table->dateTime('date');
            $table->text('notes')->nullable();
            $table->dateTime('to_status_update_at')->nullable();
            $table->integer('status')->default(0);
            $table->unsignedInteger('status_update_by')->nullable();
            $table->dateTime('status_update_at')->nullable();
            $table->timestamps();

            $table->foreign('from_id')->references('id')->on('wr_py_users');
            $table->foreign('to_id')->references('id')->on('wr_py_users');
            $table->foreign('status_update_by')->references('id')->on('wr_py_users');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('wr_py_receipts');
    }
}
