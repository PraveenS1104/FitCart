import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import "./AdminOrders.css";
import API_BASE_URL from "../../config/apiConfig";

function AdminOrders(){

 const [orders,setOrders] = useState([]);

 useEffect(()=>{
  loadOrders();
 },[]);

 const loadOrders = ()=>{
  axios.get(`${API_BASE_URL}/api/admin/orders`)
  .then(res=>{
    setOrders(res.data);
  });
 };

 const updateStatus = async(id,status)=>{
  await axios.put(
   `${API_BASE_URL}/api/admin/orders/${id}/status`,
   {status}
  );
  loadOrders();
 };

 return(
   <AdminLayout>

     <div className="admin-list-header">
       <h1 className="admin-page-title">Orders</h1>
     </div>

     <div className="admin-table-card">
       <table className="admin-table">

         <thead>
           <tr>
             <th>Order ID</th>
             <th>Customer</th>
             <th>Total</th>
             <th>Status</th>
             <th>Date</th>
           </tr>
         </thead>

         <tbody>
           {orders.map(o=>(
             <tr key={o.id}>

               <td>
                 <span className="order-id-cell">#{o.id}</span>
               </td>

               <td>
                 <div className="order-customer-cell">
                   <div className="customer-name">{o.user_name}</div>
                 </div>
               </td>

               <td>
                 <span className="order-amount-cell">₹ {o.total}</span>
               </td>

               <td>
                 <select
                   value={o.status}
                   onChange={(e)=>updateStatus(o.id,e.target.value)}
                   className="status-update-select"
                 >
                   <option value="pending">Pending</option>
                   <option value="paid">Paid</option>
                   <option value="shipped">Shipped</option>
                   <option value="delivered">Delivered</option>
                   <option value="cancelled">Cancelled</option>
                 </select>
               </td>

               <td>{new Date(o.created_at).toLocaleDateString()}</td>

             </tr>
           ))}
         </tbody>

       </table>

       {orders.length > 0 && (
         <div className="admin-table-footer">
           <span className="admin-table-count">
             {orders.length} order{orders.length !== 1 ? 's' : ''}
           </span>
         </div>
       )}

     </div>

   </AdminLayout>
 );
}

export default AdminOrders;