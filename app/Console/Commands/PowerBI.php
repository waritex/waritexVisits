<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;
use Faker\Generator as Faker;

class PowerBI extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bi:enter';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Enter data to PowerBI dataset';

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
    public function handle(Faker $faker)
    {
        $http = new Client([ 'headers' => [ 'Content-Type' => 'application/json' ]]);
        for ($i=0;$i<10;$i++){
            $data = [
                'id' => $i+1,
                'name' => $faker->name,
                'sale' => $faker->numberBetween(10,99999999)*0.1,
                'date' => now(),
            ];
            $this->send_req($data);
//            try{
//                $response = $http->post('https://api.powerbi.com/beta/04e8840e-a4be-449b-a3aa-ef463fa472ff/datasets/e88cda65-9682-43c2-9a15-2284ce255a75/rows?key=P9yAC0NhfPCjXy03HeklSnLJoniPpH3avDZDPlHpdWVPAqeid8t7ZgN0ggNYTS2T5JfrPKyOiCtApTQQhoOLxQ%3D%3D',
//                    [
//                        [
//                            'id' => $i+1,
//                            'name' => $faker->name,
//                            'sale' => $faker->numberBetween(10,99999999)*0.1,
//                            'date' => now(),
//                        ]
//                    ]
//                );
//            }
//            catch (\Exception $exception){
//                $this->info( $exception);
//            }
            $this->info( 'Done '.($i+1));
        }

        return $this->info( 'Done ALL');
    }


    private function send_req($data)
    {
        //API Url
        $url = 'https://api.powerbi.com/beta/04e8840e-a4be-449b-a3aa-ef463fa472ff/datasets/e88cda65-9682-43c2-9a15-2284ce255a75/rows?key=P9yAC0NhfPCjXy03HeklSnLJoniPpH3avDZDPlHpdWVPAqeid8t7ZgN0ggNYTS2T5JfrPKyOiCtApTQQhoOLxQ%3D%3D';

        //Initiate cURL.
        $ch = curl_init($url);

        //The JSON data.
        $jsonData = $data;

        //Encode the array into JSON.
        $jsonDataEncoded = json_encode($jsonData);

        //Tell cURL that we want to send a POST request.
        curl_setopt($ch, CURLOPT_POST, 1);

        //Attach our encoded JSON string to the POST fields.
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonDataEncoded);

        //Set the content type to application/json
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

        //Execute the request
        $result = curl_exec($ch);
    }
}
