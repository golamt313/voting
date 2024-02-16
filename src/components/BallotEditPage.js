// BallotEditPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const BallotEditPage = () => {
  const { electionId, ballotId } = useParams();
  const navigate = useNavigate();
  const [ballotDetails, setBallotDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBallotAndVerifyAccess = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;
  
      if (!user) {
        navigate('/signin'); // Redirect if not logged in
        return;
      }
  
      // Assuming 'electionId' is stored in each ballot document
      // First, fetch the ballot document to retrieve 'electionId'
      const ballotRef = doc(db, `elections/${electionId}/ballots`, ballotId);
      const ballotSnapshot = await getDoc(ballotRef);
  
      if (!ballotSnapshot.exists()) {
        setError('Ballot does not exist.');
        setLoading(false);
        return;
      }
  
      const ballotData = ballotSnapshot.data();
      const isCreator = ballotData.creatorId === user.uid;
      const idTokenResult = await user.getIdTokenResult();
      const isSuperAdmin = !!idTokenResult.claims.superadmin;
  
      if (!isCreator && !isSuperAdmin) {
        setError('You do not have permission to edit this ballot.');
        setLoading(false);
        return;
      }
  
      setBallotDetails(ballotData);
      setLoading(false);
    };
  
    fetchBallotAndVerifyAccess();
  }, [navigate, electionId, ballotId]);

    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Edit Ballot: {ballotDetails.name}</h2>
            {/* Here you would have form fields to edit the ballot details, such as name, options, etc. */}
            <form>
            {/* Example form field for ballot name */}
            <label>
            Ballot Name: <input type="text" value={ballotDetails.name} readOnly />
            </label>
            {/* Additional form fields for editing other ballot properties */}
            </form>
        </div>
    );
};
    
export default BallotEditPage;