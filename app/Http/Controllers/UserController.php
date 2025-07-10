<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index() {
        return User::all();
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:admin,enseignant,parent'
        ]);
        $data = $request->all();
        $data['password'] = Hash::make($request->password);
        return User::create($data);
    }

    public function show($id) {
        return User::findOrFail($id);
    }

    public function update(Request $request, $id) {
        $user = User::findOrFail($id);
        $user->update($request->except('password'));
        return $user;
    }

    public function destroy($id) {
        User::destroy($id);
        return response()->json(['message' => 'Utilisateur supprimé']);
    }
}
