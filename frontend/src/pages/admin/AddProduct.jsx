import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import "./AddProduct.css";

function AddProduct(){

 const [form,setForm] = useState({
   name:"", category:"", price:"", image:"", image2:"", image3:"",
   fabric:"", gsm:"", stock:"", description:""
 });
 const [saved,setSaved] = useState(false);

 const handleChange=(e)=>{
  setForm({...form,[e.target.name]:e.target.value});
 };

 const submit = async(e)=>{
  e.preventDefault();
  await axios.post("http://localhost:5000/api/admin/products", form);
  setSaved(true);
  setTimeout(()=>setSaved(false), 3000);
  setForm({name:"",category:"",price:"",image:"",image2:"",image3:"",fabric:"",gsm:"",stock:"",description:""});
 };

 return(
   <AdminLayout>

     <div className="admin-list-header">
       <h1 className="admin-page-title add-product-page">Add Product</h1>
       <Link to="/admin/products" className="pf-cancel-btn">
         <i className="fas fa-arrow-left" style={{marginRight:6}}></i>
         Back to Products
       </Link>
     </div>

     {saved && (
       <div style={{
         background:"rgba(46,125,50,0.08)",
         border:"1px solid rgba(46,125,50,0.2)",
         color:"#2E7D32",
         borderRadius:8,
         padding:"12px 16px",
         marginBottom:20,
         fontSize:14,
         fontWeight:600
       }}>
         ✅ Product added successfully!
       </div>
     )}

     <form onSubmit={submit} className="add-product-page">

       <div className="product-form-card">
         <div className="form-section-title">Basic Information</div>
         <div className="form-grid">

           <div className="pf-group">
             <label className="pf-label">Product Name *</label>
             <input
               name="name"
               value={form.name}
               placeholder="e.g. Cotton Saree"
               onChange={handleChange}
               className="pf-input"
               required
             />
           </div>

           <div className="pf-group">
             <label className="pf-label">Category *</label>
             <input
               name="category"
               value={form.category}
               placeholder="e.g. Sarees"
               onChange={handleChange}
               className="pf-input"
               required
             />
           </div>

           <div className="pf-group">
             <label className="pf-label">Price (₹) *</label>
             <input
               name="price"
               type="number"
               value={form.price}
               placeholder="e.g. 1499"
               onChange={handleChange}
               className="pf-input"
               required
             />
           </div>

           <div className="pf-group">
             <label className="pf-label">Stock Quantity</label>
             <input
               name="stock"
               type="number"
               value={form.stock}
               placeholder="e.g. 50"
               onChange={handleChange}
               className="pf-input"
             />
           </div>

           <div className="pf-group">
             <label className="pf-label">Fabric</label>
             <input
               name="fabric"
               value={form.fabric}
               placeholder="e.g. Pure Cotton"
               onChange={handleChange}
               className="pf-input"
             />
           </div>

           <div className="pf-group">
             <label className="pf-label">GSM</label>
             <input
               name="gsm"
               value={form.gsm}
               placeholder="e.g. 180"
               onChange={handleChange}
               className="pf-input"
             />
           </div>

           <div className="pf-group form-full">
             <label className="pf-label">Image URL 1 (Main)</label>
             <input
               name="image"
               value={form.image}
               placeholder="https://..."
               onChange={handleChange}
               className="pf-input"
             />
           </div>

           <div className="pf-group form-full">
             <label className="pf-label">Image URL 2</label>
             <input
               name="image2"
               value={form.image2}
               placeholder="https://..."
               onChange={handleChange}
               className="pf-input"
             />
           </div>

           <div className="pf-group form-full">
             <label className="pf-label">Image URL 3</label>
             <input
               name="image3"
               value={form.image3}
               placeholder="https://..."
               onChange={handleChange}
               className="pf-input"
             />
           </div>

           <div className="pf-group form-full">
             <label className="pf-label">Description</label>
             <textarea
               name="description"
               value={form.description}
               placeholder="Describe the product..."
               onChange={handleChange}
               className="pf-textarea"
             />
           </div>

         </div>
       </div>

       <div className="product-form-actions">
         <button type="submit" className="pf-submit-btn">
           <i className="fas fa-plus" style={{marginRight:8}}></i>
           Add Product
         </button>
         <Link to="/admin/products" className="pf-cancel-btn">
           Cancel
         </Link>
       </div>

     </form>

   </AdminLayout>
 );
}

export default AddProduct;