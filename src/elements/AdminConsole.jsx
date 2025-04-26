import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../client/authContext';
import { getAllUsers } from '../client/api';
import "../stylesheets/home.css";

function AdminConsole() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (isAuthenticated !== null) {
      setIsAuthLoading(false);
    }

    if (!isAuthLoading && (!isAuthenticated || (user && !user.is_admin))) {
      console.log('AdminConsole: Redirecting non-admin user.');
      navigate('/');
    }
  }, [user, isAuthenticated, isAuthLoading, navigate]);

//admin check here

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user?.is_admin) {
      const fetchUsers = async () => {
        setIsFetchingUsers(true);
        setFetchError(null);
        try {
          console.log("AdminConsole: Fetching all users...");
          const response = await getAllUsers();
          setUsers(response.data || []);
          console.log("AdminConsole: Users fetched successfully.", response.data);
        } catch (error) {
          console.error("AdminConsole: Error fetching users:", error);
          setFetchError(error.response?.data?.message || "Failed to fetch users.");
          setUsers([]);
        } finally {
          setIsFetchingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [isAuthLoading, isAuthenticated, user]);

  if (isAuthLoading) {
    return <div>Loading or checking permissions...</div>;
  }

  if (!isAuthenticated || !user?.is_admin) {
    return <div>Access Denied.</div>; 
  }

  return (
    <div className='admin'>
      <h1>Admin Console</h1>
      <p>Welcome, Admin {user.username || user.id}!</p>

      <hr />

      <h2>Registered Users</h2>
      {isFetchingUsers && <p>Loading users...</p>}
      {fetchError && <p style={{ color: 'red' }}>Error: {fetchError}</p>}
      {!isFetchingUsers && !fetchError && (
        <ul>
          {users.length > 0 ? (
            users.map((u) => (
              <li key={u.id}>
                <span>{u.username || '[No Username]'}</span> - <span>ID: {u.id}</span>
              </li>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default AdminConsole;

