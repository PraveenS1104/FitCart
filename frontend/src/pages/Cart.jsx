import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";
import API_BASE_URL from "../config/apiConfig";

function Cart() {

const [items,setItems] = useState([]);
const [loading,setLoading] = useState(true);
const [selected,setSelected] = useState(new Set());

const navigate = useNavigate();
const user = JSON.parse(localStorage.getItem("user") || "null");


/* ================= LOAD CART ================= */

useEffect(()=>{

if(!user){
navigate("/login");
return;
}

async function loadCart(){

try{

const res = await fetch(`${API_BASE_URL}/api/cart/${user.id}`);
const data = await res.json();

setItems(data);

const ids = data.map(i=>i.id);
setSelected(new Set(ids));

}catch(err){

console.error(err);
toast.error("Failed to load cart");

}finally{
setLoading(false);
}

}

loadCart();

},[user,navigate]);



/* ================= UPDATE QUANTITY ================= */

async function updateQty(id,type){

try{

await fetch(`${API_BASE_URL}/api/cart/update`,{
method:"PUT",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({id,type})
});

setItems(prevItems =>
prevItems.map(i => {

if(i.id===id){

const newQty = type==="inc"
? i.quantity + 1
: Math.max(1, i.quantity - 1);

return {...i, quantity:newQty};

}

return i;

})
);

}catch(err){

toast.error("Quantity update failed");

}

}



/* ================= REMOVE ITEM ================= */

async function removeItem(id){

try{

await fetch(`${API_BASE_URL}/api/cart/remove/${id}`,{
method:"DELETE"
});

setItems(prev => prev.filter(i=>i.id!==id));

setSelected(prev=>{
const s = new Set(prev);
s.delete(id);
return s;
});

toast.error("Item removed");

}catch(err){

toast.error("Failed to remove item");

}

}



/* ================= SELECT ITEMS ================= */

function toggleItem(id){

setSelected(prev=>{

const s = new Set(prev);

if(s.has(id)) s.delete(id);
else s.add(id);

return s;

});

}

function toggleAll(){

if(selected.size===items.length){
setSelected(new Set());
}else{
setSelected(new Set(items.map(i=>i.id)));
}

}



/* ================= TOTAL CALCULATION ================= */

const selectedItems = items.filter(i=>selected.has(i.id));

const subtotal = selectedItems.reduce(
(sum,i)=>sum + i.price * i.quantity ,0
);

const shipping = subtotal>1000 ? 0 : 99;
const tax = subtotal * 0.18;
const total = subtotal + shipping + tax;



/* ================= CHECKOUT ================= */

async function checkout(){

if(selectedItems.length===0){
toast.error("Select items first");
return;
}

try{

const res = await fetch(
`${API_BASE_URL}/api/orders/create-payment`,
{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
userId:user.id,
amount:Math.round(total*100)
})
}
);

const order = await res.json();

if(!order.orderId){
toast.error("Payment initialization failed");
return;
}

const options = {

key:"rzp_test_SRMnWEeY53gzlS",

amount:order.amount,

currency:"INR",

order_id:order.orderId,

name:"SmartShop",

description:"Order Payment",

prefill:{
name:user.name,
email:user.email
},

handler: async function(response){

try{

await fetch(
`${API_BASE_URL}/api/orders/verify-payment`,
{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
...response,
userId:user.id
})
}
);

toast.success("Payment successful 🎉");

navigate(
`/payment-success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`
);

}catch(err){

toast.error("Verification failed");

}

}

};

const rzp = new window.Razorpay(options);

rzp.on("payment.failed", function () {

toast.error("Payment failed");

navigate("/payment-failed");

});

rzp.open();

}catch(err){

toast.error("Payment error");

}

}



/* ================= PRICE FORMAT ================= */

function price(v){

return new Intl.NumberFormat("en-IN",{
style:"currency",
currency:"INR",
maximumFractionDigits:0
}).format(v);

}



/* ================= LOADING ================= */

if(loading){

return(

<div className="cart-loading">

<div className="spinner"></div>
<p>Loading cart...</p>

</div>

);

}



/* ================= MAIN PAGE ================= */

return(

<div className="cart-page">

<div className="cart-header">

<div className="cart-header-overlay"></div>

<div className="cart-header-content">

<h1>
<i className="fas fa-shopping-cart"></i>
Shopping Cart
</h1>

<p>{items.length} items in your cart</p>

</div>

</div>



<div className="cart-container">


{items.length===0 ?(

<div className="cart-empty">

<img
src="/images/illustrations/cart-empty.png"
alt="empty cart"
/>

<h3>Your cart is empty</h3>

<Link to="/product" className="shop-btn">
Continue Shopping
</Link>

</div>

):(


<div className="cart-layout">


{/* ITEMS */}

<div className="cart-items">

<div className="cart-actions">

<label>

<input
type="checkbox"
checked={selected.size===items.length && items.length>0}
onChange={toggleAll}
/>

Select All

</label>

</div>


{items.map(item=>(

<div key={item.id} className="cart-item">

<input
type="checkbox"
checked={selected.has(item.id)}
onChange={()=>toggleItem(item.id)}
/>

<div className="cart-image">

<img
src={item.image || "/images/products/default-product.png"}
alt={item.name}
/>

</div>

<div className="cart-info">

<Link to={`/product/${item.product_id}`}>
<h4>{item.name}</h4>
</Link>

<p>{price(item.price)}</p>

<div className="cart-qty">

<button onClick={()=>updateQty(item.id,"dec")}>-</button>

<span>{item.quantity}</span>

<button onClick={()=>updateQty(item.id,"inc")}>+</button>

</div>

<button
className="remove-btn"
onClick={()=>removeItem(item.id)}
>
Remove
</button>

</div>

<div className="cart-total">
{price(item.price * item.quantity)}
</div>

</div>

))}

</div>



{/* SUMMARY */}

<div className="cart-summary">

<h3>Order Summary</h3>

<div className="sum-row">
<span>Subtotal</span>
<span>{price(subtotal)}</span>
</div>

<div className="sum-row">
<span>Shipping</span>
<span>{shipping===0 ? "Free" : price(shipping)}</span>
</div>

<div className="sum-row">
<span>Tax</span>
<span>{price(tax)}</span>
</div>

<hr/>

<div className="sum-total">
<span>Total</span>
<span>{price(total)}</span>
</div>

<button
className="checkout-btn"
onClick={checkout}
>
Checkout
</button>

</div>


</div>

)}

</div>

</div>

);

}

export default Cart;