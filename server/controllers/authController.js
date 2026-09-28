const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Inscription d'un nouvel utilisateur (Client ou Admin)
exports.register = async (req, res) => {
  try {
    const { nom, email, password, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    const user = new User({ nom, email, password, role });
    await user.save();

    res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Connexion et génération du Token JWT
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    // Générer le Token JWT (valable 1 jour)
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tableau de bord Client (accessible aux clients et admins)
exports.getClientDashboard = (req, res) => {
  res.status(200).json({
    message: 'Bienvenue sur l’espace session Client !',
    user: req.user
  });
};

// Tableau de bord Admin (strictement réservé aux admins)
exports.getAdminDashboard = (req, res) => {
  res.status(200).json({
    message: 'Bienvenue sur l’espace session Administrateur !',
    user: req.user
  });
};