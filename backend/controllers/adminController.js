const pool = require("../config/db");


// TEST API
exports.testAdmin = (req, res) => {
  res.json({ message: "Admin controller working" });
};



// ADMIN DASHBOARD STATS
exports.getAdminStats = async (req, res) => {
  try {

    const users = await pool.query("SELECT COUNT(*) FROM users");
    const products = await pool.query("SELECT COUNT(*) FROM products");
    const orders = await pool.query("SELECT COUNT(*) FROM orders");
    const revenue = await pool.query("SELECT COALESCE(SUM(total),0) FROM orders");

    res.json({
      users: users.rows[0].count,
      products: products.rows[0].count,
      orders: orders.rows[0].count,
      revenue: revenue.rows[0].coalesce
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT id,name,email FROM users ORDER BY id ASC"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM products ORDER BY id ASC"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ADD PRODUCT
exports.addProduct = async (req, res) => {
  try {

    const {
      name,
      category,
      price,
      image,
      image2,
      image3,
      description,
      fabric,
      gsm,
      stock
    } = req.body;

    const result = await pool.query(
      `INSERT INTO products
      (name, category, price, image, image2, image3, description, fabric, gsm, stock)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [name, category, price, image, image2, image3, description, fabric, gsm, stock]
    );

    res.json({
      message: "Product added",
      product: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM products WHERE id=$1",
      [id]
    );

    res.json({ message: "Product deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      name,
      category,
      price,
      image,
      image2,
      image3,
      description,
      fabric,
      gsm,
      stock
    } = req.body;

    const result = await pool.query(
      `UPDATE products
      SET name=$1,
      category=$2,
      price=$3,
      image=$4,
      image2=$5,
      image3=$6,
      description=$7,
      fabric=$8,
      gsm=$9,
      stock=$10
      WHERE id=$11
      RETURNING *`,
      [name, category, price, image, image2, image3, description, fabric, gsm, stock, id]
    );

    res.json({
      message: "Product updated",
      product: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT 
      o.id,
      o.total,
      o.status,
      o.payment_id,
      o.created_at,
      u.name as user_name,
      u.email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      `
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    await pool.query(
      "UPDATE orders SET status=$1 WHERE id=$2",
      [status, id]
    );

    res.json({ message: "Order status updated" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// PAYMENT HISTORY
exports.getPayments = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM payments ORDER BY created_at DESC"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};