const express = require("express");
const pool = require("../config/db");

const router = express.Router();


router.post("/", async (req, res) => {
  try {

    const { userId, productName, rating, comment } = req.body;

    await pool.query(
      "INSERT INTO reviews(user_id, product_name, rating, comment) VALUES($1,$2,$3,$4)",
      [userId, productName, rating, comment]
    );

    res.json({ message: "Review added successfully" });

  } catch (err) {
    console.error("REVIEW ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});



router.get("/:productName", async (req, res) => {
  try {

    const { productName } = req.params;

    const result = await pool.query(
      "SELECT * FROM reviews WHERE product_name=$1 ORDER BY created_at DESC",
      [productName]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: "Fetch reviews failed" });
  }
});

router.get("/check/:userId/:productName", async (req, res) => {
  try {

    const { userId, productName } = req.params;

    const result = await pool.query(`
      SELECT oi.id
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.user_id = $1
      AND oi.product_name = $2
    `, [userId, productName]);

    if (result.rows.length > 0) {
      return res.json({ bought: true });
    }

    res.json({ bought: false });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
