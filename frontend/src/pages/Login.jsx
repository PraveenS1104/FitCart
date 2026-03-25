import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import API_BASE_URL from "../config/apiConfig";

function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState("");
  const [isLoading,setIsLoading] = useState(false);

  const navigate = useNavigate();


  async function handleSubmit(e){

    e.preventDefault();
    setMsg("");
    setIsLoading(true);

    if(!email || !password){
      setMsg("All fields required");
      setIsLoading(false);
      return;
    }

    try{

      const res = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({email,password})
        }
      );

      const data = await res.json();

      if(!res.ok){
        setMsg(data.error || "Login failed");
        setIsLoading(false);
        return;
      }


      // SAVE USER + TOKEN
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);


      setMsg("Login Successful ✅");


      // REDIRECT BASED ON ROLE
      setTimeout(()=>{

        if(data.user.role === "admin"){
          navigate("/admin");
        }else{
          navigate("/");
        }

      },1000);


    }catch(err){

      console.log(err);
      setMsg("Cannot connect to server");
      setIsLoading(false);

    }

  }



  return (

  <div className="login-page">

    <div className="login-background">
      <div className="login-blob blob-1"></div>
      <div className="login-blob blob-2"></div>
      <div className="login-blob blob-3"></div>
    </div>


    <div className="login-container">


      {/* LEFT SIDE */}
      <div className="login-brand-side">

        <div className="brand-content">

          <div className="brand-logo">
            <div className="logo-circle"></div>
            <div className="logo-square"></div>
            <span className="logo-text">YARN Textiles</span>
          </div>

          <h1 className="brand-title">Welcome Back</h1>

          <p className="brand-subtitle">
            Sign in to access personalized recommendations,
            track orders, and enjoy exclusive offers.
          </p>

        </div>

      </div>



      {/* RIGHT SIDE */}
      <div className="login-form-side">

        <div className="login-form-wrapper">

          <h2 className="form-title">
            Sign In to Your Account
          </h2>


          <form onSubmit={handleSubmit} className="login-form">


            {msg && (
              <div className="message-alert">
                {msg}
              </div>
            )}


            <div className="form-group">

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                disabled={isLoading}
              />

            </div>


            <div className="form-group">

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                disabled={isLoading}
              />

            </div>


            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
            >

              {isLoading ? "Signing In..." : "Sign In"}

            </button>


            <div className="register-prompt">

              <p>

                Don't have an account?

                <Link to="/register">
                  Create one
                </Link>

              </p>

            </div>


          </form>

        </div>

      </div>

    </div>

  </div>

  );

}

export default Login;