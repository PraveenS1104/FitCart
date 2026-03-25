import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {

  const [isLoading, setIsLoading] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));



  async function addToCart(e) {

    e.stopPropagation();

    if (!user) {

      toast.error("Please login first 🔒");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);

      return;
    }

    setIsLoading(true);

    try {

      const res = await fetch("http://localhost:5000/api/cart/add", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

     body: JSON.stringify({
  userId: user.id,
  productId: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  category: product.category
})  ,

      });

      const data = await res.json();

      if (!res.ok) {

        toast.error(data.error || "Failed to add to cart ❌");
        return;

      }

      toast.success("Added to cart successfully 🛒");

      setIsInCart(true);

      setTimeout(() => {
        setIsInCart(false);
      }, 3000);

    } catch (err) {

      console.error(err);
      toast.error("Server error");

    } finally {

      setIsLoading(false);

    }

  }



  function handleQuickView(e) {

    e.stopPropagation();
    setShowQuickView(true);

  }



  function formatPrice(price) {

    return new Intl.NumberFormat("en-IN", {

      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,

    }).format(price);

  }



  return (

    <div className="product-card">

      {/* PRODUCT IMAGE */}

      <div className="product-image-container">

        <img
          src={product.image || "/images/products/default-product.png"}
          alt={product.name}
          className="product-image"
        />



        {/* BADGES */}

        <div className="product-badges">

          {product.isNew && (
            <span className="badge new-badge">New</span>
          )}

          {product.discount > 0 && (
            <span className="badge discount-badge">
              -{product.discount}%
            </span>
          )}

          {product.isBestSeller && (
            <span className="badge bestseller-badge">
              Bestseller
            </span>
          )}

        </div>



        {/* QUICK ACTIONS */}

        <div className="quick-actions">

          <button
            className="quick-action-btn"
            onClick={handleQuickView}
          >
            <i className="fas fa-eye"></i>
          </button>

        </div>



        {/* STOCK STATUS */}

        {product.stock === 0 && (

          <div className="stock-indicator out-of-stock">
            Out of stock
          </div>

        )}

      </div>



      {/* PRODUCT INFO */}

      <div className="product-info">

        {/* CATEGORY */}

        <div className="product-category">

          {product.category || "Category"}

        </div>



        {/* PRODUCT NAME */}

        <Link
          to={`/product/${product.id}`}
          className="product-name-link"
        >

          <h3 className="product-name">

            {product.name}

          </h3>

        </Link>



        {/* DESCRIPTION */}

        <p className="product-description">

          {product.description || "Premium quality product"}

        </p>



        {/* RATING */}

        <div className="product-rating-section">

          <div className="rating-stars">

            {[...Array(5)].map((_, i) => (

              <i
                key={i}
                className={`fas fa-star ${
                  i < Math.floor(product.rating || 4)
                    ? "filled"
                    : ""
                }`}
              ></i>

            ))}

            <span className="rating-value">

              {product.rating?.toFixed(1) || "4.0"}

            </span>

          </div>

          <div className="review-count">

            ({product.reviewCount || 24} reviews)

          </div>

        </div>



        {/* PRICE */}

        <div className="price-section">

          <div className="current-price">

            {formatPrice(product.price)}

          </div>

          {product.originalPrice && (

            <div className="original-price">

              {formatPrice(product.originalPrice)}

            </div>

          )}

        </div>



        {/* FEATURES */}

        <ul className="product-features">

          {product.features?.slice(0, 3).map((f, i) => (

            <li key={i} className="feature-item">

              <i className="fas fa-check-circle"></i>
              {f}

            </li>

          ))}

        </ul>



        {/* ACTION BUTTONS */}

        <div className="action-buttons">

          <button
            onClick={addToCart}
            disabled={isLoading || product.stock === 0}
            className="add-to-cart-btn"
          >

            {isLoading
              ? "Adding..."
              : isInCart
              ? "Added"
              : product.stock === 0
              ? "Out of stock"
              : "Add to Cart"}

          </button>



          <Link
            to={`/product/${product.id}`}
            className="view-details-btn"
          >

            Details

          </Link>

        </div>



        {/* EXTRA INFO */}

        <div className="additional-info">

          <div className="info-item">

            <i className="fas fa-truck"></i>
            Free Shipping

          </div>

          <div className="info-item">

            <i className="fas fa-undo"></i>
            30 Day Return

          </div>

          <div className="info-item">

            <i className="fas fa-shield-alt"></i>
            Warranty

          </div>

        </div>

      </div>



      {/* QUICK VIEW MODAL */}

      {showQuickView && (

        <div className="quick-view-modal">

          <div
            className="quick-view-overlay"
            onClick={() => setShowQuickView(false)}
          ></div>

          <div className="quick-view-content">

            <button
              className="close-quick-view"
              onClick={() => setShowQuickView(false)}
            >

              ✕

            </button>



            <div className="quick-view-body">

              <img
                src={product.image}
                alt={product.name}
                className="quick-view-image"
              />

              <div className="quick-view-details">

                <h3>{product.name}</h3>

                <p>{product.description}</p>

                <button
                  onClick={addToCart}
                  className="quick-view-cart-btn"
                >

                  Add to Cart

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default ProductCard;