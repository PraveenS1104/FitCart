import { Link } from "react-router-dom";
import { useState } from "react";
import "./Footer.css";

function Footer() {

const [email,setEmail] = useState("");
const [isSubscribed,setIsSubscribed] = useState(false);

function handleSubscribe(e){
e.preventDefault();

if(!email) return;

setIsSubscribed(true);

setTimeout(()=>{
setEmail("");
setIsSubscribed(false);
},3000);
}

return(

<footer className="footer">

<div className="footer-container">

<div className="footer-main">


{/* BRAND */}

<div className="footer-section">

<h2 className="footer-logo">
DB YARN<span>TEXTILES</span>
</h2>

<p className="footer-description">
Your trusted destination for premium fashion and home essentials.
Shop smart. Shop better.
</p>

<div className="footer-social">

<a href="#"><i className="fab fa-facebook-f"></i></a>
<a href="#"><i className="fab fa-instagram"></i></a>
<a href="#"><i className="fab fa-twitter"></i></a>
<a href="#"><i className="fab fa-linkedin-in"></i></a>

</div>

</div>



{/* LINKS */}

<div className="footer-section">

<h3 className="footer-heading">Quick Links</h3>

<ul className="footer-links">

<li><Link to="/">Home</Link></li>
<li><Link to="/product">Products</Link></li>
<li><Link to="/cart">Cart</Link></li>
<li><Link to="/orders">Orders</Link></li>

</ul>

</div>



{/* CONTACT */}

<div className="footer-section">

<h3 className="footer-heading">Contact</h3>

<p>Email: dbyarntextiles@gmail.com</p>
<p>Phone: +91 98765 43210</p>
<p>Tamil Nadu, India</p>

</div>



{/* NEWSLETTER */}

<div className="footer-section">

<h3 className="footer-heading">Newsletter</h3>

<p className="newsletter-text">
Get updates about offers and new arrivals.
</p>

<form onSubmit={handleSubscribe} className="newsletter-form">

<input
type="email"
placeholder="Enter email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<button type="submit">

{isSubscribed ? "Subscribed ✓" : "Subscribe"}

</button>

</form>

</div>


</div>



{/* BOTTOM */}

<div className="footer-bottom">

<p>© {new Date().getFullYear()} DB YARN TEXTILES. All rights reserved.</p>

<button
className="back-top"
onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
>

↑ Back to top

</button>

</div>

</div>

</footer>

);

}

export default Footer;