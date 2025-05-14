require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Presence = require('./models/Presence');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, '..'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        }
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));

// Configuration MongoDB avec timeout plus long
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 30000,
})
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes API
app.post('/api/presences', async (req, res) => {
    try {
        const presence = new Presence(req.body);
        await presence.save();
        res.status(201).json(presence);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/presences', async (req, res) => {
    try {
        const presences = await Presence.find()
            .sort({ date: -1 })
            .lean()
            .maxTimeMS(20000); // Augmente le timeout de la requête à 20 secondes
        
        if (!presences) {
            return res.status(404).json({ message: 'Aucun enregistrement trouvé' });
        }
        
        res.json(presences);
    } catch (error) {
        console.error('Erreur lors de la récupération des présences:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des données',
            error: error.message 
        });
    }
});

app.delete('/api/presences', async (req, res) => {
    try {
        await Presence.deleteMany({});
        res.json({ message: 'Toutes les présences ont été supprimées' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route de débogage pour voir le contenu de la base de données
app.get('/api/debug/database', async (req, res) => {
    try {
        const presences = await Presence.find().lean();
        const dbStatus = await mongoose.connection.db.stats();
        res.json({
            status: 'connected',
            databaseName: mongoose.connection.name,
            collections: {
                presences: {
                    count: presences.length,
                    records: presences
                }
            },
            dbStats: dbStatus
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message,
            connectionState: mongoose.connection.readyState
        });
    }
});

// Route spécifique pour les ressources statiques principales
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'styles.css'));
});

app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'script.js'));
});

// Catch-all route to serve index.html for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});