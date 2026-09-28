const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (!token) return res.status(403).json({ message: 'Accès refusé : Token manquant.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token invalide ou expiré.' });
    req.user = decoded; // Contient { id, role, email }
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé : Réservé aux administrateurs.' });
  }
};

const isClient = (req, res, next) => {
  if (req.user && (req.user.role === 'client' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé : Réservé aux clients.' });
  }
};

module.exports = { verifyToken, isAdmin, isClient };