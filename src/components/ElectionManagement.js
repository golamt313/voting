import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import ElectionList from './ElectionList';
import AddElectionForm from './AddElectionForm';

const ElectionManagement = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchElections = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "elections"), where("adminId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const fetchedElections = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setElections(fetchedElections);
      } catch (error) {
        console.error("Error fetching elections:", error);
      }
      setLoading(false);
    };

    fetchElections();
  }, [auth.currentUser.uid, db]);

  return (
    <div>
      <h1>Manage Elections</h1>
      {loading ? <p>Loading elections...</p> : <ElectionList elections={elections} />}
      <AddElectionForm />
    </div>
  );
};

export default ElectionManagement;
