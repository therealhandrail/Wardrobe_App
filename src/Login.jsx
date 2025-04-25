import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LOGO from "./assets/Wardrobe_App_Logo.png";
import "./stylesheets/authForm.css";
import { useAuth } from "./client/authContext";
import { loginUser, getMe } from "./client/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const loginResponse = await loginUser({ username, password });

      if (loginResponse.data && loginResponse.data.token) {
        const token = loginResponse.data.token;

        localStorage.setItem("AuthToken", token);

        try {
          const meResponse = await getMe();

          if (meResponse.data) {
            login(meResponse.data, token);
            navigate(`/`);
          } else {
            console.error("Failed to fetch user data after login.");
            setError("Login succeeded but failed to fetch user details.");
            localStorage.removeItem("AuthToken");
          }
        } catch (meErr) {
          console.error("Error fetching user data after login:", meErr);
          setError(
            meErr.response?.data?.message ||
              "An error occurred fetching user details."
          );
          localStorage.removeItem("AuthToken");
        }
      } else {
        console.error("Login response missing token:", loginResponse.data);
        setError(
          loginResponse.data?.message || "Login failed. Unexpected response."
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      const message =
        err.response?.data?.message || "An error occurred during login.";
      setError(message);
    }
  };

  return (
    <div className="authContainer">
      <form className="authHeader" onSubmit={handleSubmit}>
        <img src={LOGO} alt="Home" height="200rem" />
        <h1>Welcome Back!</h1>
        {error && (
          <p className="error-message" style={{ color: "red" }}>
            {error}
          </p>
        )}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submitBtn">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
