const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req,res)=>{

try{

const result = await pool.query(`SELECT p.*, COUNT(oi.id) AS purchase_count
FROM products p
LEFT JOIN order_items oi
ON p.name = oi.product_name
GROUP BY p.id
ORDER BY purchase_count DESC
LIMIT 8`);

res.json(result.rows);

}catch(err){

console.error("TRENDING ERROR:",err);
res.status(500).json({error:err.message});

}

});

module.exports = router;
