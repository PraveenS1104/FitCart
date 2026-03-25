import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReviewBox from "../components/ReviewBox";
import "./ProductDetails.css";

function ProductDetails(){

const { id } = useParams();

const [product,setProduct] = useState(null);
const [selectedSize,setSelectedSize] = useState("");
const [mainImage,setMainImage] = useState("");

const [height,setHeight] = useState("");
const [weight,setWeight] = useState("");
const [chest,setChest] = useState("");
const [waist,setWaist] = useState("");
const [predictedSize,setPredictedSize] = useState("");

const [fabric,setFabric] = useState("");
const [temperature,setTemperature] = useState("");
const [gsm,setGsm] = useState("");
const [comfortScore,setComfortScore] = useState("");

const user = JSON.parse(localStorage.getItem("user"));

useEffect(()=>{

fetch("http://localhost:5000/api/products")
.then(res=>res.json())
.then(data=>{

const found = data.find(p=>p.id==id);
setProduct(found);

if(found){
setMainImage(found.image);
}

});

},[id]);

const images = product ? [
product.image,
product.image2,
product.image3
].filter(Boolean) : [];


// =======================
// SIZE PREDICTION API
// =======================

async function predictSize(){

if(!height || !weight || !chest || !waist){
toast.warning("Enter all measurements");
return;
}

try{

const res = await fetch("http://localhost:5000/api/size/predict",{

method:"POST",
headers:{ "Content-Type":"application/json" },

body:JSON.stringify({

height:parseInt(height),
weight:parseInt(weight),
chest:parseInt(chest),
waist:parseInt(waist)

})

});

const data = await res.json();

setPredictedSize(data.predictedSize);

toast.success(`Recommended Size: ${data.predictedSize}`);

}catch{

toast.error("Prediction failed");

}

}


// =======================
// COMFORT SCORE API
// =======================

async function calculateComfort(){

if(!fabric || !temperature || !gsm){
toast.warning("Enter fabric, temp and GSM");
return;
}

try{

const res = await fetch("http://localhost:5000/api/comfort/calculate",{

method:"POST",
headers:{ "Content-Type":"application/json" },

body:JSON.stringify({

fabric,
temperature:parseInt(temperature),
gsm:parseInt(gsm)

})

});

const data = await res.json();

setComfortScore(data.comfortScore);

}catch{

toast.error("Comfort calculation failed");

}

}


// =======================
// ADD TO CART
// =======================

async function addToCart(){

if(!user){
toast.error("Please login first");
setTimeout(()=>window.location.href="/login",1200);
return;
}

if(!selectedSize){
toast.warning("Select size first");
return;
}

try{

await fetch("http://localhost:5000/api/cart/add",{

method:"POST",
headers:{ "Content-Type":"application/json" },

body:JSON.stringify({

userId:user.id,
productId:product.id,
name:product.name,
price:product.price,
image:product.image,
size:selectedSize

})

});

toast.success("Added to cart");

}catch{
toast.error("Server error");
}

}


if(!product){
return <p style={{padding:"40px"}}>Loading...</p>;
}

return(

<div className="pd-page">

<div className="pd-container">

<div className="pd-layout">

{/* LEFT SIDE */}

<div className="pd-left">

<div className="pd-gallery">

<div className="pd-thumbs">

{images.map((img,i)=>(

<img
key={i}
src={img}
className={`pd-thumb ${mainImage===img?"active":""}`}
onClick={()=>setMainImage(img)}
/>

))}

</div>

<div className="pd-main-image">

<img
src={mainImage}
alt={product.name}
className="pd-image"
/>

</div>

</div>

<div className="pd-highlights">

<div className="pd-highlight">🚚 Free Delivery</div>
<div className="pd-highlight">🔄 30 Day Return</div>
<div className="pd-highlight">🛡 Warranty</div>
<div className="pd-highlight">⭐ Premium Quality</div>

</div>

</div>


{/* RIGHT SIDE */}

<div className="pd-info">

<h1 className="pd-name">{product.name}</h1>

<p className="pd-desc">
{product.description || "Premium quality product"}
</p>

<div className="pd-price">₹{product.price}</div>


{/* SIZE */}

<div className="pd-size-section">

<h3>Select Size</h3>

<div className="pd-sizes">

{["S","M","L","XL","XXL"].map(size=>(

<button
key={size}
className={`pd-size-btn ${selectedSize===size?"active":""}`}
onClick={()=>setSelectedSize(size)}
>
{size}
</button>

))}

</div>

</div>


{/* SIZE PREDICTION */}

<div className="pd-module">

<h3>AI Size Prediction</h3>

<input placeholder="Height" value={height} onChange={(e)=>setHeight(e.target.value)}/>
<input placeholder="Weight" value={weight} onChange={(e)=>setWeight(e.target.value)}/>
<input placeholder="Chest" value={chest} onChange={(e)=>setChest(e.target.value)}/>
<input placeholder="Waist" value={waist} onChange={(e)=>setWaist(e.target.value)}/>

<button onClick={predictSize}>Predict Size</button>

{predictedSize && <p className="pd-result">Recommended: {predictedSize}</p>}

</div>


{/* COMFORT SCORE */}

<div className="pd-module">

<h3>Comfort Score</h3>

<select onChange={(e)=>setFabric(e.target.value)}>
<option value="">Fabric</option>
<option value="cotton">Cotton</option>
<option value="linen">Linen</option>
<option value="polyester">Polyester</option>
</select>

<input placeholder="Temperature °C" value={temperature} onChange={(e)=>setTemperature(e.target.value)}/>
<input placeholder="Fabric GSM" value={gsm} onChange={(e)=>setGsm(e.target.value)}/>

<button onClick={calculateComfort}>Calculate</button>

{comfortScore && <p className="pd-result">Comfort Score: {comfortScore}/100</p>}

</div>


<button className="pd-add-cart" onClick={addToCart}>
Add To Cart
</button>


<div className="pd-reviews">
<ReviewBox productName={product.name}/>
</div>


</div>

</div>

</div>

</div>

);

}

export default ProductDetails;