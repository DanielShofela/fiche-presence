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

<<<<<<< HEAD
// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker enregistré avec succès');
            })
            .catch(error => {
                console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
            });
    });
}

// Configuration de IndexedDB
const DB_NAME = 'PresenceDB';
const DB_VERSION = 1;
const API_URL = 'http://localhost:3000/api';

const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // Suppression des anciens stores s'ils existent
            if (db.objectStoreNames.contains('presences')) {
                db.deleteObjectStore('presences');
            }
            if (db.objectStoreNames.contains('pending')) {
                db.deleteObjectStore('pending');
            }

            // Création des nouveaux stores avec une clé auto-incrémentée
            db.createObjectStore('presences', { keyPath: '_id', autoIncrement: true });
            db.createObjectStore('pending', { keyPath: '_id', autoIncrement: true });
        };
    });
};

// Fonction pour sauvegarder une présence
async function savePresence(formData) {
    try {
        const db = await openDB();
        const tx = db.transaction(['presences'], 'readwrite');
        const presencesStore = tx.objectStore('presences');
        
        // Préparation des données avec un format valide
        const presenceData = {
            nom: formData.nom,
            date: formData.date,
            heureArrivee: formData.heureArrivee,
            heureDepart: formData.heureDepart,
            station: formData.station,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // Ajout dans IndexedDB
        const id = await presencesStore.add(presenceData);
        
        // Tentative de synchronisation avec le serveur
        try {
            if (navigator.onLine) {
                const response = await fetch(`${API_URL}/presences`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(presenceData)
                });
                
                if (!response.ok) {
                    throw new Error('Erreur de synchronisation');
                }
                
                // Mise à jour du statut
                presenceData.status = 'synced';
                await presencesStore.put({ ...presenceData, _id: id });
            } else {
                alert('Vous êtes hors ligne. L\'enregistrement a été sauvegardé localement et sera synchronisé quand la connexion sera rétablie.');
            }
        } catch (serverError) {
            console.error('Erreur de synchronisation:', serverError);
            alert('Problème de connexion. L\'enregistrement a été sauvegardé localement et sera synchronisé plus tard.');
        }
        
        await tx.complete;
        displayRecords();
        return id;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde locale: ' + error.message);
        throw error;
    }
}

// Fonction pour afficher les enregistrements
async function displayRecords() {
    try {
        console.log('Tentative de récupération des données...');
        const response = await fetch(`${API_URL}/presences`);
        console.log('Statut de la réponse:', response.status);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const serverRecords = await response.json();
        console.log('Données reçues:', serverRecords);
        
        const recordsDiv = document.getElementById('records');
        recordsDiv.innerHTML = '';
        
        if (serverRecords && serverRecords.length > 0) {
            console.log(`Affichage de ${serverRecords.length} enregistrements`);
            serverRecords
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .forEach(record => {
                    const recordElement = document.createElement('div');
                    recordElement.className = 'record-item';
                    const date = new Date(record.date).toLocaleDateString();
                    recordElement.innerHTML = `
                        <p><strong>${record.nom}</strong> - ${date}</p>
                        <p>Arrivée: ${record.heureArrivee} - Départ: ${record.heureDepart}</p>
                        <p>Station: ${record.station}</p>
                    `;
                    recordsDiv.appendChild(recordElement);
                });
        } else {
            recordsDiv.innerHTML = '<p>Aucun enregistrement trouvé</p>';
        }
    } catch (error) {
        console.error('Erreur détaillée lors de l\'affichage des enregistrements:', error);
        const recordsDiv = document.getElementById('records');
        recordsDiv.innerHTML = `<p>Erreur lors du chargement des enregistrements: ${error.message}</p>`;
    }
}

// Écouteur d'événements pour le formulaire
document.getElementById('presenceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
=======
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
>>>>>>> 2f2737c1e1a4a88e4a15f3910baddfdb0776c95e
        nom: document.getElementById('nom').value,
        date: document.getElementById('date').value,
        heureArrivee: document.getElementById('heureArrivee').value,
        heureDepart: document.getElementById('heureDepart').value,
<<<<<<< HEAD
        station: document.getElementById('station').value,
        timestamp: new Date().toISOString()
    };

    try {
        await savePresence(formData);
        e.target.reset();
    } catch (error) {
        alert('Erreur lors de l\'enregistrement. Les données sont sauvegardées localement.');
    }
});

// Fonction pour exporter en CSV
document.getElementById('exportBtn').addEventListener('click', async () => {
    try {
        const db = await openDB();
        const tx = db.transaction('presences', 'readonly');
        const store = tx.objectStore('presences');
        const records = await store.getAll();

        const csvContent = "data:text/csv;charset=utf-8," 
            + "Nom,Date,Heure d'arrivée,Heure de départ,Station\n"
            + records.map(record => 
                `${record.nom},${record.date},${record.heureArrivee},${record.heureDepart},${record.station}`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "presences.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        alert('Erreur lors de l\'export des données');
    }
});

// Fonction pour effacer les données
document.getElementById('clearBtn').addEventListener('click', async () => {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données ?')) {
        try {
            const db = await openDB();
            const tx = db.transaction(['presences', 'pending'], 'readwrite');
            await tx.objectStore('presences').clear();
            await tx.objectStore('pending').clear();
            await tx.complete;
            displayRecords();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            alert('Erreur lors de la suppression des données');
        }
    }
});

// Afficher les enregistrements au chargement
window.addEventListener('load', displayRecords);

// Gestion de l'état de la connexion
window.addEventListener('online', () => {
    if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker) {
        navigator.serviceWorker.ready.then(registration => {
            registration.sync.register('sync-presences');
        });
    }
});
=======
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
>>>>>>> 2f2737c1e1a4a88e4a15f3910baddfdb0776c95e
