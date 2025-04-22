import { Link } from "react-router-dom";
import AddItemPage from "./AddItemPage";
import AddOutfitPage from "./AddOutfitPage";
import "../stylesheets/home.css";

function myOutfitBox() {
  return (
    <div className="myOutfitBox">
      <input type="text" placeholder="Search..." className="searchBar" />
      <div className="buttonBox">
        <Link to="/AddOutfitPage">
          <button>Add Outfit</button>
        </Link>
        <Link to="/AddItemPage">
          <button>Add Item</button>
        </Link>
        <Link>
          <button>Random Outfit</button>
        </Link>
      </div>
      <div className="outfitItems"></div>
    </div>
  );
}
export default myOutfitBox;
