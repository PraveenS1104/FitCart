import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import "./AdminProducts.css";
import API_BASE_URL from "../../config/apiConfig";

function AdminProducts(){

 const [products,setProducts] = useState([]);

 useEffect(()=>{
  loadProducts();
 },[]);

 const loadProducts = ()=>{
   axios.get(`${API_BASE_URL}/api/admin/products`)
   .then(res=>{
     setProducts(res.data);
   });
 };

 const deleteProduct = async(id)=>{
   if(!window.confirm("Delete this product?")) return;
   await axios.delete(`${API_BASE_URL}/api/admin/products/${id}`);
   loadProducts();
 };

 return(
   <AdminLayout>

     {/* Header */}
     <div className="admin-list-header">
       <h1 className="admin-list-title admin-page-title">Products</h1>
       <Link to="/admin/add-product" className="admin-add-btn">
         <i className="fas fa-plus"></i>
         Add Product
       </Link>
     </div>

     {/* Table */}
     <div className="admin-table-card">
       <table className="admin-table">

         <thead>
           <tr>
             <th>Image</th>
             <th>Name</th>
             <th>Price</th>
             <th>Stock</th>
             <th>Status</th>
             <th>Actions</th>
           </tr>
         </thead>

         <tbody>
           {products.map(p=>(
             <tr key={p.id}>

               <td>
                 <img
                   src={p.image}
                   alt={p.name}
                   className="admin-product-img"
                 />
               </td>

               <td>
                 <div className="admin-product-name">{p.name}</div>
                 {p.category && (
                   <div className="admin-product-cat">{p.category}</div>
                 )}
               </td>

               <td>₹ {p.price}</td>

               <td>{p.stock}</td>

               <td>
                 <span className={`admin-status ${p.stock > 0 ? 'active' : 'inactive'}`}>
                   {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                 </span>
               </td>

               <td>
                 <div className="admin-actions">
                   <Link
                     to={`/admin/edit-product/${p.id}`}
                     className="admin-action-btn edit"
                     title="Edit"
                   >
                     <i className="fas fa-edit"></i>
                   </Link>
                   <button
                     className="admin-action-btn delete"
                     onClick={()=>deleteProduct(p.id)}
                     title="Delete"
                   >
                     <i className="fas fa-trash"></i>
                   </button>
                 </div>
               </td>

             </tr>
           ))}
         </tbody>

       </table>

       {products.length > 0 && (
         <div className="admin-table-footer">
           <span className="admin-table-count">
             Showing {products.length} product{products.length !== 1 ? 's' : ''}
           </span>
         </div>
       )}

     </div>

   </AdminLayout>
 );
}

export default AdminProducts;