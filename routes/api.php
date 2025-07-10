<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\EleveController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\MatiereController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\EnseignantController;

// Routes publiques (non authentifiées)
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Routes protégées par authentification Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    // Profil utilisateur connecté
    Route::get('profil', [ProfilController::class, 'show']);
    Route::put('profil', [ProfilController::class, 'update']);

    // CRUD Ressources
    Route::apiResource('eleves', EleveController::class);
    Route::apiResource('classes', ClasseController::class);
    Route::apiResource('matieres', MatiereController::class);
    Route::apiResource('notes', NoteController::class);
    Route::apiResource('enseignants', EnseignantController::class);
});
