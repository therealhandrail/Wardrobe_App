import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/addItemForm.css";
import { createClothing } from "../client/api.js";
import { useAuth } from "../client/authContext";

const AddItemPage = () => {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemTags, setItemTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [privateToggle, setPrivateToggle] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
        navigate('/login');
    }
}, [isAuthenticated, navigate]);
// redirect to login if not authenticated

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  if (!isAuthenticated) {
      setError("You must be logged in to add items.");
      return;
  }

  const itemData = {
      name: itemName,
      description: itemDescription,
      tags: itemTags.split(",").map(tag => tag.trim()).filter(tag => tag !== ''),
      image_url: imageUrl,
      is_private: privateToggle,
  };
  
  console.log("Submitting item data:", itemData);

  try {
    const response = await createClothing(itemData);
    console.log("Item created:", response.data);
    navigate("/");
  } catch (err) {
    console.error("Error creating item:", err);
    setError(err.response?.data?.message || "Failed to create item. Please try again.");
  }
};

    // Image Render Stuff
    const renderImagePreview = () => {
      if (!imageUrl) return null;
      try {
          new URL(imageUrl);
          return <img src={imageUrl} alt="Preview" className="image-preview" />;
      } catch (_) {
          return <p style={{color: 'red'}}>Invalid Image URL</p>;
      }
  }
  
  if (!isAuthenticated) {
      return <div>Redirecting to login...</div>;
  }

  return (
    <div className="addItem">
        <form className="addItemForm" onSubmit={handleSubmit}>
            <h2>Add New Clothing Item</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <label htmlFor="itemName">Item Name</label>
            <input 
                id="itemName"
                type="text" 
                placeholder="Enter item name (e.g., Blue T-Shirt)" 
                required 
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
            />
            <label htmlFor="imageUrl">Image URL</label>
            <input
                id="imageUrl"
                type="url"
                placeholder="Enter image URL (e.g., https://...)" 
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
            />
            {renderImagePreview()}
            <label htmlFor="itemDescription">Description</label>
            <textarea 
                id="itemDescription"
                placeholder="Enter item description (optional)" 
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
            />
            <label htmlFor="itemTags">Tags (comma-separated)</label>
            <input 
                id="itemTags"
                type="text" 
                placeholder="Enter tags, separated by commas (e.g., cotton, casual, blue)" 
                value={itemTags}
                onChange={(e) => setItemTags(e.target.value)}
            />
            <label htmlFor="privateToggle" className="checkbox-label">
                <input 
                    id="privateToggle"
                    type="checkbox" 
                    name="privateToggle"
                    checked={privateToggle}
                    onChange={(e) => setPrivateToggle(e.target.checked)}
                />
                <span>Make this item private?</span>
            </label>
            <button type="submit">Add Item</button>
        </form>
    </div>
);
};
export default AddItemPage;
