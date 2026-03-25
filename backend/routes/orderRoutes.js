const express = require("express");
const pool = require("../config/db");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");

const router = express.Router();

const razorpay = new Razorpay({
key_id: process.env.RAZORPAY_KEY,
key_secret: process.env.RAZORPAY_SECRET
});

// CREATE PAYMENT ORDER
router.post("/create-payment", async (req,res)=>{

try{

const {userId} = req.body;

const cart = await pool.query(
"SELECT * FROM cart WHERE user_id=$1",
[userId]
);

if(cart.rows.length===0){
return res.status(400).json({error:"Cart empty"});
}

let subtotal = 0;

cart.rows.forEach(item=>{
subtotal += item.price * item.quantity;
});

const shipping = subtotal > 1000 ? 0 : 99;
const tax = subtotal * 0.18;
const total = subtotal + shipping + tax;

const paymentOrder = await razorpay.orders.create({
amount: Math.round(total * 100),
currency:"INR",
receipt:`receipt_${Date.now()}`
});

res.json({
orderId:paymentOrder.id,
amount:paymentOrder.amount,
currency:paymentOrder.currency
});

}catch(err){

console.error(err);
res.status(500).json({error:err.message});

}

});

// VERIFY PAYMENT
router.post("/verify-payment", async (req,res)=>{

try{

const {
razorpay_order_id,
razorpay_payment_id,
razorpay_signature,
userId
} = req.body;

const body = razorpay_order_id + "|" + razorpay_payment_id;

const expected = crypto
.createHmac("sha256",process.env.RAZORPAY_SECRET)
.update(body)
.digest("hex");

if(expected !== razorpay_signature){
return res.status(400).json({error:"Payment verification failed"});
}

const cart = await pool.query(
"SELECT * FROM cart WHERE user_id=$1",
[userId]
);

let subtotal = 0;

cart.rows.forEach(item=>{
subtotal += item.price * item.quantity;
});

const shipping = subtotal > 1000 ? 0 : 99;
const tax = subtotal * 0.18;
const total = subtotal + shipping + tax;

const order = await pool.query(
"INSERT INTO orders(user_id,total) VALUES($1,$2) RETURNING id",
[userId,total]
);

const orderId = order.rows[0].id;

for(let item of cart.rows){

await pool.query(
"INSERT INTO order_items(order_id,product_name,price,quantity) VALUES($1,$2,$3,$4)",
[orderId,item.name,item.price,item.quantity]
);

}

await pool.query(
"DELETE FROM cart WHERE user_id=$1",
[userId]
);

res.json({message:"Payment successful"});

}catch(err){

console.error(err);
res.status(500).json({error:err.message});

}

});

// GET USER ORDERS
router.get("/:userId", async (req,res)=>{

try{

const {userId} = req.params;

const ordersResult = await pool.query(
"SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC",
[userId]
);

const orders = ordersResult.rows;

// Fetch items for each order and append them
for (let order of orders) {
  const itemsResult = await pool.query(
    `SELECT oi.*, p.image 
     FROM order_items oi 
     LEFT JOIN products p ON oi.product_name = p.name 
     WHERE oi.order_id=$1`,
    [order.id]
  );
  
  order.items = itemsResult.rows.map(item => ({
    name: item.product_name,
    price: item.price,
    quantity: item.quantity,
    image: item.image
  }));
  
  order.items_count = order.items.reduce((sum, item) => sum + item.quantity, 0);
}

res.json(orders);

}catch(err){

console.error("Orders Error:", err);
res.status(500).json({error:err.message});

}

});

// INVOICE
router.get("/invoice/:orderId", async (req,res)=>{

try{

const {orderId} = req.params;

const order = await pool.query(
"SELECT * FROM orders WHERE id=$1",
[orderId]
);

const items = await pool.query(
"SELECT * FROM order_items WHERE order_id=$1",
[orderId]
);

const doc = new PDFDocument();

res.setHeader(
"Content-Disposition",
`attachment; filename=invoice_${orderId}.pdf`
);

res.setHeader("Content-Type","application/pdf");

doc.pipe(res);

doc.fontSize(22).text("SmartShop Invoice",{align:"center"});
doc.moveDown();

doc.fontSize(12).text(`Order ID: ${orderId}`);
doc.text(`Date: ${new Date(order.rows[0].created_at).toLocaleString()}`);

doc.moveDown();

items.rows.forEach((item,i)=>{

doc.text(
`${i+1}. ${item.product_name} | ₹${item.price} × ${item.quantity}`
);

});

doc.moveDown();

doc.fontSize(14).text(
`Total Amount: ₹${order.rows[0].total}`,
{align:"right"}
);

doc.end();

}catch(err){

res.status(500).json({error:err.message});
  
}

});

console.log(process.env.RAZORPAY_KEY);
console.log(process.env.RAZORPAY_SECRET);
module.exports = router;
