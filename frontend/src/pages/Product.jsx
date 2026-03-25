import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "./Product.css";

function Product() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    setIsLoading(true);

    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {

        setProducts(data);
        setIsLoading(false);

        const uniqueCategories = [
          "all",
          ...new Set(data.map(product => product.category).filter(Boolean))
        ];

        setCategories(uniqueCategories);

      })
      .catch((err) => {

        console.log(err);
        setIsLoading(false);

      });

  }, []);


  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
        product => product.category === selectedCategory
      );


  const sortedProducts = [...filteredProducts].sort((a, b) => {

    switch (sortBy) {

      case "price-low":
        return a.price - b.price;

      case "price-high":
        return b.price - a.price;

      case "rating":
        return (b.rating || 0) - (a.rating || 0);

      default:
        return 0;

    }

  });


  const priceFilteredProducts = sortedProducts.filter(

    product =>
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]

  );


  return (

    <div className="products-page">

      {/* HERO BANNER */}

      <div className="products-hero">

        <img
          src="https://res.cloudinary.com/dpihpt1mi/image/upload/v1773635766/products-hero_lx54jc.png"
          alt="Products Banner"
          className="products-hero-bg"
        />

        <div className="products-hero-overlay">

          <div className="hero-content">



            <div className="hero-stats">



            </div>

          </div>

        </div>

      </div>


      {/* FILTER CONTROLS */}

      <div className="products-controls">

        <div className="controls-container">


          {/* CATEGORY FILTER */}

          <div className="filter-section">

            <h3 className="filter-title">
              Categories
            </h3>

            <div className="category-tags">

              {categories.map(category => (

                <button
                  key={category}
                  className={`category-tag ${selectedCategory === category
                      ? "active"
                      : ""
                    }`}
                  onClick={() => setSelectedCategory(category)}
                >

                  {category === "all"
                    ? "All Products"
                    : category}

                  {category !== "all" && (

                    <span className="category-count">
                      {
                        products.filter(
                          p => p.category === category
                        ).length
                      }
                    </span>

                  )}

                </button>

              ))}

            </div>

          </div>


          {/* SORT OPTIONS */}

          <div className="filter-section">

            <h3 className="filter-title">
              Sort By
            </h3>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >

              <option value="featured">
                Featured
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="rating">
                Top Rated
              </option>

              <option value="newest">
                Newest First
              </option>

            </select>

          </div>


          {/* PRICE FILTER */}

          <div className="filter-section">

            <h3 className="filter-title">
              Price Range
            </h3>

            <div className="price-range">

              <div className="range-values">

                <span>
                  ₹{priceRange[0]}
                </span>

                <span>
                  ₹{priceRange[1]}
                </span>

              </div>

              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                className="range-slider"
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    parseInt(e.target.value)
                  ])
                }
              />

            </div>

          </div>

        </div>

      </div>


      {/* PRODUCTS GRID */}

      <div className="products-container">

        <div className="products-header">

          <h2 className="products-title">

            {selectedCategory === "all"
              ? "All Products"
              : selectedCategory}

            <span className="products-count">

              ({priceFilteredProducts.length}
              products)

            </span>

          </h2>

        </div>


        {isLoading ? (

          <div className="products-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading amazing products...
            </p>

          </div>

        ) : priceFilteredProducts.length === 0 ? (

          <div className="no-products">

            <h3>No Products Found</h3>

            <p>
              Try adjusting your filters
            </p>

            <button
              className="reset-filters-btn"
              onClick={() => {

                setSelectedCategory("all");
                setPriceRange([0, 10000]);
                setSortBy("featured");

              }}
            >
              Reset Filters
            </button>

          </div>

        ) : (

          <div className="products-grid">

            {priceFilteredProducts.map(item => (

              <ProductCard
                key={item.id}
                product={item}
              />

            ))}

          </div>

        )}

      </div>


    </div>

  );

}

export default Product;