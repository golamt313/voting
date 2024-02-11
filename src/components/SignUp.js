// SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for storing error message
  const [success, setSuccess] = useState(''); // State for storing success message
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Account created successfully! Redirecting to sign in...'); // Set success message
      setError(''); // Clear any previous errors
      setTimeout(() => navigate('/signin'), 3000); // Redirect to sign in after 3 seconds
    } catch (error) {
      setError(error.message); // Set error message
      setSuccess(''); // Clear any previous success message
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default SignUp;
