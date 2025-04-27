import { useState, useEffect } from "react";
import { getUserById } from "../client/api";

function PullUsername({ userId }) {
  const [username, setUsername] = useState();

  useEffect(() => {
    try {
      async function fetchUserName() {
        const currentUserInfo = await getUserById(userId);
        setUsername(currentUserInfo.data[0].username);
      }
      fetchUserName();
    } catch (error) {
      console.error("Error fetching username:", error);
        setError("Failed to pull username.");
        setUsername([]);
    }
  }, []);

  return (
    <p className="username">{username}</p>
  )
}
export default PullUsername;