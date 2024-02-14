// BallotsList.js

import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import '../styles/Ballot.css';

const BallotsList = ({ electionId }) => {
  const [ballots, setBallots] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchBallots = async () => {
      const querySnapshot = await getDocs(collection(db, "elections", electionId, "ballots"));
      setBallots(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchBallots();
  }, [electionId]);

  const handleDelete = async (ballotId) => {
    await deleteDoc(doc(db, "elections", electionId, "ballots", ballotId));
    setBallots(ballots.filter(ballot => ballot.id !== ballotId)); // Update state to reflect deletion
  };

  // Placeholder for handling updates, similar to delete but with an update form
  // const handleUpdate = async (ballotId, newName) => { ... };

  return (
    <div>
      <h3>Ballots</h3>
      {ballots.map(ballot => (
        <div key={ballot.id}>
          <p>{ballot.name}</p>
          {/* Placeholder for an update form or functionality */}
          <button onClick={() => handleDelete(ballot.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default BallotsList;
