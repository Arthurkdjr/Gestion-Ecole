<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfilController extends Controller
{
    /**
     * Récupérer le profil de l'utilisateur connecté
     */
    public function show()
    {
        $user = Auth::user();

        return response()->json([
            'message' => 'Profil récupéré avec succès',
            'user' => $user
        ]);
    }

    /**
     * Mettre à jour le profil de l'utilisateur connecté
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6|confirmed', // ex : password + password_confirmation
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ]);
    }
}
