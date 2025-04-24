import { Link } from "react-router-dom";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import "./stylesheets/navbar.css";
import LOGO from "./assets/Wardrobe_App_Logo.png";

function Navbar({setToken, token}) {
  const navigate = useNavigate();
  
  function handleClick() {
    setToken(null);
    localStorage.removeItem('token');
    navigate(`/`);
  }


  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={LOGO} alt="Home" height="80rem" />
        </Link>
      </div>
      {!token && (<div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
      </div>)}
      {token && (<div className="nav-links">
          <button onClick={handleClick}>Log Out</button>
      </div>)}
    </nav>
);
}

export default Navbar;