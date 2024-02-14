import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleChanges, setRoleChanges] = useState({}); // State to track role changes for each user

  // Define fetchUsers at the top level of the component function
  const fetchUsers = async () => {
    const db = getFirestore();
    const usersCollection = collection(db, "users");
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(userList);
    setLoading(false);
  };

  useEffect(() => {
    const auth = getAuth();
    auth.currentUser.getIdTokenResult().then((idTokenResult) => {
      if (idTokenResult.claims.superadmin) {
        fetchUsers(); // Now fetchUsers is defined before being used
      } else {
        setLoading(false);
      }
    });
  }, []);

  const updateUserCredits = async (userId, newCredits) => {
    const db = getFirestore();
    await updateDoc(doc(db, "users", userId), {
      credits: newCredits
    });
    fetchUsers(); // Refresh user data to reflect the credit update
  };

  const deleteUser = async (userId) => {
    const functions = getFunctions();
    const deleteUserAccount = httpsCallable(functions, 'deleteUserAccount');

    deleteUserAccount({ uid: userId })
      .then(() => {
        console.log('User deleted successfully.');
        fetchUsers(); // Refresh user data to reflect the deletion
      })
      .catch((error) => {
        console.error('Error deleting user:', error.message);
      });
  };

  const updateUserRole = async (userId, newRole) => {
    const functions = getFunctions();
    const updateUserRoleFunc = httpsCallable(functions, 'updateUserRole');

    updateUserRoleFunc({ uid: userId, newRole })
      .then(() => {
        console.log(`Role updated to ${newRole} for user ID ${userId}.`);
        fetchUsers(); // Refresh user data to reflect the role change
      })
      .catch((error) => {
        console.error('Error updating user role:', error.message);
      });
  };

  const handleRoleSelectChange = (userId, newRole) => {
    setRoleChanges(prev => ({ ...prev, [userId]: newRole }));
  };

  const handleUpdateRole = (userId) => {
    const newRole = roleChanges[userId];
    updateUserRole(userId, newRole);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Management</h1>
      {users.map(user => (
        <div key={user.id} style={{ marginBottom: '20px' }}>
          <p>Email: {user.email}, Role: current({user.role}), Credits: {user.credits}</p>
          <select value={roleChanges[user.id] || user.role} onChange={(e) => handleRoleSelectChange(user.id, e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
          <button onClick={() => handleUpdateRole(user.id)}>Update Role</button>
          <button onClick={() => updateUserCredits(user.id, user.credits + 1)}>Add Credit</button>
          <button onClick={() => deleteUser(user.id)}>Delete User</button>
        </div>
      ))}
    </div>
  );
};

export default UserManagement;