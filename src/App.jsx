import { Routes, Route } from "react-router-dom";
import "./stylesheets/app.css";
import Navbar from "./Navbar";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import AddItemPage from "./elements/AddItemPage";
import AddOutfitPage from "./elements/AddOutfitPage";
import MyClothing from "./elements/MyClothing";
import PublicOutfitDetails from "./elements/PublicOutfitDetails";
import MyOutfitDetails from "./elements/MyOutfitDetails";
import AdminConsole from "./elements/AdminConsole";
function App() {
  // I moved the token state stuff from App, to authContext
  // I wrapped the entire app in the AuthProvider component in main.jsx
  // so that the token is available to all components
  // we can use the token in any component that needs it, without having to pass it down as props

  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/AddItemPage" element={<AddItemPage />} />
          <Route path="/AddOutfitPage" element={<AddOutfitPage />} />
          <Route path="/MyClothing" element={<MyClothing />} />
          <Route path="/outfit/:outfitId" element={<PublicOutfitDetails />} />
          <Route path="/my-outfits/:outfitId" element={<MyOutfitDetails />} />
          <Route path="/admin" element={<AdminConsole />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
