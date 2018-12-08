<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\VisitJORController;

class JORVisits extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'JOR:api';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'get google visits for JOR';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $controller = new VisitJORController();
        $controller->task();
    }
}
