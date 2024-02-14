import React, { useState } from 'react';
import { getFirestore, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import BallotForm from './BallotForm'; // Component for adding ballots
import BallotsList from './BallotsList'; // Component for displaying ballots
import '../styles/ElectionItem.css'; // Path to CSS file for ElectionItem

const ElectionItem = ({ election, refreshElections }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(election.name);
  const [startDate, setStartDate] = useState(election.startDate);
  const [endDate, setEndDate] = useState(election.endDate);
  const db = getFirestore();

  const toggleExpand = () => {
    // Only toggle if not in editing mode
    if (!editing) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleEditToggle = (e) => {
    e.stopPropagation(); // Prevent the election item from collapsing
    setEditing(!editing);
  };

  const handleEditSave = async (e) => {
    e.stopPropagation(); // Prevent the election item from collapsing
    if (editing) {
      const electionRef = doc(db, "elections", election.id);
      await updateDoc(electionRef, { name, startDate, endDate });
      refreshElections(); // Refresh the list of elections
    }
    setEditing(!editing);
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent the election item from collapsing
    await deleteDoc(doc(db, "elections", election.id));
    refreshElections(); // Refresh the list of elections
  };

  // Stop the propagation for the form to prevent collapsing
  const handleFormInteraction = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="election-item">
      <div className="election-header" onClick={toggleExpand}>
        <h3>{election.name}</h3>
        <div className="election-actions">
          <button onClick={handleEditToggle}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>
      {isExpanded && !editing && (
        <>
          <div className="election-details" onClick={handleFormInteraction}>
            <p>Start Date: {startDate}</p>
            <p>End Date: {endDate}</p>
          </div>
          <BallotsList electionId={election.id} handleFormInteraction={handleFormInteraction} />
          <BallotForm electionId={election.id} handleFormInteraction={handleFormInteraction} />
        </>
      )}
      {editing && (
        <div className="edit-election-form" onClick={handleFormInteraction}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Election Name"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
          <button onClick={handleEditSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default ElectionItem;
