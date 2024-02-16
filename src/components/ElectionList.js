import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import ElectionItem from './ElectionItem';

const ElectionList = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  // Function to fetch elections from Firestore based on the user's role
  const fetchElections = async () => {
    setLoading(true); // Begin loading
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error('No user logged in');
      setLoading(false); // End loading if no user is found
      return;
    }

    const idTokenResult = await user.getIdTokenResult();
    const isSuperAdmin = !!idTokenResult.claims.superadmin;

    let electionsQuery;
    if (isSuperAdmin) {
      // Superadmins can see all elections
      electionsQuery = query(collection(db, "elections"));
    } else {
      // Regular admins see only their elections
      electionsQuery = query(collection(db, "elections"), where("adminId", "==", user.uid));
    }

    const electionSnapshot = await getDocs(electionsQuery);
    const electionList = electionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setElections(electionList);
    setLoading(false); // End loading
  };

  // Fetch elections when the component mounts
  useEffect(() => {
    fetchElections();
  }, []);

  if (loading) {
    return <div>Loading elections...</div>; // Display loading state
  }

  return (
    <div>
      {elections.length > 0 ? (
        elections.map(election => (
          <ElectionItem 
            key={election.id} 
            election={election} 
            refreshElections={fetchElections} // Directly pass fetchElections for refresh
          />
        ))
      ) : (
        <p>No elections found.</p> // Show message if no elections are found
      )}
    </div>
  );
};

export default ElectionList;
