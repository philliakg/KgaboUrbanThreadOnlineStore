import { Link } from "react-router-dom";
import "../css/Home.css";

const categories = [
  { name: "Hoodies", tagline: "Oversized comfort, everyday flex" },
  { name: "T-Shirts", tagline: "Heavyweight tees, bold prints" },
  { name: "Sneakers", tagline: "Retro courts to chunky runners" },
  { name: "Accessories", tagline: "Finish the fit" }
];

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <p className="hero-kicker">New Season Drop</p>
        <h1>
          Streetwear for the <span>bold.</span>
        </h1>
        <p className="hero-text">
          Urban Threads is casual streetwear made for young adults who set the
          trend instead of following it. Hoodies, tees, sneakers and more —
          straight from the source.
        </p>
        <Link to="/shop" className="hero-cta">
          Shop the Collection
        </Link>
      </section>

      <section className="category-section">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="category-card"
            >
              <h3>{category.name}</h3>
              <p>{category.tagline}</p>
              <span className="category-link">Browse →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="perks">
        <div className="perk">
          <h3>Free Shipping</h3>
          <p>On all orders over $75.</p>
        </div>
        <div className="perk">
          <h3>Easy Returns</h3>
          <p>30 days, no questions asked.</p>
        </div>
        <div className="perk">
          <h3>Fresh Drops</h3>
          <p>New styles added every week.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
