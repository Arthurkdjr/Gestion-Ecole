<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ClasseSeeder::class,
            EleveSeeder::class,
            MatiereSeeder::class,
            ProfesseurSeeder::class,
            NoteSeeder::class,
            UserSeeder::class,
            FactureSeeder::class,
        ]);
    }
}
