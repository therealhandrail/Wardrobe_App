import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  getUserOutfits,
} from "../client/api.js";
import { useAuth } from "../client/authContext";
import "../stylesheets/home.css";

function MyOutfitBox() {
  const [outfits, setOutfits] = useState([]);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

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

// I wanted to do edits, but I think I'd have to do all new edit pages for each of the items in the outfit
// skipping the edit section for now, circle back if we have time

return (
  <div className="myOutfitBox">
    <input type="text" placeholder="Search your outfits..." className="searchBar" />
    <div className="buttonBox">
      <Link to="/AddOutfitPage">
        <button>Add Outfit</button>
      </Link>
      <Link to="/AddItemPage">
        <button>Add Item</button>
      </Link>
    </div>

    {error && <p style={{ color: 'red' }}>{error}</p>}

    <div className="outfitPreview">
      {outfits.length > 0 ? (
        outfits.map((outfit) => (
          <div className="outfitList" key={outfit.id}>
            <Link to={`/outfit/${outfit.id}`}>
              <h2>{outfit.name || "Untitled Outfit"}</h2>
              <p>{outfit.description || "No description."}</p>
            </Link>
          </div>
        ))
      ) : (
        !error && isAuthenticated && <p>You haven't created any outfits yet.</p>
      )}
      {!isAuthenticated && <p>Please log in to see your outfits.</p>}
    </div>
  </div>
);
}

export default MyOutfitBox;

