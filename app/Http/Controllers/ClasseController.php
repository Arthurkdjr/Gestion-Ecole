<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use Illuminate\Http\Request;

class ClasseController extends Controller
{
    public function index()
    {
        return Classe::with('eleves')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $classe = Classe::create($validated);

        return response()->json([
            'message' => 'Classe créée avec succès',
            'classe' => $classe
        ], 201);
    }

    public function show($id)
    {
        $classe = Classe::with('eleves')->findOrFail($id);
        return $classe;
    }

    public function update(Request $request, $id)
    {
        $classe = Classe::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
        ]);

        $classe->update($validated);

        return response()->json([
            'message' => 'Classe mise à jour avec succès',
            'classe' => $classe
        ]);
    }

    public function destroy($id)
    {
        $classe = Classe::findOrFail($id);
        $classe->delete();

        return response()->json(['message' => 'Classe supprimée avec succès']);
    }
}
