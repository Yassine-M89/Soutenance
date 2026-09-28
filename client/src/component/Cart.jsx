import { useDispatch, useSelector } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from '../features/cartSlice';
import '../css/Cart.css';

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);

  if (items.length === 0) {
    return (
      <section className="cart cart--empty">
        <h2 className="cart__title">Panier</h2>
        <p className="cart__empty-message">Votre panier est vide.</p>
      </section>
    );
  }

  return (
    <section className="cart">
      <div className="cart__header">
        <h2 className="cart__title">Panier ({count})</h2>
        <button
          type="button"
          className="cart__clear-button"
          onClick={() => dispatch(clearCart())}
        >
          Vider le panier
        </button>
      </div>

      <ul className="cart__list">
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            <div className="cart-item__info">
              <span className="cart-item__name">{item.name}</span>
              <span className="cart-item__price">{item.price.toFixed(2)} Dt</span>
            </div>

            <div className="cart-item__quantity">
              <button
                type="button"
                className="cart-item__qty-button"
                onClick={() => dispatch(decreaseQuantity({ id: item.id }))}
                aria-label={`Diminuer la quantité de ${item.name}`}
              >
                −
              </button>
              <span className="cart-item__qty-value">{item.quantity}</span>
              <button
                type="button"
                className="cart-item__qty-button"
                onClick={() => dispatch(increaseQuantity({ id: item.id }))}
                aria-label={`Augmenter la quantité de ${item.name}`}
              >
                +
              </button>
            </div>

            <span className="cart-item__subtotal">
              {(item.price * item.quantity).toFixed(2)} Dt
            </span>

            <button
              type="button"
              className="cart-item__remove-button"
              onClick={() => dispatch(removeFromCart({ id: item.id }))}
              aria-label={`Retirer ${item.name} du panier`}
            >
              Retirer
            </button>
          </li>
        ))}
      </ul>

      <div className="cart__footer">
        <span className="cart__total-label">Total</span>
        <span className="cart__total-value">{total.toFixed(2)} Dt</span>
      </div>
    </section>
  );
}

export default Cart;