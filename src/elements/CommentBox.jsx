import React, { useState, useEffect } from "react";
import { getReviewComments, createComment } from "../client/api";
import { useAuth } from "../client/authContext";
import "../stylesheets/comments.css";

function CommentBox({ outfitId, reviewId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!outfitId || !reviewId) {
      setError("Outfit ID and Review ID are required.");
      return;
    }

    const fetchComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getReviewComments(outfitId, reviewId);
        setComments(response.data || []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setError("Failed to load comments. Please try again later.");
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [outfitId, reviewId]);

  const handleInputChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    if (!outfitId || !reviewId) {
      setError("Cannot post comment without Outfit ID and Review ID.");
      return;
    }

    if (!user || !user.id) {
      setError("User not available. Cannot post comment.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const commentData = {
      user_id: user.id,
      comment: newComment,
    };

    try {
      const response = await createComment(outfitId, reviewId, commentData);
      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add console log here to inspect comments state
  console.log('Current comments state:', comments);

  return (
    <div className="comment-box-container">
      <h3>Comments</h3>
      {error && <p className="error-message">{error}</p>}

      <div className="comments-list">
        {isLoading && comments.length === 0 && <p>Loading comments...</p>}
        {!isLoading && comments.length === 0 && !error && (
          <p>No comments yet. Be the first!</p>
        )}
        {comments.map((comment) => (
          <React.Fragment key={comment.id || comment._id}>
            <p className="comment-item">{comment.comment}</p>
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={handleInputChange}
          placeholder="Add a comment..."
          rows="3"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}

export default CommentBox;