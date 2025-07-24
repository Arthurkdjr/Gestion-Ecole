<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Matiere;

class MatiereSeeder extends Seeder
{
    public function run(): void
    {
        $matieres = [
            'Mathématiques',
            'Français',
            'Anglais',
            'Histoire-Géographie',
            'SVT',
            'Physique-Chimie',
            'Philosophie',
            'Informatique'
        ];

        foreach ($matieres as $nom) {
            Matiere::create(['nom' => $nom]);
        }
    }
}
