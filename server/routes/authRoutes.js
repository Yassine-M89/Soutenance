const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin, isClient } = require('../middleware/auth');

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);

// Routes protégées (Sessions spécifiques)
router.get('/', verifyToken, isClient, authController.getClientDashboard);
router.get('/', verifyToken, isAdmin, authController.getAdminDashboard);

module.exports = router;