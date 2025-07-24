<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Classe;

class ClasseSeeder extends Seeder
{
    public function run(): void
    {
        Classe::create(['nom' => '6ème A']);
        Classe::create(['nom' => '5ème B']);
    }
}
