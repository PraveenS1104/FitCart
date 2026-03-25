import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import API_BASE_URL from "../config/apiConfig";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setIsLoading(true);

    if (!name || !email || !password) {
      setMsg("All fields are required");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMsg("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setMsg("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      setMsg("🎉 Registration Successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.log(err);
      setMsg("Cannot connect to server. Please try again.");
      setIsLoading(false);
    }
  }

  const passwordStrength = () => {
    if (password.length === 0) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getStrengthColor = () => {
    const strength = passwordStrength();
    if (strength >= 75) return "#10b981";
    if (strength >= 50) return "#f59e0b";
    if (strength >= 25) return "#3b82f6";
    return "#ef4444";
  };

  return (
    <div className="register-page">
      {/* Decorative Background */}
      <div className="register-background">
        <div className="register-blob blob-1"></div>
        <div className="register-blob blob-2"></div>
        <div className="register-blob blob-3"></div>
      </div>

      <div className="register-container">
        {/* Left Side - Info */}
        <div className="register-info-side">
          <div className="info-content">
            <div className="info-logo">
              <div className="logo-circle"></div>
              <div className="logo-square"></div>
              <span className="logo-text">YARN Textiles</span>
            </div>
            <h1 className="info-title">Join YARN Textiles Today</h1>
            <p className="info-subtitle">
              Create your account to unlock personalized shopping experience, 
              exclusive offers, and faster checkout.
            </p>
            
            <div className="info-benefits">
              <div className="benefit-item">
                <div className="benefit-icon">🎯</div>
                <div className="benefit-content">
                  <h4>Personalized Recommendations</h4>
                  <p>Get product suggestions tailored to your interests</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">⚡</div>
                <div className="benefit-content">
                  <h4>Fast Checkout</h4>
                  <p>Save your details for quicker purchases</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🎁</div>
                <div className="benefit-content">
                  <h4>Exclusive Offers</h4>
                  <p>Access members-only discounts and early sales</p>
                </div>
              </div>
            </div>

            <div className="info-testimonial">
              <div className="testimonial-content">
                "YARN Textiles made my shopping experience amazing! 
                The personalized recommendations are spot on."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">RK</div>
                <div className="author-info">
                  <div className="author-name">Raj Kumar</div>
                  <div className="author-role">Verified Member</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="register-form-side">
          <div className="register-form-wrapper">
            <div className="form-header">
              <h2 className="form-title">Create Your Account</h2>
              <p className="form-subtitle">Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              {/* Message Display */}
              {msg && (
                <div className={`message-alert ${msg.includes("Successful") ? 'success' : 'error'}`}>
                  <div className="alert-icon">
                    {msg.includes("Successful") ? '✅' : '⚠️'}
                  </div>
                  <div className="alert-content">
                    {msg === "User already exists" ? (
                      <>
                        Account already exists.{" "}
                        <Link to="/login" className="alert-link">
                          Login here
                        </Link>
                      </>
                    ) : (
                      msg
                    )}
                  </div>
                </div>
              )}

              {/* Name Input */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <div className="input-wrapper">
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    disabled={isLoading}
                  />
                  <div className="input-icon">
                    <i className="fas fa-user"></i>
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    disabled={isLoading}
                  />
                  <div className="input-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    disabled={isLoading}
                  />
                  <div className="input-icon">
                    <i className="fas fa-lock"></i>
                  </div>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    <i className={`fas fa-eye${showPassword ? '' : '-slash'}`}></i>
                  </button>
                </div>
                
                {/* Password Strength */}
                {password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{ 
                          width: `${passwordStrength()}%`,
                          backgroundColor: getStrengthColor()
                        }}
                      ></div>
                    </div>
                    <div className="strength-label">
                      Password strength:{" "}
                      <span style={{ color: getStrengthColor() }}>
                        {passwordStrength() >= 75 ? "Strong" : 
                         passwordStrength() >= 50 ? "Medium" : 
                         passwordStrength() >= 25 ? "Weak" : "Very Weak"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="password-hints">
                  <div className={`hint-item ${password.length >= 6 ? 'valid' : ''}`}>
                    <i className="fas fa-check-circle"></i>
                    At least 6 characters
                  </div>
                  <div className={`hint-item ${/[A-Z]/.test(password) ? 'valid' : ''}`}>
                    <i className="fas fa-check-circle"></i>
                    One uppercase letter
                  </div>
                  <div className={`hint-item ${/[0-9]/.test(password) ? 'valid' : ''}`}>
                    <i className="fas fa-check-circle"></i>
                    One number
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                    disabled={isLoading}
                  />
                  <div className="input-icon">
                    <i className="fas fa-lock"></i>
                  </div>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    Passwords do not match
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="form-group terms-group">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    className="terms-checkbox"
                    required
                  />
                  <span className="terms-text">
                    I agree to the{" "}
                    <Link to="/terms" className="terms-link">Terms of Service</Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="register-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>Create Account</>
                )}
              </button>



              {/* Login Link */}
              <div className="login-prompt">
                <p className="prompt-text">
                  Already have an account?{" "}
                  <Link to="/login" className="login-link">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>

            {/* Security Badge */}
            <div className="security-badge">
              <div className="security-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="security-text">
                <div className="security-title">Your Data is Safe</div>
                <div className="security-subtitle">
                  We use 256-bit encryption to protect your information
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;