import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import getAuth to access the auth state

const BallotForm = ({ electionId }) => {
  const [ballotName, setBallotName] = useState('');
  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth(); // Initialize auth

  const handleAddBallot = async () => {
    const user = auth.currentUser; // Get the currently logged-in user
    if (!user) {
      console.error('No authenticated user found');
      return;
    }

    const ballotData = {
      name: ballotName,
      adminId: user.uid, // Add the adminId field with the UID of the current user
      electionId: electionId, // Store electionId with the ballot
      // Add any additional properties here
    };
    console.log(`Adding ballot with name: ${ballotName}, electionId: ${electionId}, adminId: ${user.uid}`);
    console.log((await user.getIdTokenResult()).claims.admin);
    const docRef = await addDoc(collection(db, `elections/${electionId}/ballots`), ballotData);
    navigate(`/election/${electionId}/ballot/${docRef.id}/edit`);
  };

  return (
    <div>
      <input
        type="text"
        value={ballotName}
        onChange={(e) => setBallotName(e.target.value)}
        placeholder="Enter ballot name"
      />
      <button onClick={handleAddBallot}>Add Ballot</button>
    </div>
  );
};

export default BallotForm;
