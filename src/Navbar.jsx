import { Link } from "react-router-dom";
import "./stylesheets/navbar.css";
import LOGO from "./assets/Wardrobe_App_Logo.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={LOGO} alt="Home" height="80rem" />
        </Link>
      </div>
      <div className="namebar">
        <Link to="./Login">Login</Link>
        <Link to="./Register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
