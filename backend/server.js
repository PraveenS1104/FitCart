require("dotenv").config();
const express = require("express");
const cors = require("cors");

const pool = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const recommendationRoutes = require("./routes/recommendationRoutes");
const sizeRoutes = require("./routes/sizePredictionRoutes");
const comfortRoutes = require("./routes/comfortScoreRoutes");
const trendingRoutes = require("./routes/trendingRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// HEALTH CHECK
app.get("/health", (req, res) => res.json({ status: "ok" }));


// GET ALL PRODUCTS
app.get("/api/products", async (req,res)=>{

  try{

    const result = await pool.query(
      "SELECT * FROM products ORDER BY id"
    );

    res.json(result.rows);

  }catch(err){

    console.error("PRODUCT FETCH ERROR:",err);
    res.status(500).json({error:err.message});

  }

});


// ROUTES
app.use("/api/auth",authRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recommend",recommendationRoutes);
app.use("/api/size",sizeRoutes);
app.use("/api/comfort",comfortRoutes);
app.use("/api/trending", trendingRoutes);

app.listen(PORT,()=>{

  console.log("Backend running on port ");

});
