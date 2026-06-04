import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function App() {
  // Authentication states
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLogin, setIsLogin] = useState(true);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", role: "candidate" });

  // Jobs states
  const [jobs, setJobs] = useState([]);
  const [jobForm, setJobForm] = useState({ title: "", company: "", location: "", salary: "", type: "Full-time", description: "" });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  // Load jobs when app starts
  useEffect(() => {
    fetchJobs();
    if (token) {
      // Decode minimal dummy info from local storage if user was logged in
      const savedUser = localStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, [token]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/jobs`);
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs");
    }
  };

  // Auth Handlers
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/auth/login`, { email: authForm.email, password: authForm.password });
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setMessage("Logged in successfully! 🎉");
      } else {
        await axios.post(`${API_URL}/auth/register`, authForm);
        setMessage("Registered successfully! Please login now. ✅");
        setIsLogin(true);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Authentication failed ❌");
    }
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMessage("Logged out!");
  };

  // Job Posting Handler
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: token } };
      await axios.post(`${API_URL}/jobs`, jobForm, config);
      setMessage("Job posted successfully! 🚀");
      setJobForm({ title: "", company: "", location: "", salary: "", type: "Full-time", description: "" });
      fetchJobs();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to post job ❌");
    }
  };

  // Search Handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return fetchJobs();
    try {
      const res = await axios.get(`${API_URL}/jobs/search/${search}`);
      setJobs(res.data);
    } catch (err) {
      console.error("Search failed");
    }
  };

  return (
    <div style={{ fontFamily: "Segoe UI, sans-serif", backgroundColor: "#f4f6f9", minHeight: "100vh", padding: "20px" }}>
      {/* Header Banner */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: "15px 30px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
        <h1 style={{ margin: 0, color: "#007bff" }}>💼 India Job Portal</h1>
        {user ? (
          <div>
            <span style={{ marginRight: "15px", fontWeight: "bold" }}>Welcome, {user.name} ({user.role})</span>
            <button onClick={handleLogout} style={{ padding: "8px 15px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Logout</button>
          </div>
        ) : (
          <span style={{ color: "#6c757d" }}>Please log in to manage or post jobs</span>
        )}
      </header>

      {message && <div style={{ backgroundColor: "#e2e3e5", padding: "10px", borderRadius: "5px", marginBottom: "20px", textAlign: "center", fontWeight: "bold" }}>{message}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
        {/* LEFT COLUMN: AUTH & JOB POSTING FORM */}
        <div>
          {/* Auth Section */}
          {!user ? (
            <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
              <h3>{isLogin ? "Login to Account" : "Create Account"}</h3>
              <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {!isLogin && (
                  <input type="text" placeholder="Full Name" required value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
                )}
                <input type="email" placeholder="Email Address" required value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
                <input type="password" placeholder="Password" required value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
                {!isLogin && (
                  <select value={authForm.role} onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })} style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}>
                    <option value="candidate">Candidate (Looking for Job)</option>
                    <option value="employer">Employer (Posting Jobs)</option>
                  </select>
                )}
                <button type="submit" style={{ padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                  {isLogin ? "Sign In" : "Register Now"}
                </button>
              </form>
              <p onClick={() => setIsLogin(!isLogin)} style={{ color: "#007bff", cursor: "pointer", marginTop: "15px", fontSize: "14px", textAlign: "center" }}>
                {isLogin ? "Don't have an account? Register here" : "Already have an account? Login here"}
              </p>
            </div>
          ) : (
            /* Job Posting Form (Only visible to authenticated Employers) */
            user.role === "employer" && (
              <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                <h3>➕ Post a New Job</h3>
                <form onSubmit={handleJobSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input type="text" placeholder="Job Title" required value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                  <input type="text" placeholder="Company Name" required value={jobForm.company} onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                  <input type="text" placeholder="Location (e.g. Mumbai, Chennai, Remote)" required value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                  <input type="text" placeholder="Salary Package (e.g. ₹6,000,000 / year)" required value={jobForm.salary} onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                  <select value={jobForm.type} onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                  <textarea placeholder="Job Description" required rows="4" value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", resize: "none" }}></textarea>
                  <button type="submit" style={{ padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Post Job Listing</button>
                </form>
              </div>
            )
          )}
        </div>

        {/* RIGHT COLUMN: JOB FEED & SEARCH */}
        <div>
          {/* Search Box */}
          <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px" }}>
              <input type="text" placeholder="Search by title, company, or location..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
              <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#17a2b8", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Search</button>
            </form>
          </div>

          {/* Job Listings Loop */}
          <h3>🎯 Available Job Listings ({jobs.length})</h3>
          {jobs.length === 0 ? (
            <p style={{ color: "#6c757d" }}>No jobs found. Be the first to post a job vacancy!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {jobs.map((job) => (
                <div key={job._id} style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", borderLeft: "5px solid #007bff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h4 style={{ margin: "0 0 5px 0", color: "#333", fontSize: "18px" }}>{job.title}</h4>
                      <strong style={{ color: "#495057" }}>🏢 {job.company}</strong>
                    </div>
                    <span style={{ backgroundColor: "#e7f1ff", color: "#007bff", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>{job.type}</span>
                  </div>
                  <p style={{ margin: "10px 0", color: "#6c757d", fontSize: "14px" }}>📍 {job.location} | 💰 {job.salary}</p>
                  <p style={{ margin: "0", color: "#212529", fontSize: "14px", lineHeight: "1.5" }}>{job.description}</p>
                  <button onClick={() => alert("Application submitted successfully! 📄")} style={{ marginTop: "15px", padding: "8px 16px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}>Apply Now</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;