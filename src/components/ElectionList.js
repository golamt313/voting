import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import ElectionItem from './ElectionItem';

const ElectionList = () => {
  const [elections, setElections] = useState([]);

  // Function to fetch elections from Firestore
  const fetchElections = async () => {
    const db = getFirestore();
    const electionsCollection = collection(db, "elections");
    const electionSnapshot = await getDocs(electionsCollection);
    const electionList = electionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setElections(electionList);
  };

  // Function to refresh the list of elections
  const refreshElections = () => {
    fetchElections();
  };

  // Fetch elections when the component mounts
  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <div>
      {elections.map(election => (
        <ElectionItem 
          key={election.id} 
          election={election} 
          refreshElections={refreshElections} // Pass the function as a prop
        />
      ))}
    </div>
  );
};

export default ElectionList;
