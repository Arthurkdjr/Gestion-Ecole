<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Note;

class NoteSeeder extends Seeder
{
    public function run(): void
    {
        Note::create([
            'eleve_id' => 1,
            'matiere_id' => 1,
            'note' => 15
        ]);

        Note::create([
            'eleve_id' => 1,
            'matiere_id' => 2,
            'note' => 17
        ]);

        Note::create([
            'eleve_id' => 2,
            'matiere_id' => 1,
            'note' => 14
        ]);
    }
}
