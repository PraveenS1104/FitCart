import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

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
          background: "rgba(229,57,53,0.08)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          fontSize: "36px",
          color: "#E53935",
        }}>
          ✕
        </div>

        <h1 style={{
          fontSize: "28px",
          fontWeight: "800",
          color: "#1A1A1A",
          letterSpacing: "-0.03em",
          marginBottom: "8px",
          fontFamily: "'Poppins', sans-serif",
        }}>
          Payment Failed
        </h1>

        <p style={{
          color: "#9E9E9E",
          fontSize: "15px",
          marginBottom: "12px",
          lineHeight: "1.6",
        }}>
          Your payment could not be completed.
        </p>

        <p style={{
          color: "#757575",
          fontSize: "14px",
          marginBottom: "32px",
          lineHeight: "1.6",
          background: "rgba(229,57,53,0.05)",
          border: "1px solid rgba(229,57,53,0.15)",
          borderRadius: "8px",
          padding: "12px 16px",
        }}>
          Please check your payment details and try again. If the problem persists, contact your bank or our support team.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={() => navigate("/cart")}
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
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
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
            Go Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentFailed;