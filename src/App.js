import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import UserManagement from './components/UserManagement';
import ElectionManagement from './components/ElectionManagement'; // Make sure to import your ElectionManagement
import Sidebar from './components/Sidebar';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './App.css';
import './styles/Sidebar.css';
import ElectionSettings from './components/ElectionSettings';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Added to track admin status

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken(true).then(() => {
          user.getIdTokenResult().then((idTokenResult) => {
            // Check both admin and superadmin claims
            const isUserSuperAdmin = !!idTokenResult.claims.superadmin;
            const isUserAdmin = !!idTokenResult.claims.admin || isUserSuperAdmin; // Consider superadmin as admin as well
            setIsSuperAdmin(isUserSuperAdmin);
            setIsAdmin(isUserAdmin); // Update state based on claims
          });
        });
      } else {
        setIsSuperAdmin(false);
        setIsAdmin(false); // Reset on logout
      }
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Sidebar isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} /> {/* Pass isAdmin to Sidebar */}
        <div className="content">
          <Navbar currentUser={currentUser} isSuperAdmin={isSuperAdmin} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            {currentUser && <Route path="/forgotpassword" element={<ForgotPassword />} />}
            {(isSuperAdmin || isAdmin) && <Route path="/usermanagement" element={<UserManagement />} />}
            {(isSuperAdmin || isAdmin) && <Route path="/electionmanagement" element={<ElectionManagement />} />}
            {(isSuperAdmin || isAdmin) && <Route path="/electionsettings" element={<ElectionSettings />} />}
            {/* Redirect unauthorized access */}
            <Route path="/electionsettings" element={<Navigate to="/" />} />
            <Route path="/electionmanagement" element={<Navigate to="/" />} />
            {/* Additional routes */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
