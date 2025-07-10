<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Bulletin de Notes</title>
    <style>
        body { font-family: DejaVu Sans; }
        h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: center; }
        .infos { margin-top: 20px; }
    </style>
</head>
<body>
    <h2>Bulletin de Notes</h2>
    
    <div class="infos">
        <strong>Élève :</strong> {{ $eleve->prenom }} {{ $eleve->nom }}<br>
        <strong>Classe :</strong> {{ $eleve->classe->nom ?? 'N/A' }}<br>
        <strong>Moyenne Générale :</strong> {{ number_format($moyenne, 2) }}/20
    </div>

    <table>
        <thead>
            <tr>
                <th>Matière</th>
                <th>Note</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($notes as $note)
                <tr>
                    <td>{{ $note->matiere->nom ?? 'N/A' }}</td>
                    <td>{{ $note->valeur }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
