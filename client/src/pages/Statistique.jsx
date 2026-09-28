import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Importation de la bannière
import statsBanner from '../assets/statistiques.jpg';

function Statistique() {
  const [stats, setStats] = useState({
    totalCommandes: 0,
    totalChiffreAffaires: 0,
    panierMoyen: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/stats');
        setStats(response.data);
      } catch (err) {
        console.warn("Échec sur port 3000, essai sur port 5000...", err);
        try {
          const responseFallback = await axios.get('http://localhost:5000/api/stats');
          setStats(responseFallback.data);
        } catch (err2) {
          console.error("Erreur lors du chargement des statistiques :", err2);
          setError("Impossible de charger les statistiques depuis la collection commandes.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container text-center my-5 py-5">
        <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
        <p className="mt-2 text-muted small">Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-4" style={{ maxWidth: '600px' }}>
        <div className="alert alert-danger text-center p-2 small shadow-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="container my-3" style={{ maxWidth: '850px' }}>
      {/* BANNIÈRE EN TÊTE DE PAGE */}
      <div className="text-center mb-4">
        <img 
          src={statsBanner} 
          alt="Bannière Statistiques des Ventes" 
          className="img-fluid rounded shadow-sm w-100" 
          style={{ maxHeight: '180px', objectFit: 'cover' }}
        />
      </div>

      {/* CARTES INDICATRICES COMPACTES */}
      <div className="row g-3 justify-content-center">
        <div className="col-sm-4">
          <div className="card shadow-sm border-0 text-center bg-primary text-white p-2 rounded">
            <span className="small text-uppercase fw-semibold opacity-75">Total Commandes</span>
            <h4 className="fw-bold mb-0 mt-1">{stats.totalCommandes}</h4>
          </div>
        </div>

        <div className="col-sm-4">
          <div className="card shadow-sm border-0 text-center bg-success text-white p-2 rounded">
            <span className="small text-uppercase fw-semibold opacity-75">Chiffre d'Affaires</span>
            <h4 className="fw-bold mb-0 mt-1">{stats.totalChiffreAffaires.toFixed(2)} Dt</h4>
          </div>
        </div>

        <div className="col-sm-4">
          <div className="card shadow-sm border-0 text-center bg-info text-white p-2 rounded">
            <span className="small text-uppercase fw-semibold opacity-75">Panier Moyen</span>
            <h4 className="fw-bold mb-0 mt-1">{stats.panierMoyen.toFixed(2)} Dt</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistique;