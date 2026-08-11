import { useState } from "react";
import { Link } from "react-router-dom";
import { seedProducts } from "../services/seedProducts";
import "../css/Seed.css";

function Seed() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleSeed() {
    setStatus("working");
    setMessage("Adding sample products to Firestore...");
    try {
      const result = await seedProducts();
      if (result.skipped) {
        setStatus("done");
        setMessage("Products already exist in Firestore, nothing was added.");
      } else {
        setStatus("done");
        setMessage(`Added ${result.added} sample products to Firestore.`);
      }
    } catch (err) {
      setStatus("error");
      setMessage(`Failed to seed products: ${err.message}`);
    }
  }

  return (
    <div className="seed-page">
      <div className="seed-card">
        <h1>Load Sample Products</h1>
        <p>
          This helper page fills your Firestore <code>products</code> collection
          with 12 sample streetwear products. It only runs if the collection is
          empty, so it is safe to click once.
        </p>
        <button
          type="button"
          className="seed-btn"
          onClick={handleSeed}
          disabled={status === "working"}
        >
          {status === "working" ? "Working..." : "Seed Products"}
        </button>
        {message && <p className={`seed-message ${status}`}>{message}</p>}
        {status === "done" && (
          <Link to="/shop" className="seed-link">
            Go to the Shop →
          </Link>
        )}
      </div>
    </div>
  );
}

export default Seed;
