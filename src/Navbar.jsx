import { Link, useNavigate } from "react-router-dom";
import "./stylesheets/navbar.css";
import LOGO from "./assets/Wardrobe_App_Logo.png";
import { useAuth } from "./client/authContext";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(`/`);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={LOGO} alt="Home" height="80rem" />
        </Link>
      </div>
      {isAuthenticated ? (
        <div className="nav-links">
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );

  //   return (
  //     <nav className="navbar">
  //       <div className="logo">
  //         <Link to="/">
  //           <img src={LOGO} alt="Home" height="80rem" />
  //         </Link>
  //       </div>
  //       {!token && (<div className="nav-links">
  //           <Link to="/login">Login</Link>
  //           <Link to="/register">Register</Link>
  //       </div>)}
  //       {token && (<div className="nav-links">
  //           <button onClick={handleLogout}>Log Out</button>
  //       </div>)}
  //     </nav>
  // );
}

export default Navbar;
