import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import "../css/Account.css";

function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(ordersQuery);
        const list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        list.sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );
        setOrders(list);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  function formatDate(timestamp) {
    if (!timestamp?.seconds) return "Just now";
    return new Date(timestamp.seconds * 1000).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  return (
    <div className="account">
      <h1>My Account</h1>

      <section className="account-card">
        <h2>Profile</h2>
        <div className="account-row">
          <span className="account-label">Name</span>
          <span>{user.displayName || "—"}</span>
        </div>
        <div className="account-row">
          <span className="account-label">Email</span>
          <span>{user.email}</span>
        </div>
        <button type="button" className="account-logout" onClick={handleLogout}>
          Logout
        </button>
      </section>

      <section className="account-card">
        <h2>Order History</h2>
        {loading && <p className="account-message">Loading orders...</p>}
        {!loading && orders.length === 0 && (
          <p className="account-message">
            No orders yet. <Link to="/shop">Start shopping →</Link>
          </p>
        )}
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id} className="order-item">
              <div className="order-header">
                <span className="order-date">{formatDate(order.createdAt)}</span>
                <span className="order-total">${order.total.toFixed(2)}</span>
              </div>
              <ul className="order-lines">
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.quantity} × {item.name}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Account;
