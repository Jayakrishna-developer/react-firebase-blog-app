import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import ViewBlogs from "./Components/ViewBlogs";
import SignUp from "./Components/Signup";
import SignIn from "./Components/Signin";
import AddBlog from "./Components/Addblog";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks authentication status

  const handleSignUp = () => {
    setIsAuthenticated(true); // User is authenticated after sign-up
  };

  const handleSignIn = () => {
    setIsAuthenticated(true); // User is authenticated after sign-in
  };

  return (
    <Router>
      <div>
       

        <Routes>
          <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
          <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
          <Route
            path="/add-blog"
            element={isAuthenticated ? <AddBlog /> : <Navigate to="/signin" />}
          />
          <Route
            path="/view-blogs"
            element={
              isAuthenticated ? <ViewBlogs /> : <Navigate to="/signin" />
            }
          />
          <Route path="/" element={<Navigate to="/signin" />} />{" "}
          {/* Redirect to Sign In by default */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
