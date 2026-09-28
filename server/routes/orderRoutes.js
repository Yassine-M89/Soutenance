const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Route POST : Créer une nouvelle commande
router.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement de la commande", error });
  }
});

// Route GET : Récupérer toutes les commandes pour l'Admin
router.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Trie par la plus récente
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des commandes", error });
  }
});

module.exports = router;