import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LOGO from "./assets/Wardrobe_App_Logo.png";
import "./stylesheets/authForm.css";

function Login({setToken}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(
      
      "https://wardrobe-app-xb6n.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      }
    );

    const result = await response.json();

    if (result.token) {
      setToken(result.token);
      setError(null);
      localStorage.setItem('token', result.token);
      navigate(`/`);
    } else {
      setError("Invalid Credentials");
    }
  
};

  return (
    <div className="authContainer">
      <form className="authHeader" onSubmit={handleSubmit}>
        <img src={LOGO} alt="Home" height="200rem" />
        <h1>Welcome Back!</h1>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="submitBtn">Login</button>
      </form>
    </div>
  );
}

export default Login;
