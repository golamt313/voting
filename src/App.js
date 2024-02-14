import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import UserManagement from './components/UserManagement';
import Sidebar from './components/Sidebar'; // Adjust the import path if necessary
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './App.css'; // Ensure you have an App.css for styling or adjust as needed
import './styles/Sidebar.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false); // Continue to manage superadmin state
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken(true).then(() => {
          user.getIdTokenResult().then((idTokenResult) => {
            setIsSuperAdmin(!!idTokenResult.claims.superadmin);
          });
        });
      } else {
        setIsSuperAdmin(false);
      }
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="app-container"> {/* Wrapper for layout */}
        <Sidebar isSuperAdmin={isSuperAdmin} /> {/* Pass isSuperAdmin if needed to control visibility of items */}
        <div className="content">
          <Navbar currentUser={currentUser} isSuperAdmin={isSuperAdmin} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            {currentUser && <Route path="/forgotpassword" element={<ForgotPassword />} />}
            {isSuperAdmin && <Route path="/usermanagement" element={<UserManagement />} />}
            {!isSuperAdmin && <Route path="/usermanagement" element={<Navigate to="/" replace />} />}
            {/* Additional routes for "Elections" and other sections as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;