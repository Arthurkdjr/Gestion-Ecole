<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Eleve;

class EleveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Eleve::create([
            'nom' => 'Diouf',
            'prenom' => 'Khary',
            'email' => 'khary@example.com',
            'date_naissance' => '2010-04-12',
            'classe_id' => 1
        ]);

        Eleve::create([
            'nom' => 'Sow',
            'prenom' => 'Aminata',
            'email' => 'aminata@example.com',
            'date_naissance' => '2011-06-22',
            'classe_id' => 1
        ]);

        Eleve::create([
            'nom' => 'Ndiaye',
            'prenom' => 'Cheikh',
            'email' => 'cheikh@example.com',
            'date_naissance' => '2009-10-05',
            'classe_id' => 2
        ]);
    }
}
