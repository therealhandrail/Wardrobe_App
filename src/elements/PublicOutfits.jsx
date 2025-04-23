import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import "../stylesheets/home.css";


// Change to API Fetch when available
function PublicOutfits() {
  const [publicOutfits] = useState([
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
    }
  ]);

  // Fetching Public Outfits ////////////////////////////////////////////////////////

    const [outfits, setOutfits] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
      const fetchPublicOutfits = async () => {
        try {
          const response = await getPublicOutfits();
          console.log("Public outfits fetched:", response.data);
        } catch (error) {
          console.error("Error fetching public outfits:", error);
        }
      }
      fetchPublicOutfits();
    }
    , []);

  // Handle Search ////////////////////////////////////////////////////////

  const filteredOutfits = useMemo(() => {
    if(!searchTerm) {
      return outfits;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return outfits.filter(outfit => {
      const nameMatch = outfit.name?.toLowerCase().includes(lowerCaseSearchTerm);
      const descriptionMatch = outfit.description?.toLowerCase().includes(lowerCaseSearchTerm);
      const tagsMatch = outfit.tags?.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm));
      return nameMatch || descriptionMatch || tagsMatch;
    });
  }, [outfits, searchTerm]);



  return (
      <div className="publicBox">
        {/* Change logic to refer to api call istead of table */}

        <input
          type="text"
          placeholder="Search outfits by name, description, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchBar"
        />
        <div className="publicOutfitPreview">
        {publicOutfits.map((outfit) => (
          <div className="publicOutfitList" key={ outfit.id }>
            <Link to={`/outfit/${outfit.id}`}> 
            {/* Change to filteredOutfits.id after API */}
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
export default PublicOutfits;

