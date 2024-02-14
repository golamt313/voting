// Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import '../styles/Navbar.css'; // Make sure the path to the CSS file is correct

const Navbar = ({ currentUser }) => {
  const [logoutSuccess, setLogoutSuccess] = useState('');
  const [fadeOut, setFadeOut] = useState(false);

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setLogoutSuccess('You have been logged out successfully.');
      setTimeout(() => setLogoutSuccess(''), 3000); // Hide the logout success message after 3 seconds
    }).catch((error) => {
      console.error('Sign out error:', error);
    });
  };

  return (
    <div className="navbar">
      <ul>
        {/* Removed the Home link */}
        {currentUser && (
          <>
            <li>{currentUser.email}</li>
            <li><button onClick={handleSignOut}>Sign Out</button></li>
          </>
        )}
        {!currentUser && (
          <>
            <li><Link to="/signin">Sign In</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
      {logoutSuccess && (
        <div className={`success-message ${fadeOut ? 'fade-out' : ''}`}>
          {logoutSuccess}
        </div>
      )}
    </div>
  );
};

export default Navbar;