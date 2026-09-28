import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { selectCartItems, clearCart } from '../features/cartSlice';

function OrderForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const cartItems = useSelector(selectCartItems) ?? [];
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  const [formData, setFormData] = useState({
    nom: 'YASSINE MECHERGUI',
    adresse: 'Soliman',
    telephone: '29483952',
    methodePaiement: 'especes'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      client: {
        nom: formData.nom,
        adresse: formData.adresse,
        telephone: formData.telephone,
        methodePaiement: formData.methodePaiement
      },
      articles: cartItems,
      total: totalAmount
    };

    try {
      // Appel à l'API sur le port 3000
      await axios.post('http://localhost:3000/api/orders', orderData);

      alert("Commande enregistrée avec succès !");

      // Vider le panier
      if (typeof clearCart === 'function') {
        dispatch(clearCart());
      }

      // Redirection vers la boutique
      navigate('/boutique');
    } catch (error) {
      console.error("Erreur d'enregistrement :", error);
      alert("Une erreur est survenue lors de l'enregistrement de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-4">Passer la Commande</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nom et Prénom</label>
            <input 
              type="text" 
              className="form-control" 
              name="nom" 
              value={formData.nom} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Adresse de livraison</label>
            <textarea 
              className="form-control" 
              name="adresse" 
              rows="3" 
              value={formData.adresse} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Numéro de téléphone</label>
            <input 
              type="tel" 
              className="form-control" 
              name="telephone" 
              value={formData.telephone} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Mode de paiement</label>
            <select 
              className="form-select" 
              name="methodePaiement" 
              value={formData.methodePaiement} 
              onChange={handleChange}
            >
              <option value="especes">Paiement à la livraison</option>
              <option value="carte">Carte bancaire</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-success w-100 py-2"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? "Enregistrement en cours..." 
              : `Confirmer la commande (${totalAmount.toFixed(2)} Dt)`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrderForm;