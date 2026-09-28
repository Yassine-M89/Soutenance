import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Importation de la bannière depuis les assets
import colisBanner from '../assets/colis.jpg';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // État pour la commande sélectionnée dans la modale
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/orders');
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else if (response.data && Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des commandes :", err);
      setError("Impossible de charger les commandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fonction pour basculer le statut via la case à cocher
  const handleCheckboxChange = async (orderId, currentStatut) => {
    const newStatut = currentStatut === 'Traitée' ? 'En attente' : 'Traitée';
    try {
      const response = await axios.put(`http://localhost:3000/api/orders/${orderId}/statut`, {
        statut: newStatut
      });

      // Mise à jour de la liste locale des commandes
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, statut: response.data.statut } : order
        )
      );

      // Mise à jour de la commande actuellement ouverte dans la modale si nécessaire
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, statut: response.data.statut }));
      }
    } catch (err) {
      console.error("Erreur lors de la modification du statut :", err);
      alert("Erreur lors de la modification du statut");
    }
  };

  if (loading) {
    return (
      <div className="container text-center my-5 py-5">
        <div className="spinner-border text-primary spinner-border-sm" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2 text-muted small">Chargement des commandes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5 text-center text-danger">
        <h4>{error}</h4>
        <button className="btn btn-outline-primary mt-3" onClick={fetchOrders}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container my-3" style={{ maxWidth: '1100px' }}>
      {/* BANNIÈRE COLIS EN TÊTE DE PAGE */}
      <div className="text-center mb-3">
        <img 
          src={colisBanner} 
          alt="Bannière Commandes Client" 
          className="img-fluid rounded shadow-sm w-100" 
          style={{ maxHeight: '160px', objectFit: 'cover' }}
        />
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-muted">
          Aucune commande trouvée dans la base de données.
        </p>
      ) : (
        <div className="table-responsive">
          {/* Correction : Ajout de table-sm et taille de police réduite (0.85rem) */}
          <table 
            className="table table-striped table-bordered table-sm shadow-sm align-middle text-center"
            style={{ fontSize: '0.85rem' }}
          >
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>N° Bon</th>
                <th>Client</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                <th>Mode Paiement</th>
                <th>Nb. d'articles</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const totalQuantity = order.articles && Array.isArray(order.articles)
                  ? order.articles.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
                  : 0;

                const orderCode = order.bonDeCommande || `BC-${order._id ? order._id.slice(-6) : index}`;
                const isTraitee = order.statut === 'Traitée';

                return (
                  <tr key={order._id || index}>
                    <td>{index + 1}</td>
                    <td>
                      <button 
                        className="btn btn-link fw-bold text-decoration-none p-0"
                        style={{ fontSize: 'inherit' }}
                        onClick={() => setSelectedOrder(order)}
                        title="Cliquer pour voir les détails"
                      >
                        {orderCode}
                      </button>
                    </td>
                    <td className="fw-semibold">{order.client?.nom || 'N/A'}</td>
                    <td>{order.client?.telephone || 'N/A'}</td>
                    <td>{order.client?.adresse || 'N/A'}</td>
                    <td>{order.client?.methodePaiement || 'especes'}</td>
                    <td>
                      <span className="badge bg-primary px-2 py-1" style={{ fontSize: '0.75rem' }}>
                        {totalQuantity}
                      </span>
                    </td>
                    <td><strong>{order.total ? Number(order.total).toFixed(2) : '0.00'} Dt</strong></td>
                    <td>
                      <div className="form-check form-switch d-flex align-items-center justify-content-center gap-1 m-0">
                        <input
                          className="form-check-input my-0"
                          type="checkbox"
                          role="switch"
                          id={`check-${order._id}`}
                          checked={isTraitee}
                          onChange={() => handleCheckboxChange(order._id, order.statut)}
                          style={{ cursor: 'pointer', transform: 'scale(1)' }}
                        />
                        <label 
                          className="form-check-label ms-1" 
                          htmlFor={`check-${order._id}`}
                          style={{ cursor: 'pointer' }}
                        >
                          <span className={`badge ${isTraitee ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {isTraitee ? 'Traitée' : 'En attente'}
                          </span>
                        </label>
                      </div>
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.8rem' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODALE DE DÉTAILS DE LA COMMANDE --- */}
      {selectedOrder && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-dark text-white py-2">
                <h6 className="modal-title mb-0">
                  Détails du Bon de Commande : <span className="text-warning">{selectedOrder.bonDeCommande || 'N/A'}</span>
                </h6>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>

              <div className="modal-body" style={{ fontSize: '0.9rem' }}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-2">Informations Client :</h6>
                    <p className="mb-1"><strong>Nom :</strong> {selectedOrder.client?.nom}</p>
                    <p className="mb-1"><strong>Téléphone :</strong> {selectedOrder.client?.telephone}</p>
                    <p className="mb-1"><strong>Adresse :</strong> {selectedOrder.client?.adresse}</p>
                    <p className="mb-1"><strong>Paiement :</strong> {selectedOrder.client?.methodePaiement}</p>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <p className="mb-1"><strong>Date :</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <p className="mb-1">
                      <strong>Statut : </strong>
                      <span className={`badge ${selectedOrder.statut === 'Traitée' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {selectedOrder.statut === 'Traitée' ? 'Traitée' : 'En attente'}
                      </span>
                    </p>
                  </div>
                </div>

                <h6 className="fw-bold mt-3 mb-2">Articles commandés :</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered text-center align-middle mb-0" style={{ fontSize: '0.85rem' }}>
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Désignation</th>
                        <th>Prix Unitaire</th>
                        <th>Quantité</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.articles && selectedOrder.articles.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item.title || item.nom || 'Produit'}</td>
                          <td>{(item.price || 0).toFixed(2)} Dt</td>
                          <td>{item.quantity || 1}</td>
                          <td>{((item.price || 0) * (item.quantity || 1)).toFixed(2)} Dt</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-end mt-3">
                  <h5 className="fw-bold mb-0">Total Général : {selectedOrder.total?.toFixed(2)} Dt</h5>
                </div>
              </div>

              <div className="modal-footer py-2">
                <button 
                  type="button" 
                  className="btn btn-sm btn-secondary" 
                  onClick={() => setSelectedOrder(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;