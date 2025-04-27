import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/addItemForm.css";
import { createClothing } from "../client/api.js";
import { useAuth } from "../client/authContext";

const AddItemPage = () => {
  const [itemName, setItemName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [clothingType, setClothingType] = useState("");
  const [storeLink, setStoreLink] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated || !user?.id) {
      setError("You must be logged in to add items.");
      return;
    }

    const itemData = {
      name: itemName,
      user_id: user.id,
      clothing_type: clothingType,
      store_link: storeLink,
      clothing_img_link: imageUrl,
    };

    console.log("Submitting item data:", itemData);

    try {
      const response = await createClothing(itemData);
      console.log("Item created:", response.data);
      navigate("/");
    } catch (err) {
      console.error("Error creating item:", err);
      if (err.response) {
        console.error("Backend Error Data:", err.response.data);
      }
      const backendError =
        err.response?.data?.error || err.response?.data?.message;
      setError(backendError || "Failed to create item. Please try again.");
    }
  };

  // Image Render Stuff
  const renderImagePreview = () => {
    if (!imageUrl) return null;
    try {
      new URL(imageUrl);
      return (
        <img
          src={imageUrl}
          alt="Preview"
          className="image-preview"
          style={{ height: "20rem" }}
        />
      );
    } catch (_) {
      return <p style={{ color: "red" }}>Invalid Image URL</p>;
    }
  };

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="addItem">
      <form className="addItemForm" onSubmit={handleSubmit}>
        <h2>Add New Clothing Item</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <label htmlFor="itemName">Item Name</label>
        <input
          id="itemName"
          type="text"
          placeholder="Enter item name (e.g., Blue T-Shirt)"
          required
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />

        <label htmlFor="clothingType">Clothing Type</label>
        <input
          id="clothingType"
          type="text"
          placeholder="e.g., Shirt, Pants, Shoes"
          required
          value={clothingType}
          onChange={(e) => setClothingType(e.target.value)}
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

        <label htmlFor="storeLink">Store Link</label>
        <input
          id="storeLink"
          type="url"
          placeholder="Link to where item can be bought (e.g., https://...)"
          required
          value={storeLink}
          onChange={(e) => setStoreLink(e.target.value)}
        />

        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};
export default AddItemPage;