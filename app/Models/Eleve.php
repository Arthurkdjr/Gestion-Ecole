<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Eleve extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'classe_id',
        // ajoute ici d'autres colonnes si nécessaires
    ];

    /**
     * Un élève appartient à une classe.
     */
    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    /**
     * Un élève a plusieurs notes.
     */
    public function notes()
    {
        return $this->hasMany(Note::class);
    }
}
