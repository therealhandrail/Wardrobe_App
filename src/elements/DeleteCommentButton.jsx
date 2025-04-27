import { useState } from "react";
import { deleteComment } from "../client/api";
import { useNavigate } from "react-router-dom";

function DeleteCommentButton ({userId, commentId}) {
  const [actionError, setActionError] = useState(null);

   const handleDeleteComment = async () => {
        if (!window.confirm("Are you sure you want to delete this comment?")) {
          return;
        }
        setActionError(null);
        try {
          await deleteComment(userId, commentId);
          window.location.reload();
        } catch (err) {
          console.error("Failed to delete comment:", err);
          setActionError("Could not delete comment. Please try again.");
        }
      };

  return (
    <div className="deleteComment">
      {actionError && <p style={{ color: "red" }}>{actionError}</p>}
      <button onClick={handleDeleteComment}>Delete</button>
    </div>
  );
}
export default DeleteCommentButton;