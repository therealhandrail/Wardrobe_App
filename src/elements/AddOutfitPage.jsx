import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserClothing,
  createOutfit,
  addClothingToOutfit,
  addOutfitTag,
} from "../client/api";
import { useAuth } from "../client/authContext";
import "../stylesheets/addOutfitForm.css";

const AddOutfitPage = () => {
  const [userItems, setUserItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [itemsError, setItemsError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState("");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!isAuthenticated || !user?.id) {
        setLoadingItems(false);
        setUserItems([]);
        return;
      }
      setLoadingItems(true);
      setItemsError(null);
      try {
        const response = await getUserClothing(user.id);
        setUserItems(response.data || []);
      } catch (error) {
        console.error("Error fetching user items:", error);
        setItemsError("Failed to load your clothing items.");
        setUserItems([]);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchUserItems();
  }, [user, isAuthenticated]);

  const handleItemSelect = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else if (selectedItems.length < 10) {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccess("");

    if (!isAuthenticated || !user?.id) {
      setSubmitError("You must be logged in to create an outfit.");
      return;
    }
    if (selectedItems.length === 0) {
      setSubmitError("Please select at least one clothing item for the outfit.");
      return;
    }

    const outfitData = {
      name: name,
      user_id: user.id,
      previously_worn: false,
      share_publicly: !isPrivate
    };

    console.log("Submitting outfit data:", outfitData);

    try {
      const outfitResponse = await createOutfit(outfitData);
      const newOutfitId = outfitResponse.data.id;
      console.log("New outfit created with ID:", newOutfitId);

      const addClothingPromises = selectedItems.map((itemId) =>
        addClothingToOutfit(newOutfitId, itemId)
      );
      await Promise.all(addClothingPromises);
      console.log("Items added to outfit successfully.");

      if (tags.trim() !== "") {
        const tagArray = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "");
        if (tagArray.length > 0) {
          const tagPromises = tagArray.map((tag) =>
            addOutfitTag(newOutfitId, { name: tag })
          );
          await Promise.all(tagPromises);
          console.log("Outfit tags added.");
        }
      }

      setSuccess(`Outfit '${name}' created successfully!`);
      setName("");
      setTags("");
      setIsPrivate(false);
      setSelectedItems([]);
      
      navigate(`/outfit/${newOutfitId}`);

    } catch (error) {
      console.error("Error creating outfit:", error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      setSubmitError(error.response?.data?.message || "Error creating outfit. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }
  // End of core functionality /////////////////////////////////////////////////////

  return (
    <div className="addOutfitBox">
      <h2>Create New Outfit</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
      
      <form className="addOutfitForm" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Details</h3>
          <div>
            <label htmlFor="outfitName">Outfit Name:</label>
            <input
              id="outfitName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Summer Casual"
            />
          </div>
          <div>
            <label htmlFor="outfitTags">Tags (comma-separated):</label>
            <input
              id="outfitTags"
              type="text"
              placeholder="e.g., beach, vacation, sunny"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="isPrivate" className="checkbox-label">
              <input
                id="isPrivate"
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <span>Make this outfit private? (Will not be shared publicly)</span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Select Items (Max 10)</h3>
          {loadingItems && <p>Loading your items...</p>}
          {itemsError && <p style={{ color: 'red' }}>{itemsError}</p>}
          {!loadingItems && !itemsError && userItems.length === 0 && (
            <p>You haven't added any clothing items yet! <a href="/AddItemPage">Add some now?</a></p>
          )}
          {!loadingItems && userItems.length > 0 && (
            <div className="itemSelectionBox">
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
                      src={item.image_url || './assets/placeholder.png'}
                      alt={item.name || 'Clothing item'}
                      className="itemSelectImage"
                    />
                    <span>{item.name || 'Unnamed Item'}</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="submitBtn"
          disabled={selectedItems.length === 0 || loadingItems}
        >
          Create Outfit
        </button>
      </form>
    </div>
  );
};
export default AddOutfitPage;