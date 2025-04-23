import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import MyOutfitDetails from './MyOutfitDetails';
import {
  getUserOutfits,
  deleteOutfit,
  getOutfitTags,
  getOutfitClothing,
} from "../client/api.js";
import "../stylesheets/home.css";

// Replace this with the actual API call to fetch user outfits

function myOutfitBox() {
  const [userOutfits] = useState([
    {
      id: 1,
      title: "Casual Outfit",
      description: "A casual outfit for everyday wear.",
      tags: ["casual", "everyday"],
      private: false,
    },
    {
      id: 2,
      title: "Formal Outfit",
      description: "A formal outfit for special occasions.",
      tags: ["formal", "special"],
      private: true,
    },
  ]);

  // Fetching User Outfits ////////////////////////////////////////////////////////

  const [outfits, setOutfits] = useState([]);
  const userId = 1; // Placeholder for user ID
  // const { user } = //

  const fetchOutfits = useCallback(async () => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }
    try {
      console.log(`Fetching outfits for ${userId}`); // change both to user.id when fetched
      const response = await getUserOutfits(userId);
      setOutfits(response.data);
    } catch (error) {
      console.error("Error fetching user outfits:", error);
    }
  }, [userId]); // change to "user" when fetched

  useEffect(() => {
    fetchOutfits();
  }, [fetchOutfits]);

// I wanted to do edits, but I think I'd have to do all new edit pages for each of the items in the outfit
// skipping the edit section for now, circle back if we have time

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

      {/* Change logic to refer to api call istead of table */}

      <div className="outfitPreview">
        {userOutfits.map((outfit) => (
          <div className="outfitList" key={outfit.id}>
            <Link to={`/outfit/${outfit.id}`}>
              <h2>{outfit.title}</h2>
              <p>{outfit.description}</p>
              <p>Tags: {outfit.tags.join(", ")}</p>
              <p>Private: {outfit.private ? "Yes" : "No"}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
export default myOutfitBox;
