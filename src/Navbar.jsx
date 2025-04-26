import { Link, useNavigate } from "react-router-dom";
import "./stylesheets/navbar.css";
import LOGO from "./assets/Wardrobe_App_Logo.png";
import { useAuth } from "./client/authContext";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

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
        {/* admin check */}
        {user && user.is_admin && (
              <Link to="/admin" className="nav-admin-link">
                Admin Console
              </Link>
            )}
      </div>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <span className="nav-greeting">
              Hi, {user?.username || 'User'}!
            </span>
            <button onClick={handleLogout} className="nav-link-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
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
