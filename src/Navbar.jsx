import { Link } from "react-router-dom";
import "./stylesheets/navbar.css";
import LOGO from "./assets/Wardrobe_App_Logo.png";

// Theoretically this should work, I'm not sure if we should do the auth in the client folder, or if it's being handles on the backend

function Navbar() {
  // const {isAuthenticated, user, logout} = //

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={LOGO} alt="Home" height="80rem" />
        </Link>
      </div>
      <div className="nav-links">

        {/* {isAuthenticated && user ? (
          // // <>
          //   <div classname="namebar">
          //     {user.isAdmin && <Link to="/admin/dashboard">Admin</Link>}
          //     <span className="userInfo">Welcome, {user.username}!</span>
          //     <button onClick={logout} className="logoutButton">Logout</button>
          //     </div>
          </>
        ) : (
          <> */}
            <div className="namebar">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          {/* </> */}
        {/* // )} */}
      </div>
    </nav>
);
}

export default Navbar;