import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const AddElectionForm = () => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const db = getFirestore();
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "elections"), {
        name,
        startDate,
        endDate,
        adminId: auth.currentUser.uid // Link the election to the current user as the admin
      });
      console.log("Document written with ID: ", docRef.id);
      // Reset form or give feedback
    } catch (error) {
      console.error("Error adding election: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Election Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Start Date:
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </label>
      <label>
        End Date:
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </label>
      <button type="submit">Add Election</button>
    </form>
  );
};

export default AddElectionForm;
