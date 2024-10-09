// SignUp.jsx
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase"; // Correctly import the app
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./SignUp.css";

function SignUp({ onSignUp }) {
  // Accept onSignUp as a prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleSignUp = async (e) => {
    e.preventDefault();
    const auth = getAuth(app); // Use the imported app

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User registered successfully!");
      onSignUp(); // Call onSignUp to update authentication state
      navigate("/view-blogs"); // Redirect to View Blogs after successful sign-up
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Sign Up</h2>
        <form className="signup-form" onSubmit={handleSignUp}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="signup-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="signup-input"
          />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <div className="signup-links">
          <a href="/signin" className="signup-link">
            Already have an account? Sign In
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
