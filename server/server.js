const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// --- SCHÉMA ET MODÈLE COMMANDES ---
const orderSchema = new mongoose.Schema({
  bonDeCommande: { type: String, unique: true },
  client: {
    nom: { type: String, required: true },
    adresse: { type: String, required: true },
    telephone: { type: String, required: true },
    methodePaiement: { type: String, default: 'especes' }
  },
  articles: Array,
  total: { type: Number, required: true },
  statut: { type: String, default: 'En attente' }
}, { 
  timestamps: true,
  collection: 'commandes' // Cible directement la collection 'commandes' dans MongoDB
});

const Order = mongoose.model('Order', orderSchema);

// --- FONCTION DE GÉNÉRATION DU N° DE BON DE COMMANDE ---
async function generateBonDeCommande() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const datePrefix = `BC${day}${month}${year}`;

  const lastOrder = await Order.findOne({
    bonDeCommande: new RegExp(`^${datePrefix}`)
  }).sort({ bonDeCommande: -1 });

  let sequence = 1;
  if (lastOrder && lastOrder.bonDeCommande) {
    const lastSeqStr = lastOrder.bonDeCommande.slice(-4);
    const lastSeqNum = parseInt(lastSeqStr, 10);
    if (!isNaN(lastSeqNum)) {
      sequence = lastSeqNum + 1;
    }
  }

  const sequenceStr = String(sequence).padStart(4, '0');
  return `${datePrefix}${sequenceStr}`;
}

// --- CONNEXION MONGODB ATLAS ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connecté avec succès à MongoDB Atlas'))
  .catch(err => console.error('Erreur de connexion à MongoDB Atlas :', err));

// --- ROUTES ---
app.use('/api/auth', authRoutes);

// 1. ROUTE GET : Calcul des statistiques à partir de la collection 'commandes'
app.get('/api/stats', async (req, res) => {
  try {
    const commandes = await Order.find();

    const totalCommandes = commandes.length;

    // Calcul du Chiffre d'Affaires Total
    const totalChiffreAffaires = commandes.reduce((acc, cmd) => {
      return acc + (cmd.total || 0);
    }, 0);

    // Calcul du Panier Moyen
    const panierMoyen = totalCommandes > 0 ? (totalChiffreAffaires / totalCommandes) : 0;

    // Agglomération des ventes par article
    const ventesParProduitMap = {};

    commandes.forEach(cmd => {
      const items = cmd.articles || [];
      items.forEach(item => {
        const nom = item.nom || item.name || item.title || 'Produit inconnu';
        const qte = Number(item.quantite || item.quantity || 1);
        ventesParProduitMap[nom] = (ventesParProduitMap[nom] || 0) + qte;
      });
    });

    const ventesParProduit = Object.keys(ventesParProduitMap).map(key => ({
      nom: key,
      quantite: ventesParProduitMap[key]
    }));

    res.status(200).json({
      totalCommandes,
      totalChiffreAffaires,
      panierMoyen,
      ventesParProduit
    });
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques :', error);
    res.status(500).json({ message: 'Erreur lors du calcul des statistiques', error });
  }
});

// 2. ROUTE POST : Enregistrer une commande
app.post('/api/orders', async (req, res) => {
  try {
    const bonDeCommande = await generateBonDeCommande();
    const newOrder = new Order({
      ...req.body,
      bonDeCommande
    });
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Commande enregistrée avec succès !', order: savedOrder });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement :', error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement de la commande', error });
  }
});

// 3. ROUTE GET : Récupérer toutes les commandes
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({ message: 'Erreur lors du chargement des commandes', error });
  }
});

// 4. ROUTE PUT : Mettre à jour le statut d'une commande
app.put('/api/orders/:id/statut', async (req, res) => {
  try {
    const { statut } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut :', error);
    res.status(500).json({ message: 'Erreur de mise à jour du statut', error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});