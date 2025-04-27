import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import "../stylesheets/home.css";
import { getPublicOutfits } from "../client/api";

// Fetching Public Outfits ////////////////////////////////////////////////////////
function PublicOutfits() {
  const [outfits, setOutfits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicOutfits = async () => {
      setError(null);
      try {
        const response = await getPublicOutfits();
        console.log("Public outfits fetched:", response.data);
        setOutfits(response.data || []);
      } catch (error) {
        console.error("Error fetching public outfits:", error);
        setError("Failed to load outfits.");
        setOutfits([]);
      }
    };
    fetchPublicOutfits();
  }, []);

  // Handle Search ////////////////////////////////////////////////////////

  const filteredOutfits = useMemo(() => {
    if (!searchTerm) {
      return outfits;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Might have to adjust based on how we input the tags
    return outfits.filter((outfit) => {
      const nameMatch = outfit.name
        ?.toLowerCase()
        .includes(lowerCaseSearchTerm);
      const descriptionMatch = outfit.description
        ?.toLowerCase()
        .includes(lowerCaseSearchTerm);
      const tagsMatch = outfit.tags?.some((tag) =>
        typeof tag === "string"
          ? tag.toLowerCase().includes(lowerCaseSearchTerm)
          : tag.name?.toLowerCase().includes(lowerCaseSearchTerm)
      );
      return nameMatch || descriptionMatch || tagsMatch;
    });
  }, [outfits, searchTerm]);

  return (
    <div className="publicBox">
      <input
        type="text"
        placeholder="Search outfits by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="searchBar"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="publicOutfitPreview">
        {filteredOutfits.length > 0
          ? filteredOutfits.map((outfit) => (
              <div className="publicOutfitList" key={outfit.id}>
                <Link to={`/outfit/${outfit.id}`}>
                  <h2>{outfit.name || "Untitled Outfit"}</h2>
                </Link>
              </div>
            ))
          : !error && <p>No public outfits found.</p>}
      </div>
    </div>
  );
}
export default PublicOutfits;