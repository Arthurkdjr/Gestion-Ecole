# Statuts des Enseignants - Documentation

## Valeurs de Statut Disponibles

Le système de gestion des enseignants utilise les statuts suivants :

### 1. Statuts Principaux
- **Actif** : Enseignant en activité normale
- **Inactif** : Enseignant temporairement inactif
- **Retraité** : Enseignant à la retraite
- **Vacataire** : Enseignant en contrat temporaire
- **Titulaire** : Enseignant titulaire de son poste
- **Contractuel** : Enseignant en contrat à durée déterminée

## Implémentation Backend

### 1. Migration pour la Table Enseignants
```php
Schema::table('enseignants', function (Blueprint $table) {
    $table->enum('statut', [
        'Actif',
        'Inactif', 
        'Retraité',
        'Vacataire',
        'Titulaire',
        'Contractuel'
    ])->default('Actif');
});
```

### 2. Validation dans le Modèle
```php
protected $fillable = [
    'nom',
    'prenom', 
    'email',
    'specialite',
    'date_embauche',
    'statut',
    'mot_de_passe'
];

protected $casts = [
    'date_embauche' => 'date'
];

public static $rules = [
    'nom' => 'required|string|max:255',
    'prenom' => 'required|string|max:255',
    'email' => 'required|email|unique:enseignants,email',
    'specialite' => 'required|string|max:255',
    'date_embauche' => 'required|date',
    'statut' => 'required|in:Actif,Inactif,Retraité,Vacataire,Titulaire,Contractuel',
    'mot_de_passe' => 'nullable|string|min:6'
];
```

### 3. Controller Validation
```php
public function store(Request $request)
{
    $request->validate([
        'nom' => 'required|string|max:255',
        'prenom' => 'required|string|max:255',
        'email' => 'required|email|unique:enseignants,email',
        'specialite' => 'required|string|max:255',
        'date_embauche' => 'required|date',
        'statut' => 'required|in:Actif,Inactif,Retraité,Vacataire,Titulaire,Contractuel',
        'mot_de_passe' => 'nullable|string|min:6'
    ]);

    // Logique de création...
}
```

## Codes Couleur Frontend

Chaque statut a une couleur spécifique dans l'interface :

- **Actif** : Vert (#27ae60)
- **Inactif** : Rouge (#e74c3c)  
- **Retraité** : Orange (#f39c12)
- **Vacataire** : Violet (#9b59b6)
- **Titulaire** : Turquoise (#1abc9c)
- **Contractuel** : Gris foncé (#34495e)

## Notes Importantes

1. **Sensibilité à la casse** : Les valeurs sont sensibles à la casse
2. **Validation** : Le backend doit valider que la valeur est dans la liste autorisée
3. **Par défaut** : Nouveaux enseignants = "Actif"
4. **Historique** : Considérer l'ajout d'un champ pour l'historique des statuts

## Test des Statuts

Pour tester, utilisez ces données d'exemple :

```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@ecole.com",
  "specialite": "Mathématiques",
  "date_embauche": "2020-09-01",
  "statut": "Actif",
  "mot_de_passe": "password123"
}
``` 