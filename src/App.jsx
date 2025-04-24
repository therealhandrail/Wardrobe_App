import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./stylesheets/app.css";
import Navbar from "./Navbar";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import AddItemPage from "./elements/AddItemPage";
import AddOutfitPage from "./elements/AddOutfitPage";
import MyOutfitDetails from "./elements/MyOutfitDetails";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
        setToken(storedToken);
  }

});
  
  
  return (
    <div className="App">
      <Navbar setToken={setToken} token={token}/>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login setToken={setToken}/>} />
          <Route path="/Register" element={<Register />} />
          <Route path="/AddItemPage" element={<AddItemPage token={token}/>} />
          <Route path="/AddOutfitPage" element={<AddOutfitPage token={token}/>} />
          <Route path="/outfit/:id" element={<MyOutfitDetails token={token}/>} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
