<?php

namespace App\Console;

use App\Http\Controllers\VisitController;
use App\Http\Controllers\VisitKSAController;
use App\Http\Controllers\VisitSYRController;
use App\Http\Controllers\VisitJORController;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')
        //          ->hourly();
        //
        //schedule->call('App\Http\Controllers\VisitController@task')->everyMinute();
        $irq = new VisitController();
        $jor = new VisitJORController();
        $syr = new VisitSYRController();
        $ksa = new VisitKSAController();
        try{
            $schedule->call(function () use($irq){
                $irq->task();
            })
                ->name('google')
                ->everyMinute()
                ->appendOutputTo(storage_path('app/aassdd.log'))
                ->withoutOverlapping();
        }
        catch (\Exception $e){echo "error in Iraq";}

        try{
            $schedule->call(function () use($jor){
                $jor->task();
            })
                ->name('googleJOR')
                ->everyMinute()
                ->appendOutputTo(storage_path('app/aassdd.log'))
                ->withoutOverlapping();
        }
        catch (\Exception $e){echo "error in JOR";}

        try{
            $schedule->call(function () use($syr){
                $syr->task();
            })
                ->name('googleSYR')
                ->everyMinute()
                ->appendOutputTo(storage_path('app/aassdd.log'))
                ->withoutOverlapping();
        }
        catch (\Exception $e){echo "error in SYR";}

        try{
            $schedule->call(function () use($ksa){
                $ksa->task();
            })
                ->name('googleKSA')
                ->everyMinute()
                ->appendOutputTo(storage_path('app/aassdd.log'))
                ->withoutOverlapping();
        }
        catch (\Exception $e){echo "error in KSA";}

    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
