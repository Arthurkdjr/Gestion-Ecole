<?php

namespace App\Http\Controllers;

use App\Models\Eleve;
use Illuminate\Http\Request;

class EleveController extends Controller
{
    public function index()
    {
        return Eleve::with('classe')->get(); // Inclut la relation avec la classe
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'classe_id' => 'required|exists:classes,id',
        ]);

        $eleve = Eleve::create($validated);

        return response()->json([
            'message' => 'Élève créé avec succès',
            'eleve' => $eleve
        ], 201);
    }

    public function show($id)
    {
        $eleve = Eleve::with('classe')->findOrFail($id);
        return $eleve;
    }

    public function update(Request $request, $id)
    {
        $eleve = Eleve::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'date_naissance' => 'sometimes|date',
            'classe_id' => 'sometimes|exists:classes,id',
        ]);

        $eleve->update($validated);

        return response()->json([
            'message' => 'Élève mis à jour avec succès',
            'eleve' => $eleve
        ]);
    }

    public function destroy($id)
    {
        $eleve = Eleve::findOrFail($id);
        $eleve->delete();

        return response()->json([
            'message' => 'Élève supprimé avec succès'
        ]);
    }
}
