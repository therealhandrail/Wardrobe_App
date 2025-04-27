import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getOutfitById,
  getOutfitClothing,
  getClothingById,
  getOutfitComments,
} from "../client/api";
import CommentBox from "./CommentBox";
import "../stylesheets/outfitDetails.css";
import PullUsername from "./PullUsername";

function PublicOutfitDetails() {
  const { outfitId } = useParams();
  const [outfit, setOutfit] = useState(null);
  const [clothingItems, setClothingItems] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!outfitId) {
        setError("Outfit ID is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const outfitResponse = await getOutfitById(outfitId);
        const fetchedOutfit = outfitResponse.data?.[0];
        setOutfit(fetchedOutfit);

        if (fetchedOutfit) {
          try {
            const clothingLinksResponse = await getOutfitClothing(outfitId);
            const clothingLinks = clothingLinksResponse.data || [];
            if (clothingLinks.length > 0) {
              const clothingPromises = clothingLinks.map((link) =>
                getClothingById(link.clothing_id)
              );
              const clothingResponses = await Promise.allSettled(
                clothingPromises
              );
              const fetchedClothingItems = clothingResponses
                .filter(
                  (result) =>
                    result.status === "fulfilled" && result.value.data?.[0]
                )
                .map((result) => result.value.data[0]);
              setClothingItems(fetchedClothingItems);
            } else {
              setClothingItems([]);
            }
          } catch (clothingError) {
            console.error("Failed to fetch clothing items:", clothingError);
            setClothingItems([]);
          }

          try {
            const commentsResponse = await getOutfitComments(outfitId);
            setComments(commentsResponse.data || []);
          } catch (commentsError) {
            console.error("Failed to fetch comments:", commentsError);
            setComments([]);
          }
        } else {
          setError("Outfit not found.");
          setOutfit(null);
          setClothingItems([]);
          setComments([]);
        }
      } catch (err) {
        console.error("Failed to fetch outfit data:", err);
        setError("Failed to load outfit details. Please try again later.");
        setOutfit(null);
        setClothingItems([]);
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [outfitId]);

  if (isLoading) {
    return <div className="loading-message">Loading outfit details...</div>;
  }

  if (error && !outfit) {
    return <div className="error-message">{error}</div>;
  }

  if (!outfit) {
    return <div className="not-found-message">Outfit not found.</div>;
  }

  return (
    <div className="OutfitContainer">
      <div className="outfitDetailsContainer">
        <h1>{outfit.name || "Untitled Outfit"}</h1>
        <div className="outfitOwner">
          <h3>Created By: </h3>
          <PullUsername userId={outfit.user_id}/>
        </div>
        {error && (
          <p className="error-message" style={{ color: "orange" }}>
            {error}
          </p>
        )}
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

        <div className="outfitCommentsSection">
          <h2>Comments</h2>
          {comments.length > 0 ? (
            <CommentBox
              outfitId={outfitId}
              commentId={comments[0].id || comments[0]._id}
            />
          ) : (
            <p>No comments yet!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicOutfitDetails;