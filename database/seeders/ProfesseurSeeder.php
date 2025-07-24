<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Professeur;

class ProfesseurSeeder extends Seeder
{
    public function run(): void
    {
        Professeur::create([
            'nom' => 'Fall',
            'prenom' => 'Awa',
            'email' => 'awa.fall@example.com',
            'matiere_id' => 1
        ]);

        Professeur::create([
            'nom' => 'Ba',
            'prenom' => 'Ibrahima',
            'email' => 'ibrahima.ba@example.com',
            'matiere_id' => 2
        ]);
    }
}
