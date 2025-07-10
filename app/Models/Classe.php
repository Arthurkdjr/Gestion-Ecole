<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        // tu peux ajouter ici d'autres colonnes : niveau, filière, etc.
    ];

    /**
     * Une classe a plusieurs élèves.
     */
    public function eleves()
    {
        return $this->hasMany(Eleve::class);
    }

    /**
     * Une classe peut avoir plusieurs enseignants via les matières (selon ton architecture).
     * Ici, on peut ajouter d'autres relations si nécessaire.
     */
}
