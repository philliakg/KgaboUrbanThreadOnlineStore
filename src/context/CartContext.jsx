import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const GUEST_CART_KEY = "urbanThreadsGuestCart";

function readGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
}

function mergeCarts(savedItems, guestItems) {
  const merged = [...savedItems];
  for (const guestItem of guestItems) {
    const existing = merged.find(
      (item) => item.productId === guestItem.productId
    );
    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      merged.push(guestItem);
    }
  }
  return merged;
}

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) {
      setItems(readGuestCart());
      return;
    }
    const cartRef = doc(db, "carts", user.uid);
    let unsubscribe;
    let cancelled = false;

    async function connectCart() {
      const guestItems = readGuestCart();
      if (guestItems.length > 0) {
        const snapshot = await getDoc(cartRef);
        const savedItems = snapshot.exists()
          ? snapshot.data().items || []
          : [];
        await setDoc(cartRef, { items: mergeCarts(savedItems, guestItems) });
        localStorage.removeItem(GUEST_CART_KEY);
      }
      if (cancelled) return;
      unsubscribe = onSnapshot(cartRef, (snapshot) => {
        setItems(snapshot.exists() ? snapshot.data().items || [] : []);
      });
    }

    connectCart();

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  function saveCart(newItems) {
    if (user) {
      return setDoc(doc(db, "carts", user.uid), { items: newItems });
    }
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newItems));
    setItems(newItems);
  }

  function addToCart(product) {
    const existing = items.find((item) => item.productId === product.id);
    let newItems;
    if (existing) {
      newItems = items.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [
        ...items,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          imageURL:
            product.imageURL || product.imageUrl || product.imageUrls || "",
          quantity: 1
        }
      ];
    }
    return saveCart(newItems);
  }

  function decreaseQuantity(productId) {
    const existing = items.find((item) => item.productId === productId);
    if (!existing) return;
    let newItems;
    if (existing.quantity <= 1) {
      newItems = items.filter((item) => item.productId !== productId);
    } else {
      newItems = items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    }
    return saveCart(newItems);
  }

  function removeFromCart(productId) {
    const newItems = items.filter((item) => item.productId !== productId);
    return saveCart(newItems);
  }

  function clearCart() {
    return saveCart([]);
  }

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = {
    items,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
