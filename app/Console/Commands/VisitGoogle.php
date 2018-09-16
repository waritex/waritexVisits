<?php

namespace App\Console\Commands;

use App\Http\Controllers\VisitController;
use Illuminate\Console\Command;

class VisitGoogle extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'get:google';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'get google info from salesbuzz visits';

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
        $stDate = $this->ask('please Enter Start Date: ');
        $enDate = $this->ask('please Enter End Date: ');
        $controller = new VisitController();
        $controller->fixTaskManually($stDate, $enDate);
    }
}
