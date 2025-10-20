import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; // Axios instance

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Call backend login
      const res = await API.post("/auth/login", { email, password });

      // Backend returns { user: { email, role } }
      const user = res.data.user;

      if (!user) {
        setError("Login failed: invalid response from server");
        return;
      }

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Update App state so Routes react immediately
      if (setUser) setUser(user);

      // Redirect based on role
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "staff") navigate("/staff");
      else setError("User role not recognized");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <img
        src="Sahrdayaheader.png"
        alt="Sahrdaya Header"
        style={{ width: "100%", maxWidth: "800px", height: "auto" }}
      />
      <div className="col-md-4 offset-md-4 card p-4 shadow-sm">
        <h4 className="text-center mb-3">Department Dashboard Login</h4>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-danger mb-2">{error}</div>}
          <button className="btn btn-primary w-100">Login</button>
        </form>

       
      </div>
    </div>
  );
}
