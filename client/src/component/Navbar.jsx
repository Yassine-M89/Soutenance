import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  // Vérification de la présence du token/user dans le localStorage
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Récupération du nom ou formatage pour écrire "Admin" à la place d' "Administrateur"
  let username = user?.nom || user?.name || user?.username || 'Utilisateur';
  if (username.toLowerCase() === 'administrateur') {
    username = 'Admin';
  }

  // L'utilisateur est considéré comme connecté si le token ou l'objet user est présent
  const isAuthenticated = Boolean(token || user);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-1 px-3 shadow-sm" style={{ minHeight: '50px' }}>
      <div className="container-fluid d-flex align-items-center justify-content-between">
        
        {/* Logo / Titre */}
        <Link className="navbar-brand fw-bold fs-6 me-4 mb-0" to="/">
          HighTech Store
        </Link>

        {/* Bouton Toggle pour Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse d-lg-flex align-items-center justify-content-between" id="navbarContent">
          {/* Liens de Navigation */}
          <ul className="navbar-nav d-flex flex-row flex-wrap align-items-center gap-3 mb-0 fs-6">
            <li className="nav-item">
              <Link className="nav-link py-1 px-2" to="/">Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link py-1 px-2" to="/boutique">Boutique</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link py-1 px-2" to="/contact">Contact</Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link py-1 px-2" to="/statistiques">Statistiques</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link py-1 px-2" to="/commandes">Commandes</Link>
                </li>
              </>
            )}
          </ul>

          {/* Section Droite : Authentifié vs Non Authentifié */}
          <div className="d-flex align-items-center gap-2 ms-auto mt-2 mt-lg-0">
            {isAuthenticated ? (
              <>
                {/* Utilisateur connecté ("Admin" au lieu d' "Administrateur") */}
                <span className="text-light fw-medium fs-6 d-flex align-items-center gap-2 me-2">
                  <span className="badge bg-secondary rounded-circle p-1" style={{ fontSize: '12px' }}>
                    👤
                  </span>
                  {username}
                </span>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm px-3 py-1 fs-6"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                {/* Boutons si déconnecté */}
                <Link to="/login" className="btn btn-outline-light btn-sm px-3 py-1">
                  Connexion
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm px-3 py-1">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;