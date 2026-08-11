import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../css/Cart.css";

function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    items,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartTotal
  } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  async function handleCheckout() {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    setPlacingOrder(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        email: user.email,
        items,
        total: cartTotal,
        createdAt: serverTimestamp()
      });
      await clearCart();
      setOrderPlaced(true);
    } finally {
      setPlacingOrder(false);
    }
  }

  if (orderPlaced) {
    return (
      <div className="cart">
        <div className="cart-empty">
          <h1>Order placed! 🎉</h1>
          <p>Thanks for shopping with Urban Threads.</p>
          <Link to="/shop" className="cart-shop-link">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart">
        <div className="cart-empty">
          <h1>Your cart is empty</h1>
          <p>Go find something you love.</p>
          <Link to="/shop" className="cart-shop-link">
            Browse the Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>Your Cart</h1>
      <div className="cart-layout">
        <ul className="cart-items">
          {items.map((item) => (
            <li key={item.productId} className="cart-item">
              <img
                src={item.imageURL || item.imageUrl || item.imageUrls || ""}
                alt={item.name}
              />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">${item.price.toFixed(2)} each</p>
                <div className="quantity-controls">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.productId)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      addToCart({ id: item.productId, ...item })
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item-right">
                <span className="cart-item-subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  type="button"
                  className="cart-remove"
                  onClick={() => removeFromCart(item.productId)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{cartTotal >= 75 ? "Free" : "$5.99"}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>
              ${(cartTotal >= 75 ? cartTotal : cartTotal + 5.99).toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={placingOrder}
          >
            {placingOrder
              ? "Placing order..."
              : user
                ? "Checkout"
                : "Log in to Checkout"}
          </button>
          {!user && (
            <p className="cart-login-hint">
              You can shop as a guest — you only need an account to place the
              order.
            </p>
          )}
          <button type="button" className="clear-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
