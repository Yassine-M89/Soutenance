import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  addToCart, 
  removeFromCart, 
  selectCartItems 
} from '../features/cartSlice';
import '../css/ProductList.css';

// Importation des images depuis le dossier src/assets/
import pcImg from '../assets/laptop.jpg';
import sourisImg from '../assets/souris.jpg';
import clavierImg from '../assets/clavier.jpg';
import ecranImg from '../assets/ecran.jpg';
import smartphoneImg from '../assets/smartphone.jpg';
import casqueImg from '../assets/casque.jpg';
import chargeurImg from '../assets/chargeur.jpg';

const PRODUCTS = [
  { id: 1, name: "PC Portable", price: 2500, image: pcImg },
  { id: 2, name: "Souris", price: 30, image: sourisImg },
  { id: 3, name: "Clavier", price: 80, image: clavierImg },
  { id: 4, name: "Écran", price: 300, image: ecranImg },
  { id: 5, name: "Smartphone", price: 800, image: smartphoneImg },
  { id: 6, name: "Casque Bluetooth", price: 120, image: casqueImg },
  { id: 7, name: "Chargeur", price: 25, image: chargeurImg }
];

function ProductList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems) ?? [];
  
  // Calcul du prix total
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1), 
    0
  );

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const getQuantityInCart = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const handleCommander = () => {
    navigate('/commander');
  };

  return (
    <div className="container my-4">
      {/* 1. SECTION LISTE DES PRODUITS */}
      <section className="product-list mb-5">
        <h2 className="product-list__title text-center mb-4">Nos Produits</h2>

        {/* Grille Bootstrap : 4 colonnes sur les écrans moyens et grands (row-cols-md-4) */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4 justify-content-center">
          {PRODUCTS.map((product) => {
            const quantityInCart = getQuantityInCart(product.id);

            return (
              <div key={product.id} className="col">
                <article className="product-card h-100 shadow-sm border rounded p-3 text-center d-flex flex-column justify-content-between">
                  {/* Image du produit */}
                  <div className="product-card__image-container mb-3" style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="img-fluid" 
                      style={{ maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <div className="product-card__body mb-3">
                    <h3 className="product-card__name h5">{product.name}</h3>
                    <p className="product-card__price fw-bold text-primary mb-0">{product.price.toFixed(2)} Dt</p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={() => handleAddToCart(product)}
                  >
                    {quantityInCart > 0
                      ? `Ajouter (${quantityInCart})`
                      : 'Ajouter au panier'}
                  </button>
                </article>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. SECTION PANIER */}
      <section className="cart-section p-4 bg-white rounded shadow-sm">
        <h2 className="text-center mb-4">🛒 Votre Panier</h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-muted">Votre panier est vide pour le moment.</p>
        ) : (
          <div className="cart-content">
            <div className="table-responsive">
              <table className="table align-middle text-center">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Produit</th>
                    <th>Prix unitaire</th>
                    <th>Quantité</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            style={{ width: '50px', height: '50px', objectFit: 'contain' }} 
                          />
                        )}
                      </td>
                      <td className="fw-semibold">{item.name || item.title}</td>
                      <td>{(item.price || 0).toFixed(2)} Dt</td>
                      <td>{item.quantity || 1}</td>
                      <td>{((item.price || 0) * (item.quantity || 1)).toFixed(2)} Dt</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <h4>Total du panier : <strong>{totalAmount.toFixed(2)} Dt</strong></h4>
              <button 
                className="btn btn-success btn-lg"
                onClick={handleCommander}
              >
                Commander
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductList;