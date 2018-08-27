<?php

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = [
            'username'          => 'test',
            'password'          => bcrypt('123'),
            'email'             => 'waritex@waritex.com',
            'name'              => 'test user',
        ];

        \App\User::create($user);
    }
}
