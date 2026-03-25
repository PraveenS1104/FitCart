const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/:userId", async (req,res)=>{

try{

const {userId} = req.params;

// ======================
// 1️⃣ USER PURCHASE HISTORY
// ======================

const history = await pool.query(`SELECT oi.product_name
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.user_id = $1`,[userId]);

// ======================
// 2️⃣ IF NEW USER → POPULAR PRODUCTS
// ======================

if(history.rows.length === 0){

const popular = await pool.query(`SELECT p.*, COUNT(oi.id) as purchase_count
FROM products p
LEFT JOIN order_items oi
ON p.name = oi.product_name
GROUP BY p.id
ORDER BY purchase_count DESC
LIMIT 8`);

return res.json(popular.rows);

}

// ======================
// 3️⃣ CONTENT BASED FILTERING
// ======================

let categories = new Set();

history.rows.forEach(row=>{

const name = row.product_name.toLowerCase();

if(
name.includes("shirt") ||
name.includes("pant") ||
name.includes("kurti") ||
name.includes("wear")
){
categories.add("clothing");
}

if(
name.includes("bed") ||
name.includes("pillow") ||
name.includes("blanket")
){
categories.add("bedsheet");
}

});

const contentBased = await pool.query(`SELECT *
FROM products
WHERE category = ANY($1)
LIMIT 6`,[[...categories]]);

// ======================
// 4️⃣ COLLABORATIVE FILTERING
// ======================

const similarUsers = await pool.query(`SELECT DISTINCT o2.user_id
FROM orders o1
JOIN order_items oi1 ON o1.id = oi1.order_id
JOIN order_items oi2 ON oi1.product_name = oi2.product_name
JOIN orders o2 ON oi2.order_id = o2.id
WHERE o1.user_id = $1
AND o2.user_id != $1
LIMIT 5`,[userId]);

let collaborativeProducts = [];

if(similarUsers.rows.length > 0){

const ids = similarUsers.rows.map(u => u.user_id);

const collab = await pool.query(`SELECT DISTINCT p.*
FROM products p
JOIN order_items oi ON p.name = oi.product_name
JOIN orders o ON oi.order_id = o.id
WHERE o.user_id = ANY($1)
LIMIT 6`,[ids]);

collaborativeProducts = collab.rows;

}

// ======================
// 5️⃣ MERGE RESULTS
// ======================

const recommendations = [
...contentBased.rows,
...collaborativeProducts
];

res.json(recommendations.slice(0,8));

}catch(err){

console.error("RECOMMEND ERROR:",err);
res.status(500).json({error:err.message});

}

});

module.exports = router;
