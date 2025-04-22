import { useState } from "react";
import "../stylesheets/addItemForm.css";
import { createClothing } from "../client/api.js";

const addItem = () => {
    const [itemName, setItemName] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [itemTags, setItemTags] = useState("");
    const [imageUrl, setimageUrl] = useState("")
    const [privateToggle, setPrivateToggle] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const itemData = {
            name: itemName,
            description: itemDescription,
            tags: itemTags.split(","),
            imageUrl: imageUrl,
            private: privateToggle,
        };
        console.log(itemData);
        // Add logic to send newItem to the server or update state
        try {
          const response = await createClothing(itemData);
          console.log(response.data);
          navigate("../Home");
        } catch (error) {
          console.error("Error creating item:", error);
        }
    };

    // Image Render Stuff
    const renderImagePreview = () => {
        if (!imageUrl) return null;
        return <img src={imageUrl} alt="Preview" className="image-preview" />;
    }

  return (
    <div className="addItem">
      <form onSubmit={handleSubmit}>
        <h2>Add Item</h2>
        <label htmlFor="itemName">Item Name</label>
        <input 
            id="itemName"
            type="text" 
            placeholder="Enter item name" 
            required 
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
        />
        <label htmlFor="itemImage">Image URL</label>
        <input
          id="imageUrl"
          type="url"
          placeholder="Enter image URL"
          required
          value={imageUrl}
          onChange={(e) => setimageUrl(e.target.value)}
        />
        <label htmlFor="itemDescription">Description</label>
        <textarea 
            id="itemDescription"
            placeholder="Enter item description" 
            required
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
        />
        {/* Change to select input type if pre determined tags */}
        <label htmlFor="itemTags">Tags</label>
        <input 
            id="itemTags"
            type="text" 
            placeholder="Enter a tag. (I.E., Flowy, Crewneck, etc.)" 
            required 
            value={itemTags}
            onChange={(e) => setItemTags(e.target.value)}
            />
        <label htmlFor="privateToggle">Private</label>
        <input 
            id="privateToggle"
            type="checkbox" 
            name="private" 
            value={privateToggle}
            onChange={(e) => setPrivateToggle(e.target.checked)}
            />
            <span>Private?</span>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};
export default addItem;
