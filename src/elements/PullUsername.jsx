import { useState, useEffect } from "react";
import getUserById from "../client/api";

function PullUsername({ userId }) {
  const [username, setUsername] = useState();

  useEffect(() => {
    try {
      async function fetchUserName() {
        const currentUsername = await getUserById(userId);
        setUsername(currentUsername.username);
      }
      fetchUserName();
    } catch (error) {
      console.error("Error fetching username:", error);
        setError("Failed to pull username.");
        setUsername([]);
    }
  }, []);

  return (
    <h4>{username}</h4>
  )
}
export default PullUsername;