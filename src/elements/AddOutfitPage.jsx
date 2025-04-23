import { useState, useEffect } from "react";
import {
  getUserClothing,
  createOutfit,
  addClothingToOutfit,
  addOutfitTag,
} from "../client/api";
import "../stylesheets/addOutfitForm.css";

// We can either import the USER id From the internal auth page as an element or call it directly in the code

const addOutfit = () => {
  const [userItems, setUserItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState(""); // Comma-separated tags
  const [isPrivate, setIsPrivate] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUserItems = async () => {
      // const userId = however we get the user id
      const userId = 1; // Placeholder for user ID
      if (!1) {
        console.error("User ID is not available.");
        return;
      }
      try {
        const response = await getUserClothing(userId); // Change to user.id when fetched
        setUserItems(response.data);
      } catch (error) {
        console.error("Error fetching user items:", error);
      }
    };
    fetchUserItems();
  }, []);

  const handleItemSelect = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const outfitData = {
      name,
      description,
      isPrivate,
    };

    // This is the core functionality /////////////////////////////////////////////////////
    // Create the outfit first
    try {
      const outfitResponse = await createOutfit(outfitData);
      const newOutfitId = outfitResponse.data.id;
      console.log("New outfit created with ID:", newOutfitId);

      // Add selected items to the outfit
      const addClothingPromises = selectedItems.map((itemId) => {
        return addClothingToOutfit(newOutfitId, itemId);
      });
      await Promise.all(addClothingPromises);
      console.log("Items added to outfit successfully.");

      // This is where we add the tags, they need to be added to an array
      if (tags && newOutfitId) {
        const tagArray = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "");
        const tagPromises = tagArray.map((tag) =>
          addOutfitTag(newOutfitId, { name: tag })
        );
        await Promise.all(tagPromises);
        console.log("Outfit tags added.");
      }

      setSuccess(`Outfit '${name}' created successfully!`);
      // Reset Form
      setName("");
      setDescription("");
      setTags("");
      setIsPrivate(false);
      setSelectedItems([]);
      // We can also add a redirect here if needed
    } catch (error) {
      console.error("Error creating outfit:", error);
      setSuccess("Error creating outfit. Please try again.");
    }
  };

  // End of core functionality /////////////////////////////////////////////////////

  return (
    <div className="addOutfitBox">
      <h2>Create New Outfit</h2>
    
      <form className="addOutfitForm" onSubmit={handleSubmit}>
        {/* Outfit Details */}
        <div>
          <label htmlFor="outfitName">Outfit Name:</label>
          <input
            id="outfitName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="outfitDescription">Description:</label>
          <textarea
            id="outfitDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="outfitTags">Tags (comma-separated):</label>
          <input
            id="outfitTags"
            type="text"
            placeholder="e.g., Formal, Winter, Party"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="isPrivate">Private Outfit:</label>
          <input
            id="isPrivate"
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
        </div>

        {/* Item Selection */}
        <h3>Select Items (Max 10)</h3>
        {/* Need to handle for no Items */}


          <div className="itemSelectionBox">
            {" "}
            {/* Style this grid */}
            {userItems.map((item) => (
              <div key={item.id} className="itemSelectItem">
                <input
                  type="checkbox"
                  id={`item-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleItemSelect(item.id)}
                  disabled={
                    selectedItems.length >= 10 &&
                    !selectedItems.includes(item.id)
                  }
                />
                <label htmlFor={`item-${item.id}`}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: "80px", height: "auto" }}
                  />
                  <span>{item.title}</span>
                </label>
              </div>
            ))}
          </div>
        

        <button type="submit" className="submitBtn">Submit</button>
      </form>
    </div>
  );
};
export default addOutfit;
