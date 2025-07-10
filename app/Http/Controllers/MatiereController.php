<?php

namespace App\Http\Controllers;

use App\Models\Matiere;
use Illuminate\Http\Request;

class MatiereController extends Controller
{
    public function index()
    {
        return Matiere::with('notes')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $matiere = Matiere::create($validated);

        return response()->json([
            'message' => 'Matière créée avec succès',
            'matiere' => $matiere
        ], 201);
    }

    public function show($id)
    {
        $matiere = Matiere::with('notes')->findOrFail($id);
        return $matiere;
    }

    public function update(Request $request, $id)
    {
        $matiere = Matiere::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
        ]);

        $matiere->update($validated);

        return response()->json([
            'message' => 'Matière mise à jour avec succès',
            'matiere' => $matiere
        ]);
    }

    public function destroy($id)
    {
        $matiere = Matiere::findOrFail($id);
        $matiere->delete();

        return response()->json(['message' => 'Matière supprimée avec succès']);
    }
}
