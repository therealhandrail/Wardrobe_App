import { Link } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getUserOutfits } from "../client/api.js";
import { useAuth } from "../client/authContext";
import "../stylesheets/home.css";
import LOGO from "../assets/Wardrobe_App_Logo.png";

function MyOutfitBox() {
  const [outfits, setOutfits] = useState([]);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetching User Outfits ////////////////////////////////////////////////////////

  const fetchOutfits = useCallback(async () => {
    if (!user || !user.id) {
      setOutfits([]);
      return;
    }
    setError(null);
    try {
      console.log(`Fetching outfits for user ${user.id}`);
      const response = await getUserOutfits(user.id);
      setOutfits(response.data || []);
    } catch (error) {
      console.error("Error fetching user outfits:", error);
      setError("Failed to load your outfits.");
      setOutfits([]);
    }
  }, [user]);

  // this is configured to only show user outfits if the user is authenticated

  useEffect(() => {
    if (isAuthenticated) {
      fetchOutfits();
    } else {
      setOutfits([]);
    }
  }, [fetchOutfits, isAuthenticated]);

  // Filter outfits based on search term ////////////////////////////////////////
  const filteredOutfits = useMemo(() => {
    if (!searchTerm) {
      return outfits;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return outfits.filter((outfit) => {
      const nameMatch = outfit.name
        ?.toLowerCase()
        .includes(lowerCaseSearchTerm);
      const descriptionMatch = outfit.description
        ?.toLowerCase()
        .includes(lowerCaseSearchTerm);
      // The tags need some work. It looks like they are sending to db, but not returning?
      // no 401 or 404 so im not sure yet
      const tagsMatch = outfit.tags?.some((tag) =>
        typeof tag === "string"
          ? tag.toLowerCase().includes(lowerCaseSearchTerm)
          : tag.name?.toLowerCase().includes(lowerCaseSearchTerm)
      );
      return nameMatch || descriptionMatch || tagsMatch;
    });
  }, [outfits, searchTerm]);

  // I wanted to do edits, but I think I'd have to do all new edit pages for each of the items in the outfit
  // skipping the edit section for now, circle back if we have time

  return (
    <div className="leftBoxInterior">
      {!isAuthenticated && <div className="greetingBox">
        <img src={LOGO} alt="Home" height="400rem" />
        <h1>Welcome to Outfitters!</h1>
        <p>To create and save your own wardrobe and outfits, please log in or register for an account.</p>
      </div>}

      {isAuthenticated && <div className="myOutfitBox">
        <input
          type="text"
          placeholder="Search your outfits..."
          className="searchBar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="buttonBox">
          <Link to="/AddOutfitPage">
            <button>Add Outfit</button>
          </Link>
          <Link to="/AddItemPage">
            <button>Add Item</button>
          </Link>
          <Link to="/MyClothing">
            <button>My Clothing</button>
          </Link>

        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="outfitPreview">
          {filteredOutfits.length > 0
            ? filteredOutfits.map((outfit) => (
                <div className="outfitList" key={outfit.id}>
                  <Link to={`/my-outfits/${outfit.id}`}>
                    <h2>{outfit.name || "Untitled Outfit"}</h2>
                  </Link>
                </div>
              ))
            : !error &&
              isAuthenticated &&
              !searchTerm && <p>You haven't created any outfits yet.</p>}
          {!error &&
            isAuthenticated &&
            searchTerm &&
            filteredOutfits.length === 0 && <p>No outfits match your search.</p>}
          {!isAuthenticated && <p>Please log in to see your outfits.</p>}
        </div>
      </div>}
    </div>
  );
}

export default MyOutfitBox;