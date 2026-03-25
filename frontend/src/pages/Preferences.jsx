import { useEffect, useState } from "react";
import "./Preferences.css";

function Preferences() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [pref, setPref] = useState("");
  const [msg, setMsg] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load preference only once
  useEffect(() => {
    if (!user || loaded) return;

    fetch(`http://localhost:5000/api/auth/preferences/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setPref(data.preferences || "");
        setLoaded(true);
      });
  }, [user, loaded]);

  // Save preference
  async function savePreferences() {
    if (!user) return;
    
    setIsSaving(true);
    setMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          preferences: pref,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error);
        setIsSaving(false);
        return;
      }

      setMsg("Preferences saved successfully ");

      // Reload preference from DB
      const reload = await fetch(
        `http://localhost:5000/api/auth/preferences/${user.id}`
      );
      const newData = await reload.json();
      setPref(newData.preferences || "");

    } catch (err) {
      setMsg("Server error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const preferenceExamples = [
    "Clothing: Size M, Colors: Blue & Black",
    "Electronics: Laptops & Headphones",
    "Home: Kitchenware & Bedding",
    "Books: Fiction & Self-Help",
    "Fitness: Running Shoes & Yoga Mats",
    "Beauty: Organic & Vegan Products"
  ];

  if (!user) {
    return (
      <div className="preferences-login-required">
        <div className="login-prompt">
          <i className="fas fa-user-cog"></i>
          <h3>Manage Preferences</h3>
          <p>Please login to customize your shopping preferences</p>
          <a href="/login" className="login-redirect-btn">
            <i className="fas fa-sign-in-alt"></i>
            Login to Continue
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="preferences-page">
      {/* Header Section */}
      <div className="preferences-header">
        <div className="header-content">
          <h1 className="preferences-title">
            <i className="fas fa-sliders-h"></i>
            My Preferences
          </h1>
          <p className="preferences-subtitle">
            Customize your shopping experience by setting your preferences. 
            We'll use these to recommend products you'll love.
          </p>
        </div>
        <div className="preferences-stats">
          <div className="pref-stat-card">
            <div className="pref-stat-icon">
              <i className="fas fa-bullseye"></i>
            </div>
            <div className="pref-stat-content">
              <div className="pref-stat-number">Personalized</div>
              <div className="pref-stat-label">Recommendations</div>
            </div>
          </div>
        </div>
      </div>

      <div className="preferences-container">
        <div className="preferences-content">
          {/* Main Preferences Card */}
          <div className="preferences-card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-heart"></i>
                Shopping Preferences
              </h2>
              <p className="card-subtitle">
                Tell us what you like to see more relevant products
              </p>
            </div>

            {/* Message Display */}
            {msg && (
              <div className={`message-alert ${msg.includes("successfully") ? 'success' : 'error'}`}>
                <div className="alert-icon">
                  {msg.includes("successfully") ? '✅' : '⚠️'}
                </div>
                <div className="alert-content">{msg}</div>
              </div>
            )}

            {/* Preferences Input */}
            <div className="preferences-input-section">
              <div className="input-header">
                <label htmlFor="preferences-input" className="input-label">
                  <i className="fas fa-tags"></i>
                  Your Preferences
                </label>
                <div className="input-hint">
                  <i className="fas fa-lightbulb"></i>
                  Separate multiple preferences with commas
                </div>
              </div>
              
              <div className="input-wrapper">
                <textarea
                  id="preferences-input"
                  placeholder="Examples: clothing size M, electronics, home decor, sports equipment, beauty products..."
                  value={pref}
                  onChange={(e) => setPref(e.target.value)}
                  className="preferences-textarea"
                  rows="4"
                  disabled={isSaving}
                />
                <div className="char-count">
                  {pref.length}/500 characters
                </div>
              </div>

              {/* Save Button */}
              <button 
                onClick={savePreferences} 
                className="save-btn"
                disabled={isSaving || !pref.trim()}
              >
                {isSaving ? (
                  <>
                    <span className="btn-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Save Preferences
                  </>
                )}
              </button>
            </div>

            {/* Examples Section */}
            <div className="examples-section">
              <h3 className="examples-title">
                <i className="fas fa-lightbulb"></i>
                Need Ideas? Try These Examples
              </h3>
              <div className="examples-grid">
                {preferenceExamples.map((example, index) => (
                  <button
                    key={index}
                    className="example-chip"
                    onClick={() => setPref(example)}
                    disabled={isSaving}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="benefits-section">
              <h3 className="benefits-title">
                <i className="fas fa-star"></i>
                How Your Preferences Help
              </h3>
              <div className="benefits-grid">
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <i className="fas fa-magic"></i>
                  </div>
                  <div className="benefit-content">
                    <h4>Personalized Feed</h4>
                    <p>See products that match your interests first</p>
                  </div>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <i className="fas fa-bell"></i>
                  </div>
                  <div className="benefit-content">
                    <h4>Smart Alerts</h4>
                    <p>Get notified when preferred items go on sale</p>
                  </div>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <i className="fas fa-robot"></i>
                  </div>
                  <div className="benefit-content">
                    <h4>Better Recommendations</h4>
                    <p>AI suggests products you're more likely to love</p>
                  </div>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="benefit-content">
                    <h4>Save Time</h4>
                    <p>Find what you need faster with filtered results</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips Sidebar */}
          <div className="tips-sidebar">
            <div className="tips-card">
              <div className="tips-header">
                <h3>
                  <i className="fas fa-info-circle"></i>
                  Tips for Better Preferences
                </h3>
              </div>
              <div className="tips-content">
                <div className="tip-item">
                  <div className="tip-number">1</div>
                  <div className="tip-text">Be specific about sizes, colors, brands</div>
                </div>
                <div className="tip-item">
                  <div className="tip-number">2</div>
                  <div className="tip-text">Include categories you frequently shop</div>
                </div>
                <div className="tip-item">
                  <div className="tip-number">3</div>
                  <div className="tip-text">Update preferences as your tastes change</div>
                </div>
                <div className="tip-item">
                  <div className="tip-number">4</div>
                  <div className="tip-text">Use keywords you'd search for</div>
                </div>
              </div>
              <div className="tips-note">
                <i className="fas fa-shield-alt"></i>
                <span>Your preferences are private and only used to improve your shopping experience.</span>
              </div>
            </div>

            {/* Current Preferences Preview */}
            <div className="current-prefs">
              <h3 className="current-prefs-title">
                <i className="fas fa-eye"></i>
                Current Preferences
              </h3>
              {pref ? (
                <div className="pref-preview">
                  <div className="pref-text">{pref}</div>
                  <div className="pref-meta">
                    <span className="pref-length">{pref.split(',').length} preferences set</span>
                    <span className="pref-updated">Last updated: Today</span>
                  </div>
                </div>
              ) : (
                <div className="no-prefs">
                  <i className="fas fa-edit"></i>
                  <p>No preferences set yet. Add your first preference above!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preferences;