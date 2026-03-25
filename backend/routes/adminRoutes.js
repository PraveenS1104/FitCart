const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const verifyAdmin = require("../middleware/adminAuth");


// DASHBOARD
router.get("/stats", verifyAdmin, adminController.getAdminStats);


// USERS
router.get("/users", verifyAdmin, adminController.getAllUsers);


// PRODUCTS
router.get("/products", verifyAdmin, adminController.getAllProducts);
router.post("/products", verifyAdmin, adminController.addProduct);
router.put("/products/:id", verifyAdmin, adminController.updateProduct);
router.delete("/products/:id", verifyAdmin, adminController.deleteProduct);


// ORDERS
router.get("/orders", verifyAdmin, adminController.getAllOrders);
router.put("/orders/:id/status", verifyAdmin, adminController.updateOrderStatus);


// PAYMENTS
router.get("/payments", verifyAdmin, adminController.getPayments);


module.exports = router;