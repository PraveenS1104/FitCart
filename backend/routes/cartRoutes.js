const express = require("express");
const pool = require("../config/db");

const router = express.Router();




router.post("/add", async (req, res) => {
   console.log("ADD CART BODY:", req.body); 
  try {

    const { userId, productId, name, price, image, category } = req.body;

    const check = await pool.query(
      "SELECT * FROM cart WHERE user_id=$1 AND product_id=$2",
      [userId, productId]
    );

    if (check.rows.length > 0) {

      await pool.query(
        "UPDATE cart SET quantity = quantity + 1 WHERE user_id=$1 AND product_id=$2",
        [userId, productId]
      );

    } else {

      await pool.query(
        `INSERT INTO cart(user_id,product_id,name,price,image,category,quantity)
         VALUES($1,$2,$3,$4,$5,$6,1)`,
        [userId, productId, name, price, image, category]
      );

    }

    res.json({ message: "Added to cart" });

  } catch (err) {

    console.error("ADD CART ERROR:", err);
    res.status(500).json({ error: "Cart error" });

  }

});



router.get("/:userId", async (req, res) => {

  try {

    const { userId } = req.params;

    const result = await pool.query(
      `SELECT 
        id,
        product_id,
        name,
        price,
        image,
        category,
        quantity
      FROM cart
      WHERE user_id=$1
      ORDER BY id DESC`,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {

    console.error("FETCH CART ERROR:", err);
    res.status(500).json({ error: "Fetch error" });

  }

});




router.put("/update", async (req, res) => {

  try {

    const { id, type } = req.body;

    if (type === "inc") {

      await pool.query(
        "UPDATE cart SET quantity = quantity + 1 WHERE id=$1",
        [id]
      );

    }

    if (type === "dec") {

      await pool.query(
        "UPDATE cart SET quantity = quantity - 1 WHERE id=$1 AND quantity > 1",
        [id]
      );

    }

    res.json({ message: "Quantity updated" });

  } catch (err) {

    console.error("UPDATE CART ERROR:", err);
    res.status(500).json({ error: "Update error" });

  }

});




router.delete("/remove/:id", async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM cart WHERE id=$1",
      [id]
    );

    res.json({ message: "Item removed" });

  } catch (err) {

    console.error("REMOVE CART ERROR:", err);
    res.status(500).json({ error: "Delete error" });

  }

});


module.exports = router;