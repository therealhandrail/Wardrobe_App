import { useState } from "react";
import { deleteClothing } from "../client/api";

function DeleteClothingButton ({clothingId, userId}) {
  const [actionError, setActionError] = useState(null);

   const handleDeleteClothing = async () => {
        if (!window.confirm("Are you sure you want to delete this clothing?")) {
          return;
        }
        setActionError(null);
        try {
          await deleteClothing(clothingId, { user_id: userId });
          window.location.reload();
        } catch (err) {
          console.error("Failed to delete clothing:", err);
          setActionError("Could not delete clothing. Please try again.");
        }
      };

  return (
    <div className="deleteClothing">
      {actionError && <p style={{ color: "red" }}>{actionError}</p>}
      <button onClick={handleDeleteClothing}>Delete</button>
    </div>
  );
}
export default DeleteClothingButton;