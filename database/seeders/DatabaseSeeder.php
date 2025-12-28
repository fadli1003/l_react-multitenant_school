<?php

namespace Database\Seeders;

use App\Models\Enrollment;
use App\Models\Teacher;
use App\Models\Tenant;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        
        Tenant::create([
            'school_name' => 'SMA N 1 Batang Kapas',
            'adress' => 'Anakan, Batang Kapas',
            'school_email' => 'smansaba@gmail.com',
        ]);
        Teacher::create([
            'nama_lengkap' => 'Fadlillah Huzhain',
            'panggilan' => 'Huzhain',
            'subject' => 'Informatika',
            'tenant_id' => 1,
        ]);
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
    }
}
