const mongoose = require('mongoose');

const presenceSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    heureArrivee: {
        type: String,
        required: true
    },
    heureDepart: {
        type: String,
        required: true
    },
    station: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Presence', presenceSchema);