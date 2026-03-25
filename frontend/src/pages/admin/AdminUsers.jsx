import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import "./AdminUsers.css";

function AdminUsers(){

 const [users,setUsers] = useState([]);

 useEffect(()=>{
  axios.get("http://localhost:5000/api/admin/users")
  .then(res=>{
    setUsers(res.data);
  });
 },[]);

 function getInitials(name){
  return (name || "U").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
 }

 return(
   <AdminLayout>

     <div className="admin-list-header">
       <h1 className="admin-page-title">Users</h1>
     </div>

     <div className="admin-table-card">
       <table className="admin-table">

         <thead>
           <tr>
             <th>User</th>
             <th>Email</th>
             <th>Role</th>
             <th>ID</th>
           </tr>
         </thead>

         <tbody>
           {users.map(u=>(
             <tr key={u.id}>

               <td>
                 <div className="user-avatar-cell">
                   <div className="user-table-avatar">
                     {getInitials(u.name)}
                   </div>
                   <div>
                     <div className="user-table-name">{u.name}</div>
                   </div>
                 </div>
               </td>

               <td>
                 <div className="user-table-email">{u.email}</div>
               </td>

               <td>
                 <span className={`role-badge ${u.role || 'user'}`}>
                   {u.role === 'admin' ? '⚙ Admin' : '👤 User'}
                 </span>
               </td>

               <td>
                 <span className="txn-id">#{u.id}</span>
               </td>

             </tr>
           ))}
         </tbody>

       </table>

       {users.length > 0 && (
         <div className="admin-table-footer">
           <span className="admin-table-count">
             {users.length} registered user{users.length !== 1 ? 's' : ''}
           </span>
         </div>
       )}

     </div>

   </AdminLayout>
 );
}

export default AdminUsers;