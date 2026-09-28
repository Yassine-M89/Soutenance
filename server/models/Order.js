const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  client: {
    nom: { type: String, required: true },
    adresse: { type: String, required: true },
    telephone: { type: String, required: true },
    methodePaiement: { type: String, default: 'especes' }
  },
  articles: [
    {
      id: Number,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total: { type: Number, required: true },
  statut: { type: String, default: 'En attente' }
}, { 
  timestamps: true,
  collection: 'commandes' // <--- Enregistre les données dans la collection "commandes"
});

module.exports = mongoose.model('Order', orderSchema);