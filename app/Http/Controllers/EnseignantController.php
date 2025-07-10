<?php

namespace App\Http\Controllers;

use App\Models\Enseignant;
use Illuminate\Http\Request;

class EnseignantController extends Controller
{
    public function index()
    {
        return Enseignant::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:enseignants,email',
        ]);

        $enseignant = Enseignant::create($validated);

        return response()->json([
            'message' => 'Enseignant créé avec succès',
            'enseignant' => $enseignant
        ], 201);
    }

    public function show($id)
    {
        return Enseignant::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $enseignant = Enseignant::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:enseignants,email,' . $id,
        ]);

        $enseignant->update($validated);

        return response()->json([
            'message' => 'Enseignant mis à jour avec succès',
            'enseignant' => $enseignant
        ]);
    }

    public function destroy($id)
    {
        $enseignant = Enseignant::findOrFail($id);
        $enseignant->delete();

        return response()->json(['message' => 'Enseignant supprimé avec succès']);
    }
}
