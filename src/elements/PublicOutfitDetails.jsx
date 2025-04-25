import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { getOutfitById, getOutfitClothing, getClothingById } from "../client/api"; 
import "../stylesheets/outfitDetails.css";

function PublicOutfitDetails() { 
  const { outfitId } = useParams();
  const [outfit, setOutfit] = useState(null);
  const [clothingItems, setClothingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!outfitId) {
        setIsLoading(false);
        return; 
      }

      setIsLoading(true);
      try {
        const outfitResponse = await getOutfitById(outfitId);
        const fetchedOutfit = outfitResponse.data && outfitResponse.data.length > 0 ? outfitResponse.data[0] : null;
        setOutfit(fetchedOutfit);

        if (fetchedOutfit) {
          const clothingLinksResponse = await getOutfitClothing(outfitId);
          const clothingLinks = clothingLinksResponse.data || []; 
          
          if (clothingLinks.length > 0) {
            const clothingPromises = clothingLinks.map(link => getClothingById(link.clothing_id));
            const clothingResponses = await Promise.all(clothingPromises);
            const fetchedClothingItems = clothingResponses.map(res => 
              res.data && Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null
            ).filter(item => item != null);
            
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

    fetchData();
  }, [outfitId]);
  if (isLoading) {
    return <div>Loading outfit details...</div>;
  }
  if (!outfit) {
    return <div>Outfit not found.</div>;
  }

  return (
    <div className="outfitDetailsContainer"> 
      <h1>{outfit.name || "Untitled Outfit"}</h1>
      {outfit.tags && outfit.tags.length > 0 && (
        <div className="outfitTags">
          <strong>Tags:</strong>{" "}
          {outfit.tags.map((tag, index) => (
            <span key={index} className="tag">
              {typeof tag === 'string' ? tag : tag.name || 'unknown tag'}
            </span>
          ))}
        </div>
      )}
      <div className="outfitClothingItems">
        <h2>Items in this Outfit:</h2>
        <div className="itemsGrid"> 
          {clothingItems.length > 0 ? (
            clothingItems.map((item, index) => ( 
              <div key={`${item?.id || 'item'}-${index}`} className="itemCard"> 
                <a 
                  href={item.store_link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img
                    src={item.clothing_img_link || '/assets/placeholder.png'} 
                    alt={item.name || 'Clothing item'}
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
    </div>
  );
}

export default PublicOutfitDetails;