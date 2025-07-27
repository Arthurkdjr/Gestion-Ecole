# Endpoints API pour l'Affectation des Classes aux Enseignants

## Endpoints Nécessaires

### 1. Affecter des Classes à un Enseignant
```
POST /api/enseignants/{enseignant_id}/affecter-classes
```

**Body:**
```json
{
  "classe_ids": [1, 2, 3]
}
```

**Réponse de succès (200):**
```json
{
  "message": "Classes affectées avec succès",
  "enseignant": {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@ecole.com",
    "specialite": "Mathématiques",
    "classes": [
      {
        "id": 1,
        "nom": "6ème A",
        "niveau": "6ème"
      },
      {
        "id": 2,
        "nom": "5ème B",
        "niveau": "5ème"
      }
    ]
  }
}
```

### 2. Récupérer les Classes d'un Enseignant
```
GET /api/enseignants/{enseignant_id}/classes
```

**Réponse de succès (200):**
```json
[
  {
    "id": 1,
    "nom": "6ème A",
    "niveau": "6ème",
    "annee_scolaire": "2024-2025"
  },
  {
    "id": 2,
    "nom": "5ème B",
    "niveau": "5ème",
    "annee_scolaire": "2024-2025"
  }
]
```

## Implémentation Laravel Suggérée

### 1. Route dans `routes/api.php`
```php
Route::post('/enseignants/{enseignant}/affecter-classes', [EnseignantController::class, 'affecterClasses']);
Route::get('/enseignants/{enseignant}/classes', [EnseignantController::class, 'getClasses']);
```

### 2. Méthodes dans `EnseignantController`
```php
public function affecterClasses(Request $request, Enseignant $enseignant)
{
    $request->validate([
        'classe_ids' => 'required|array',
        'classe_ids.*' => 'exists:classes,id'
    ]);

    // Supprimer les anciennes affectations
    $enseignant->classes()->detach();
    
    // Ajouter les nouvelles affectations
    $enseignant->classes()->attach($request->classe_ids);

    // Recharger l'enseignant avec ses classes
    $enseignant->load('classes');

    return response()->json([
        'message' => 'Classes affectées avec succès',
        'enseignant' => $enseignant
    ]);
}

public function getClasses(Enseignant $enseignant)
{
    return response()->json($enseignant->classes);
}
```

### 3. Relation dans le modèle `Enseignant`
```php
public function classes()
{
    return $this->belongsToMany(Classe::class, 'enseignant_classe');
}
```

### 4. Migration pour la table pivot (si elle n'existe pas)
```php
Schema::create('enseignant_classe', function (Blueprint $table) {
    $table->id();
    $table->foreignId('enseignant_id')->constrained()->onDelete('cascade');
    $table->foreignId('classe_id')->constrained()->onDelete('cascade');
    $table->timestamps();
    
    $table->unique(['enseignant_id', 'classe_id']);
});
```

## Codes d'Erreur

- **404** : Enseignant non trouvé
- **422** : Données de validation invalides
- **500** : Erreur serveur interne

## Notes Importantes

1. **Table pivot** : Assurez-vous que la table `enseignant_classe` existe
2. **Validation** : Validez que les classes existent avant l'affectation
3. **Cascade** : Configurez les suppressions en cascade si nécessaire
4. **Permissions** : Ajoutez les middlewares d'authentification si nécessaire 