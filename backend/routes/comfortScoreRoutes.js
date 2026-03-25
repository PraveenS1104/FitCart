const express = require("express");
const router = express.Router();

router.post("/calculate",(req,res)=>{

const {fabric,temperature,gsm} = req.body;

let score=0;

const temp=parseInt(temperature);
const g=parseInt(gsm);

if(fabric==="cotton") score+=40;
if(fabric==="linen") score+=35;
if(fabric==="polyester") score+=25;

if(temp>30) score+=30;
else if(temp>20) score+=20;
else score+=10;

if(g<150) score+=30;
else if(g<300) score+=20;
else score+=10;

res.json({comfortScore:score});

});

module.exports = router;