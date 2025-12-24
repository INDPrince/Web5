import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function GitPush() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [formData, setFormData] = useState({
    username: "INDPRINCE",
    token: "",
    repo_name: "",
    action: "new",
    commit_msg: ""
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      console.log('Sending request to:', `${API}/gitpush`);
      console.log('Request data:', { ...formData, token: '***hidden***' });
      
      const response = await axios.post(`${API}/gitpush`, formData, {
        timeout: 120000, // 2 minutes timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response:', response.data);
      setResult(response.data);
    } catch (error) {
      console.error('GitPush error:', error);
      
      let errorMessage = 'Unknown error occurred';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.detail || error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response received
        errorMessage = `Network Error: Cannot connect to server at ${API}/gitpush. Please check if the backend is running.`;
      } else {
        // Error setting up request
        errorMessage = error.message;
      }
      
      setResult({
        success: false,
        error: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header" data-testid="gitpush-header">
        <div className="gitpush-header-content">
          <button
            onClick={() => navigate("/")}
            className="gitpush-back-btn"
            data-testid="gitpush-back-btn"
            aria-label="Back to home"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="header-center-gitpush">
            <h1 className="logo">PRO STREAM</h1>
            <p className="tagline">Git Push Tool</p>
          </div>
          <button
            onClick={toggleTheme}
            className="theme-toggle github-green"
            data-testid="gitpush-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="gitpush-main-content">
        <div className="gitpush-full-container">
          <div className="gitpush-form-card">
            <div className="card-header">
              <h2>Push Code to GitHub</h2>
              <p>Fill in your GitHub details to push your code</p>
            </div>

            <form onSubmit={handleSubmit} className="gitpush-form">
              <div className="form-group">
                <label htmlFor="username">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  GitHub Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="your-username"
                  disabled
                  required
                  data-testid="username-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="token">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Personal Access Token
                </label>
                <div className="password-input">
                  <input
                    type={showToken ? "text" : "password"}
                    id="token"
                    name="token"
                    value={formData.token}
                    onChange={handleChange}
                    placeholder="ghp_xxxxxxxxxxxx"
                    required
                    data-testid="token-input"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowToken(!showToken)}
                  >
                    {showToken ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <small>Get your token from GitHub Settings → Developer settings → Personal access tokens</small>
              </div>

              <div className="form-group">
                <label htmlFor="action">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                  Repository Type
                </label>
                <div className="radio-group-horizontal">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="action"
                      value="new"
                      checked={formData.action === "new"}
                      onChange={handleChange}
                      data-testid="radio-new"
                    />
                    <span>New</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="action"
                      value="overwrite"
                      checked={formData.action === "overwrite"}
                      onChange={handleChange}
                      data-testid="radio-overwrite"
                    />
                    <span>Overwrite</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="repo_name">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  Repository Name
                </label>
                <input
                  type="text"
                  id="repo_name"
                  name="repo_name"
                  value={formData.repo_name}
                  onChange={handleChange}
                  placeholder="my-awesome-project"
                  required
                  data-testid="repo-name-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="commit_msg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Commit Message (Optional)
                </label>
                <input
                  type="text"
                  id="commit_msg"
                  name="commit_msg"
                  value={formData.commit_msg}
                  onChange={handleChange}
                  placeholder="Initial commit"
                  data-testid="commit-msg-input"
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading} data-testid="submit-btn">
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Pushing to GitHub...</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </svg>
                    <span>Push to GitHub</span>
                  </>
                )}
              </button>
            </form>

            {result && (
              <div className={`result-box ${result.success ? "success" : "error"}`} data-testid="result-box">
                <div className="result-header">
                  {result.success ? (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <h3>Success!</h3>
                    </>
                  ) : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                      <h3>Failed!</h3>
                    </>
                  )}
                </div>
                <div className="result-content">
                  <pre>{result.output || result.error}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default GitPush;