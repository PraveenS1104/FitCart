const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const checkUser = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const insertResult = await pool.query(
      "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING id",
      [name, email, hashed]
    );

    res.status(201).json({ message: "Registered Successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// LOGIN
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }

});


// SAVE PREFERENCES
router.post("/preferences", async (req, res) => {

  try {

    const { userId, preferences } = req.body;

    await pool.query(
      "UPDATE users SET preferences=$1 WHERE id=$2",
      [preferences, userId]
    );

    res.json({ message: "Preferences saved" });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});


// GET PREFERENCES
router.get("/preferences/:userId", async (req, res) => {

  try {

    const { userId } = req.params;

    const result = await pool.query(
      "SELECT preferences FROM users WHERE id=$1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({ preferences: "" });
    }

    res.json({
      preferences: result.rows[0].preferences || ""
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});

module.exports = router;