import { useState } from "react";
import "./stylesheets/authForm.css";
import LOGO from "./assets/Wardrobe_App_Logo.png";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./client/api";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const response = await registerUser(userData);

      if (response.data) {
        console.log("Registration successful!", response.data);
        navigate("/login");
      } else {
        console.error("Registration failed:", response);
        setError(
          response.data?.message || "Registration failed. Please try again."
        );
      }
    } catch (err) {
      console.error("Error during registration:", err);
      const message =
        err.response?.data?.message || "An error occurred during registration.";
      setError(message);
    }
  };

  return (
    <div className="authContainer">
      <form className="authHeader" onSubmit={handleSubmit}>
        <img src={LOGO} alt="Home" height="200rem" />
        <h1>Welcome to Outfitter!</h1>
        {error && (
          <p className="error-message" style={{ color: "red" }}>
            {error}
          </p>
        )}
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" className="submitBtn">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
