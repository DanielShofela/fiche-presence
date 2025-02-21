// Clé pour le stockage local
const STORAGE_KEY = 'presence_records';

// Récupérer les enregistrements du stockage local
function getRecords() {
    const records = localStorage.getItem(STORAGE_KEY);
    return records ? JSON.parse(records) : [];
}

// Sauvegarder les enregistrements dans le stockage local
function saveRecords(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// Ajouter un nouvel enregistrement
function addRecord(record) {
    const records = getRecords();
    records.push(record);
    saveRecords(records);
    displayRecords();
}

// Afficher les enregistrements dans la page
function displayRecords() {
    const records = getRecords();
    const recordsDiv = document.getElementById('records');
    recordsDiv.innerHTML = '';

    records.forEach((record, index) => {
        const recordElement = document.createElement('div');
        recordElement.className = 'record-item';
        recordElement.innerHTML = `
            <p><strong>Nom:</strong> ${record.nom}</p>
            <p><strong>Date:</strong> ${record.date}</p>
            <p><strong>Arrivée:</strong> ${record.heureArrivee}</p>
            <p><strong>Départ:</strong> ${record.heureDepart}</p>
            <p><strong>Situation:</strong> ${record.Situation}</p>
        `;
        recordsDiv.appendChild(recordElement);
    });
}

// Convertir les enregistrements en CSV
function recordsToCSV() {
    const records = getRecords();
    const headers = ['Nom', 'Date', 'Heure Arrivée', 'Heure Départ', 'Situation'];
    const csvRows = [headers];

    records.forEach(record => {
        csvRows.push([
            record.nom,
            record.date,
            record.heureArrivee,
            record.heureDepart,
            record.Situation
        ]);
    });

    return csvRows.map(row => row.join(',')).join('\n');
}

// Télécharger le fichier CSV
function downloadCSV() {
    const csv = recordsToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'presence_records.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Effacer toutes les données
function clearData() {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données ?')) {
        localStorage.removeItem(STORAGE_KEY);
        displayRecords();
    }
}

// Gestionnaire d'événements pour le formulaire
document.getElementById('presenceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const record = {
        nom: document.getElementById('nom').value,
        date: document.getElementById('date').value,
        heureArrivee: document.getElementById('heureArrivee').value,
        heureDepart: document.getElementById('heureDepart').value,
        Situation: document.getElementById('Situation').value
    };

    addRecord(record);
    this.reset();
});

// Gestionnaire d'événements pour le bouton d'exportation
document.getElementById('exportBtn').addEventListener('click', downloadCSV);

// Gestionnaire d'événements pour le bouton d'effacement
document.getElementById('clearBtn').addEventListener('click', clearData);

// Afficher les enregistrements au chargement de la page
document.addEventListener('DOMContentLoaded', displayRecords);
