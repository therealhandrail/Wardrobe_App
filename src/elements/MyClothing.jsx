import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/myClothing.css";
import { useAuth } from "../client/authContext";
import { getUserClothing } from "../client/api.js";
import DeleteClothingButton from "./DeleteClothingButton.jsx";


function MyClothing () {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [clothing, setClothing] = useState([]);
  const { user, isAuthenticated } = useAuth();

  const fetchClothing = useCallback(async () => {
      if (!user || !user.id) {
        setClothing([]);
        return;
      }
      setError(null);
      try {
        console.log(`Fetching clothing for user ${user.id}`);
        const response = await getUserClothing(user.id);
        setClothing(response.data || []);
      } catch (error) {
        console.error("Error fetching user clothing:", error);
        setError("Failed to load your clothing.");
        setClothing([]);
      }
    }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchClothing();
    } else {
      setClothing([]);
    }
  }, [fetchClothing, isAuthenticated]);

  return (
    <div className="myClothing">
      <h1>My Clothing</h1>
      {error && <p className='clothingPullError'>{error}</p>}
      {!error && isAuthenticated && <div className="clothingList">
        {clothing.map((clothing) => (
          <div key={clothing.id} className="clothingPiece">
            <a href={clothing.store_link || "#"} target="_blank" className="clothingImgCard">
              <img src={clothing.clothing_img_link} alt={clothing.name} />
            </a>        
            <h3>{clothing.name}</h3>
            <p>Type: {clothing.clothing_type}</p>
            <DeleteClothingButton clothingId={clothing.id} userId={clothing.user_id}/>
          </div>
        ))}
      </div>}
    </div>
  );
}

export default MyClothing;