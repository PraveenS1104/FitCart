const express = require("express");
const router = express.Router();

router.post("/predict",(req,res)=>{

const {height,weight,chest,waist} = req.body;

const dataset=[

{h:160,w:50,c:88,wa:70,size:"S"},
{h:165,w:55,c:90,wa:72,size:"S"},

{h:170,w:60,c:96,wa:80,size:"M"},
{h:172,w:64,c:98,wa:82,size:"M"},

{h:175,w:70,c:104,wa:88,size:"L"},
{h:178,w:74,c:106,wa:90,size:"L"},

{h:180,w:80,c:112,wa:96,size:"XL"},
{h:182,w:85,c:115,wa:100,size:"XL"},

{h:185,w:92,c:120,wa:108,size:"XXL"}

];


const distances = dataset.map(d=>{

const dist=Math.sqrt(

Math.pow(d.h-height,2)+
Math.pow(d.w-weight,2)+
Math.pow(d.c-chest,2)+
Math.pow(d.wa-waist,2)

);

return {size:d.size,dist};

});


distances.sort((a,b)=>a.dist-b.dist);

const neighbours = distances.slice(0,3);

const votes={};

neighbours.forEach(n=>{

votes[n.size]=(votes[n.size]||0)+1;

});

const predicted = Object.keys(votes).reduce((a,b)=>

votes[a]>votes[b]?a:b

);

res.json({predictedSize:predicted});

});

module.exports = router;