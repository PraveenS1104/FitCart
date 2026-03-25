import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "./Home.css";

function Home() {

const [recommend, setRecommend] = useState([]);
const [trending, setTrending] = useState([]);
const [loading, setLoading] = useState(true);

const user = JSON.parse(localStorage.getItem("user") || "null");

useEffect(() => {


async function loadData(){

  try{

    // 🔥 Trending products
    const trendingRes = await fetch(
      "http://localhost:5000/api/trending"
    );

    const trendingData = await trendingRes.json();

    setTrending(trendingData);


    // 🎯 Personalized recommendations
    if(user){

      const recRes = await fetch(
        `http://localhost:5000/api/recommend/${user.id}`
      );

      const recData = await recRes.json();

      setRecommend(recData);

    }

  }catch(err){

    console.error("Home API error:",err);

  }

  setLoading(false);

}

loadData();


}, [user]);

return (


<div className="home-container">

  {/* HERO BANNER */}
  <div className="hero-banner">

    <img
      src="https://res.cloudinary.com/dpihpt1mi/image/upload/v1773635811/home-hero_htx1hi.png"
      alt="shopping banner"
      className="hero-bg"
    />

    <div className="hero-overlay"></div>

  </div>


  {/* FEATURES */}
  <div className="features-grid">

    <div className="feature-card">
      <img src="https://res.cloudinary.com/dpihpt1mi/image/upload/v1773635667/delivery_xyqs6f.png" className="feature-icon-img"/>
      <h3>Fast Delivery</h3>
      <p>Get your products delivered within 2-3 days</p>
    </div>

    <div className="feature-card">
      <img src="https://res.cloudinary.com/dpihpt1mi/image/upload/v1773635635/payment_wzjixc.png" className="feature-icon-img"/>
      <h3>Secure Payment</h3>
      <p>100% secure checkout</p>
    </div>

    <div className="feature-card">
      <img src="https://res.cloudinary.com/dpihpt1mi/image/upload/v1773635721/returns_hxkai0.png" className="feature-icon-img"/>
      <h3>Easy Returns</h3>
      <p>30-day return policy</p>
    </div>

    <div className="feature-card">
      <img src="https://res.cloudinary.com/dpihpt1mi/image/upload/v1773635828/quality_mykkdr.png" className="feature-icon-img"/>
      <h3>Best Quality</h3>
      <p>Premium quality checked products</p>
    </div>

  </div>


  {/* 🔥 TRENDING PRODUCTS */}

  {!loading && trending.length > 0 && (

    <div className="recommended-section">

      <div className="section-header">
        <h2>Trending Products 🔥</h2>

        <p className="section-subtitle">
          Most popular products right now
        </p>
      </div>

      <div className="products-grid">

        {trending.map(product => (

          <ProductCard
            key={product.id}
            product={product}
          />

        ))}

      </div>

    </div>

  )}


  {/* 🎯 RECOMMENDED PRODUCTS */}

  {user && !loading && recommend.length > 0 && (

    <div className="recommended-section">

      <div className="section-header">
        <h2>Recommended For You</h2>

        <p className="section-subtitle">
          Personalized picks based on your purchase history
        </p>
      </div>

      <div className="products-grid">

        {recommend.map(product => (

          <ProductCard
            key={product.id}
            product={product}
          />

        ))}

      </div>

    </div>

  )}


  {/* NO RECOMMENDATIONS */}

  {user && !loading && recommend.length === 0 && (

    <div className="recommended-section">

      <h2>Recommended For You</h2>
      <p>No recommendations yet. Start shopping!</p>

    </div>

  )}


  {/* CATEGORIES */}

  <div className="categories-section">

    <h2>Shop by Category</h2>

    <div className="categories-grid">

      <div className="category-card">
        <img src="https://res.cloudinary.com/dpihpt1mi/image/upload/v1773635716/electronics_ezng1e.png"/>
        <h3>Electronics</h3>
        <p>Smartphones, Laptops & more</p>
      </div>

      <div className="category-card">
        <img src="https://res.cloudinary.com/dpihpt1mi/image/upload/v1773635777/fashion_rhyqbh.png"/>
        <h3>Fashion</h3>
        <p>Clothing, Shoes & Accessories</p>
      </div>

      <div className="category-card">
        <img src="https://res.cloudinary.com/dpihpt1mi/image/upload/v1773635762/home_tjmgej.png"/>
        <h3>Home & Living</h3>
        <p>Furniture & Decor</p>
      </div>

      <div className="category-card">
        <img src="https://res.cloudinary.com/dpihpt1mi/image/upload/v1773635840/sports_dlk0j0.png"/>
        <h3>Sports & Fitness</h3>
        <p>Equipment & Activewear</p>
      </div>

    </div>

  </div>


  {/* PROMO BANNER */}

  <div className="promo-banner">

    <div className="promo-content">

      <h2>Summer Sale is Live 🎉</h2>
      <p>Up to 50% off on selected items</p>

      <button className="promo-btn">
        Shop Now
      </button>

    </div>

    <img
      src="https://res.cloudinary.com/dpihpt1mi/image/upload/v1773635674/sale-banner_jujj9f.png"
      className="promo-image"
    />

  </div>


  {/* LOGIN CTA */}

  {!user && (

    <div className="login-cta">

      <div className="login-content">

        <h3>Unlock Personalized Experience 🔓</h3>

        <p>
          Login to see recommendations, track orders,
          and get exclusive offers
        </p>

        <a href="/login" className="login-btn">
          Sign In / Register
        </a>

      </div>

      <img
        src="/images/illustrations/login-shopping.png"
        className="login-image"
      />

    </div>

  )}


  {/* TESTIMONIALS */}

  <div className="testimonials-section">

    <h2>What Our Customers Say</h2>

    <div className="testimonials-grid">

      <div className="testimonial-card">

        <div className="testimonial-rating">
          ★★★★★
        </div>

        <p className="testimonial-text">
          Amazing products and fast delivery!
        </p>

        <div className="testimonial-author">

          <div className="author-avatar">
            RK
          </div>

          <div className="author-info">
            <h4>Raj Kumar</h4>
            <p>Verified Buyer</p>
          </div>

        </div>

      </div>

    </div>

  </div>

</div>


);

}

export default Home;
