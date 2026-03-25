import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const paymentId = query.get("payment_id");
  const orderId = query.get("order_id");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F5F5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        padding: "52px 44px",
        textAlign: "center",
        maxWidth: "480px",
        width: "100%",
        boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
        border: "1px solid #E0E0E0",
      }}>

        {/* Icon */}
        <div style={{
          width: "80px",
          height: "80px",
          background: "rgba(46,125,50,0.1)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          fontSize: "36px",
        }}>
          ✓
        </div>

        <h1 style={{
          fontSize: "28px",
          fontWeight: "800",
          color: "#1A1A1A",
          letterSpacing: "-0.03em",
          marginBottom: "8px",
          fontFamily: "'Poppins', sans-serif",
        }}>
          Payment Successful
        </h1>

        <p style={{
          color: "#9E9E9E",
          fontSize: "15px",
          marginBottom: "28px",
          lineHeight: "1.6",
        }}>
          Your order has been placed and will be processed shortly.
        </p>

        {/* Details */}
        <div style={{
          background: "#F5F5F5",
          borderRadius: "10px",
          padding: "16px 20px",
          textAlign: "left",
          marginBottom: "28px",
          border: "1px solid #E0E0E0",
        }}>
          {paymentId && (
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.07em", color: "#9E9E9E", marginBottom: "3px" }}>
                Payment ID
              </div>
              <div style={{ fontSize: "13px", fontWeight: "500", color: "#1A1A1A", fontFamily: "monospace" }}>
                {paymentId}
              </div>
            </div>
          )}
          {orderId && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.07em", color: "#9E9E9E", marginBottom: "3px" }}>
                Order ID
              </div>
              <div style={{ fontSize: "13px", fontWeight: "500", color: "#1A1A1A", fontFamily: "monospace" }}>
                {orderId}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={() => navigate("/orders")}
            style={{
              width: "100%",
              padding: "13px",
              background: "#D4AF37",
              color: "#111111",
              border: "none",
              borderRadius: "6px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "'Inter', sans-serif",
              boxShadow: "0 4px 14px rgba(212,175,55,0.3)",
            }}
            onMouseOver={e => { e.target.style.background = "#B8960D"; e.target.style.transform = "translateY(-1px)"; }}
            onMouseOut={e => { e.target.style.background = "#D4AF37"; e.target.style.transform = "translateY(0)"; }}
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/product")}
            style={{
              width: "100%",
              padding: "13px",
              background: "transparent",
              color: "#3D3D3D",
              border: "1.5px solid #E0E0E0",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseOver={e => { e.target.style.borderColor = "#1A1A1A"; e.target.style.background = "#F5F5F5"; }}
            onMouseOut={e => { e.target.style.borderColor = "#E0E0E0"; e.target.style.background = "transparent"; }}
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;