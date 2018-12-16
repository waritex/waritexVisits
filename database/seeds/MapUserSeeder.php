<?php

use Illuminate\Database\Seeder;
use Maatwebsite\Excel\Facades\Excel;
use App\MapUser;

class MapUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $file = public_path('excel/MapUsers.xlsx');
        $reader = Excel::selectSheetsByIndex(0)->load($file);
        foreach ($reader->get() as $user){
            MapUser::updateOrCreate($user->toArray() , ['code'=>$user->code]);
        }
    }
}
