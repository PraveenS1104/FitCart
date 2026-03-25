import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import "./EditProduct.css";

function EditProduct(){

 const { id } = useParams();
 const [form,setForm] = useState({
   name:"", category:"", price:"", image:"", image2:"", image3:"",
   fabric:"", gsm:"", stock:"", description:""
 });
 const [saved,setSaved] = useState(false);

 useEffect(()=>{
  axios.get(`http://localhost:5000/api/admin/products`)
  .then(res=>{
    const product = res.data.find(p=>p.id == id);
    if(product) setForm(product);
  });
 },[id]);

 const handleChange = (e)=>{
   setForm({...form,[e.target.name]:e.target.value});
 };

 const updateProduct = async(e)=>{
   e.preventDefault();
   await axios.put(`http://localhost:5000/api/admin/products/${id}`, form);
   setSaved(true);
   setTimeout(()=>setSaved(false), 3000);
 };

 return(
   <AdminLayout>

     <div className="admin-list-header">
       <h1 className="admin-page-title edit-product-page">Edit Product</h1>
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
         ✅ Product updated successfully!
       </div>
     )}

     <form onSubmit={updateProduct} className="edit-product-page">

       <div className="product-form-card">
         <div className="form-section-title">Edit Product Information</div>
         <div className="form-grid">

           <div className="pf-group">
             <label className="pf-label">Product Name *</label>
             <input
               name="name"
               value={form.name || ""}
               onChange={handleChange}
               className="pf-input"
               required
             />
           </div>

           <div className="pf-group">
             <label className="pf-label">Category *</label>
             <input
               name="category"
               value={form.category || ""}
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
               value={form.price || ""}
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
               value={form.stock || ""}
               onChange={handleChange}
               className="pf-input"
             />
           </div>

           <div className="pf-group">
             <label className="pf-label">Fabric</label>
             <input
               name="fabric"
               value={form.fabric || ""}
               onChange={handleChange}
               className="pf-input"
             />
           </div>

           <div className="pf-group">
             <label className="pf-label">GSM</label>
             <input
               name="gsm"
               value={form.gsm || ""}
               onChange={handleChange}
               className="pf-input"
             />
           </div>

           <div className="pf-group form-full">
             <label className="pf-label">Image URL 1 (Main)</label>
             <input
               name="image"
               value={form.image || ""}
               onChange={handleChange}
               className="pf-input"
             />
           </div>

           <div className="pf-group form-full">
             <label className="pf-label">Image URL 2</label>
             <input
               name="image2"
               value={form.image2 || ""}
               onChange={handleChange}
               className="pf-input"
             />
           </div>

           <div className="pf-group form-full">
             <label className="pf-label">Image URL 3</label>
             <input
               name="image3"
               value={form.image3 || ""}
               onChange={handleChange}
               className="pf-input"
             />
           </div>

           <div className="pf-group form-full">
             <label className="pf-label">Description</label>
             <textarea
               name="description"
               value={form.description || ""}
               onChange={handleChange}
               className="pf-textarea"
             />
           </div>

         </div>
       </div>

       <div className="product-form-actions">
         <button type="submit" className="pf-submit-btn">
           <i className="fas fa-save" style={{marginRight:8}}></i>
           Update Product
         </button>
         <Link to="/admin/products" className="pf-cancel-btn">
           Cancel
         </Link>
       </div>

     </form>

   </AdminLayout>
 );
}

export default EditProduct;