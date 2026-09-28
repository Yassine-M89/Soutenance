const express = require('express');
const router = express.Router();
const Commande = require('../models/Commande'); // Importez votre modèle Mongoose Commande

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    // 1. Récupération de toutes les commandes
    const commandes = await Commande.find();

    // 2. Calcul du nombre total de commandes
    const totalCommandes = commandes.length;

    // 3. Calcul du chiffre d'affaires total (Chiffre d'affaires)
    const totalChiffreAffaires = commandes.reduce((acc, cmd) => {
      return acc + (cmd.total || cmd.montantTotal || 0);
    }, 0);

    // 4. Calcul du montant moyen par commande
    const panierMoyen = totalCommandes > 0 ? (totalChiffreAffaires / totalCommandes) : 0;

    // 5. Calcul des ventes par produit
    const ventesParProduitMap = {};
    commandes.forEach(cmd => {
      const items = cmd.articles || cmd.items || cmd.produits || [];
      items.forEach(item => {
        const nom = item.nom || item.name || item.title || 'Produit inconnu';
        const qte = item.quantite || item.quantity || 1;
        
        ventesParProduitMap[nom] = (ventesParProduitMap[nom] || 0) + qte;
      });
    });

    // Formater pour les graphiques (ex: Chart.js / Recharts)
    const ventesParProduit = Object.keys(ventesParProduitMap).map(key => ({
      nom: key,
      quantite: ventesParProduitMap[key]
    }));

    res.json({
      totalCommandes,
      totalChiffreAffaires,
      panierMoyen,
      ventesParProduit
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({ message: "Erreur serveur lors du calcul des statistiques" });
  }
});

module.exports = router;