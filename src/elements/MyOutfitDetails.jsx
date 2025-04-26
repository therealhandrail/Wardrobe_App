import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../client/authContext";
import {
  getOutfitById,
  getOutfitClothing,
  getClothingById,
  updateOutfit,
  deleteOutfit,
} from "../client/api";
import "../stylesheets/outfitDetails.css";

function MyOutfitDetails() {
  const { outfitId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [outfit, setOutfit] = useState(null);
  const [clothingItems, setClothingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!outfitId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setActionError(null);
      try {
        const outfitResponse = await getOutfitById(outfitId);
        const fetchedOutfit =
          outfitResponse.data && outfitResponse.data.length > 0
            ? outfitResponse.data[0]
            : null;

        setOutfit(fetchedOutfit);

        if (fetchedOutfit) {
          const clothingLinksResponse = await getOutfitClothing(outfitId);
          const clothingLinks = clothingLinksResponse.data || [];

          if (clothingLinks.length > 0) {
            const clothingPromises = clothingLinks.map((link) =>
              getClothingById(link.clothing_id)
            );
            const clothingResponses = await Promise.all(clothingPromises);
            const fetchedClothingItems = clothingResponses
              .map((res) =>
                res.data && Array.isArray(res.data) && res.data.length > 0
                  ? res.data[0]
                  : null
              )
              .filter((item) => item != null);

            setClothingItems(fetchedClothingItems);
          } else {
            setClothingItems([]);
          }
        } else {
          setClothingItems([]);
        }
      } catch (err) {
        console.error("Failed to fetch outfit data:", err);
        setOutfit(null);
        setClothingItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [outfitId]);
  if (isLoading) {
    return <div>Loading outfit details...</div>;
  }

  if (!user) {
    return <div>Loading user...</div>;
  }

  if (!outfit) {
    return <div>Outfit not found or access denied.</div>;
  }

  const handleTogglePrivacy = async () => {
    if (!outfit || !user) return;
    setActionError(null);
    const updatedOutfitData = {
      ...outfit,
      share_publicly: !outfit.share_publicly,
      user_id: user.id,
    };
    try {
      const response = await updateOutfit(outfit.id, updatedOutfitData);
      const updatedOutfit =
        response.data && Array.isArray(response.data)
          ? response.data[0]
          : response.data;
      setOutfit(updatedOutfit || outfit);
    } catch (err) {
      console.error("Failed to update outfit privacy:", err);
      setActionError("Could not update privacy setting. Please try again.");
    }
  };

  // const handleToggleWorn = async () => {
  //   if (!outfit || !user) return;
  //   setActionError(null);
  //   const updatedOutfitData = {
  //     ...outfit,
  //     worn_previously: !(outfit.worn_previously ?? false),
  //     user_id: user.id,
  //   };
  //   try {
  //     const response = await updateOutfit(outfit.id, updatedOutfitData);
  //     const updatedOutfit =
  //       response.data && Array.isArray(response.data)
  //         ? response.data[0]
  //         : response.data;
  //     setOutfit(updatedOutfit || outfit);
  //   } catch (err) {
  //     console.error("Failed to update outfit worn status:", err);
  //     setActionError("Could not update worn status. Please try again.");
  //   }
  // };

  const handleDeleteOutfit = async () => {
    if (!outfit || !user) return;
    if (!window.confirm("Are you sure you want to delete this outfit?")) {
      return;
    }
    setActionError(null);
    try {
      await deleteOutfit(outfit.id, { user_id: user.id });
      navigate("/");
    } catch (err) {
      console.error("Failed to delete outfit:", err);
      setActionError("Could not delete outfit. Please try again.");
    }
  };

  return (
    <div className="OutfitContainer">
      <div className="outfitDetailsContainer">
        {" "}
        <h1>{outfit.name || "Untitled Outfit"}</h1>
        {actionError && <p style={{ color: "red" }}>{actionError}</p>}
        <div className="outfitClothingItems">
          <h2>Items in this Outfit:</h2>
          <div className="itemsGrid">
            {clothingItems.length > 0 ? (
              clothingItems.map((item, index) => (
                <div
                  key={`${item?.id || "item"}-${index}`}
                  className="itemCard"
                >
                  <a
                    href={item.store_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={item.clothing_img_link || "/assets/placeholder.png"}
                      alt={item.name || "Clothing item"}
                      style={{ height: "10rem", width: "auto" }}
                    />
                  </a>
                </div>
              ))
            ) : (
              <p>No clothing items found for this outfit.</p>
            )}
          </div>
        </div>
        <div
          className="outfitControls"
        >
          <label>
            <input
              type="checkbox"
              checked={outfit.share_publicly}
              onChange={handleTogglePrivacy}
            />
            Public
          </label>
          {/* <label style={{ marginRight: "1rem" }}>
            <input
              type="checkbox"
              checked={outfit.worn_previously ?? false}
              onChange={handleToggleWorn}
              style={{ marginRight: "0.5rem" }}
            />
            Worn Previously
          </label> */}
          <button onClick={handleDeleteOutfit}>Delete Outfit</button>
        </div>
        {outfit.tags && outfit.tags.length > 0 && (
          <div className="outfitTags">
            <strong>Tags:</strong>{" "}
            {outfit.tags.map((tag, index) => (
              <span key={index} className="tag">
                {typeof tag === "string" ? tag : tag.name || "unknown tag"}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOutfitDetails;