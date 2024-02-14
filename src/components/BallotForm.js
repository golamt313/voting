// BallotForm.js

import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import '../styles/Ballot.css';

const BallotForm = ({ electionId }) => {
  const [ballotName, setBallotName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const db = getFirestore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "elections", electionId, "ballots"), {
        name: ballotName,
      });
      setBallotName(''); // Clear the form after successful submission
      setSuccessMessage('Ballot added successfully');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error("Error adding ballot: ", error);
      // Optionally, set an error message in a similar manner
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={ballotName}
          onChange={(e) => setBallotName(e.target.value)}
          placeholder="Ballot Name"
        />
        <button type="submit">Add Ballot</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default BallotForm;
