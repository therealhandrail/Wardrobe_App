import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../client/authContext';
import { getAllUsers, getAllClothing } from '../client/api';
import "../stylesheets/adminConsole.css";
import DeleteClothingButton from './DeleteClothingButton';

function AdminConsole() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [clothing, setClothing] = useState([]);
  const [isFetchingClothing, setIsFetchingClothing] = useState(false);
  const [fetchUserError, setFetchUserError] = useState(null);
  const [fetchClothingError, setFetchClothingError] = useState(null);

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
        setFetchUserError(null);
        try {
          const response = await getAllUsers();
          setUsers(response.data || []);
        } catch (error) {
          console.error("AdminConsole: Error fetching users:", error);
          setFetchUserError(error.response?.data?.message || "Failed to fetch users.");
          setUsers([]);
        } finally {
          setIsFetchingUsers(false);
        }
      };

      const fetchClothing = async () => {
        setIsFetchingClothing(true);
        setFetchClothingError(null);
        try {
          console.log("AdminConsole: Fetching all clothing...");
          const response = await getAllClothing();
          setClothing(response.data || []);
          console.log("AdminConsole: Clothing fetched successfully.", response.data);
        } catch (error) {
          console.error("AdminConsole: Error fetching clothing:", error);
          setFetchClothingError(error.response?.data?.message || "Failed to fetch clothing.");
          setClothing([]);
        } finally {
          setIsFetchingClothing(false);
        }
      };

      fetchUsers();
      fetchClothing();
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
      <p>Welcome, admin {user.username}!</p>

      <hr />

      <div className='registeredUsers'>
        <h2>Registered Users</h2>
        {isFetchingUsers && <p>Loading users...</p>}
        {fetchUserError && <p style={{ color: 'red' }}>Error: {fetchError}</p>}
        {!isFetchingUsers && !fetchUserError && (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>ID</th>
                <th>Email</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.is_admin.toString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No users found.</td>
              </tr>
            )}
            </tbody>
          </table>
        )}
      </div>

      <hr />
      
      <div className='allClothingPieces'>
        <h2>All Clothing Pieces</h2>
        {isFetchingClothing && <p>Loading clothing...</p>}
        {fetchClothingError && <p style={{ color: 'red' }}>Error: {fetchError}</p>}
        {!isFetchingClothing && !fetchClothingError && (
          <div className='clothingList'>
            {clothing.map((clothing) => (
              <div key={clothing.id} className="clothingPiece">
                <a href={clothing.store_link || "#"} target="_blank" className="clothingImgCard">
                  <img src={clothing.clothing_img_link} alt={clothing.name} />
                </a>        
                <h3>{clothing.name}</h3>
                <p>Type: {clothing.clothing_type}</p>
                <DeleteClothingButton clothingId={clothing.id} userId={clothing.user_id}/>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default AdminConsole;

