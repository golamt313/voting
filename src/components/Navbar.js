import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import '../styles/Navbar.css';

const Navbar = ({ currentUser }) => {
  const [logoutSuccess, setLogoutSuccess] = useState('');
  const [fadeOut, setFadeOut] = useState(false); // State to control fade-out effect

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setLogoutSuccess('You have been logged out successfully.');
      setFadeOut(false); // Reset fade-out for the next logout
      
      setTimeout(() => {
        setFadeOut(true); // Start fade-out after 2 seconds
        setTimeout(() => setLogoutSuccess(''), 1000); // Remove message after fade-out completes
      }, 2000);
    }).catch((error) => {
      console.error('Sign out error:', error);
    });
  };

  return (
    <div className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        {!currentUser && <li><Link to="/signin">Sign In</Link></li>}
        {!currentUser && <li><Link to="/signup">Sign Up</Link></li>}
        {currentUser && <li style={{color: 'white'}}>{currentUser.email}</li>}
        {currentUser && <li><button onClick={handleSignOut}>Sign Out</button></li>}
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
