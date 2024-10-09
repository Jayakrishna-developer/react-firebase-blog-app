import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase auth functions
import { app } from "../firebase"; // Correctly import the app
import "./SignIn.css"; // Import your CSS file

function SignIn({ onSignIn }) {
  // Accept onSignIn as a prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleSignIn = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("User signed in successfully!");
      onSignIn(); // Call onSignIn to update authentication state
      navigate("/view-blogs"); // Redirect to View Blogs after successful sign-in
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Sign In</h2>
        <form onSubmit={handleSignIn} className="signup-form">
          <input
            type="email"
            className="signup-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="signup-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="signup-button">
            Sign In
          </button>
        </form>
        <div className="signup-links">
          <Link to="/signup" className="signup-link">
            Don't have an account? Sign Up
          </Link>
          <Link to="/forgot-password" className="signup-link">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
