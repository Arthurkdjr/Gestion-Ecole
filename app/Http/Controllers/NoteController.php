<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Eleve;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class NoteController extends Controller
{
    /**
     * Afficher toutes les notes.
     */
    public function index()
    {
        $notes = Note::with(['eleve', 'matiere'])->get();
        return response()->json($notes);
    }

    /**
     * Enregistrer une nouvelle note.
     */
    public function store(Request $request)
    {
        $request->validate([
            'eleve_id' => 'required|exists:eleves,id',
            'matiere_id' => 'required|exists:matieres,id',
            'valeur' => 'required|numeric|min:0|max:20',
        ]);

        $note = Note::create($request->all());
        return response()->json(['message' => 'Note ajoutée avec succès', 'note' => $note]);
    }

    /**
     * Afficher une note spécifique.
     */
    public function show($id)
    {
        $note = Note::with(['eleve', 'matiere'])->findOrFail($id);
        return response()->json($note);
    }

    /**
     * Mettre à jour une note.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'valeur' => 'required|numeric|min:0|max:20',
        ]);

        $note = Note::findOrFail($id);
        $note->update($request->all());

        return response()->json(['message' => 'Note mise à jour avec succès', 'note' => $note]);
    }

    /**
     * Supprimer une note.
     */
    public function destroy($id)
    {
        $note = Note::findOrFail($id);
        $note->delete();

        return response()->json(['message' => 'Note supprimée avec succès']);
    }

    /**
     * Générer le bulletin PDF d’un élève.
     */
    public function genererBulletin($id)
    {
        $eleve = Eleve::with('classe')->findOrFail($id);
        $notes = Note::where('eleve_id', $id)->with('matiere')->get();
        $moyenne = $notes->avg('valeur');

        $pdf = Pdf::loadView('bulletins.bulletin_pdf', compact('eleve', 'notes', 'moyenne'));

        return $pdf->download('bulletin_'.$eleve->nom.'.pdf');
    }
}
