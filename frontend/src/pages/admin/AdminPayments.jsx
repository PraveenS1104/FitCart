import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import "./AdminPayments.css";
import API_BASE_URL from "../../config/apiConfig";

function AdminPayments(){

 const [payments,setPayments] = useState([]);

 useEffect(()=>{
  axios.get(`${API_BASE_URL}/api/admin/payments`)
  .then(res=>{
    setPayments(res.data);
  });
 },[]);

 const totalRevenue = payments.filter(p=>p.status==="captured"||p.status==="success").reduce((s,p)=>s+parseFloat(p.amount||0),0);
 const successCount = payments.filter(p=>p.status==="captured"||p.status==="success").length;
 const failedCount  = payments.filter(p=>p.status==="failed").length;

 return(
   <AdminLayout>

     <div className="admin-list-header">
       <h1 className="admin-page-title">Payments</h1>
     </div>

     {/* Summary Stats */}
     <div className="payment-stats">
       <div className="pay-stat-card">
         <div className="pay-stat-label">Total Revenue</div>
         <div className="pay-stat-value gold">₹ {totalRevenue.toFixed(0)}</div>
       </div>
       <div className="pay-stat-card">
         <div className="pay-stat-label">Successful Payments</div>
         <div className="pay-stat-value green">{successCount}</div>
       </div>
       <div className="pay-stat-card">
         <div className="pay-stat-label">Failed Payments</div>
         <div className="pay-stat-value">{failedCount}</div>
       </div>
     </div>

     {/* Table */}
     <div className="admin-table-card">
       <table className="admin-table">

         <thead>
           <tr>
             <th>Payment ID</th>
             <th>Order ID</th>
             <th>Amount</th>
             <th>Status</th>
             <th>Date</th>
           </tr>
         </thead>

         <tbody>
           {payments.map(p=>(
             <tr key={p.id}>

               <td>
                 <span className="txn-id">{p.payment_id}</span>
               </td>

               <td>#{p.order_id}</td>

               <td>
                 <span className={`payment-amount ${p.status==="success"||p.status==="captured" ? "success-amt" : p.status==="failed" ? "failed-amt" : ""}`}>
                   ₹ {p.amount}
                 </span>
               </td>

               <td>
                 <span className={`admin-status ${p.status}`}>
                   {p.status}
                 </span>
               </td>

               <td>{new Date(p.created_at).toLocaleDateString()}</td>

             </tr>
           ))}
         </tbody>

       </table>

       {payments.length > 0 && (
         <div className="admin-table-footer">
           <span className="admin-table-count">
             {payments.length} payment{payments.length !== 1 ? 's' : ''}
           </span>
         </div>
       )}

     </div>

   </AdminLayout>
 );
}

export default AdminPayments;