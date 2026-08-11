import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import "../css/Shop.css";

const categories = ["All", "Hoodies", "T-Shirts", "Sneakers", "Accessories"];

function Shop() {
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  const activeCategory = searchParams.get("category") || "All";

  function handleCategoryChange(category) {
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="shop">
      <div className="shop-header">
        <h1>Shop All</h1>
        <input
          type="search"
          className="shop-search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              category === activeCategory ? "filter-btn active" : "filter-btn"
            }
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading && <p className="shop-message">Loading products...</p>}
      {error && <p className="shop-message error">{error}</p>}
      {!loading && !error && filteredProducts.length === 0 && (
        <p className="shop-message">
          No products found. If the store is empty, visit the /seed page to load
          sample products.
        </p>
      )}

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Shop;
