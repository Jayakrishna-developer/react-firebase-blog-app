import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ViewBlogs from "./Components/ViewBlogs";

import SignIn from "./Components/SignIn";
import AddBlog from "./Components/Addblog";
import SignUp from "./Components/SignUpp";  // Capital "U"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignUp = () => {
    setIsAuthenticated(true);
  };

  const handleSignIn = () => {
    setIsAuthenticated(true);
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
          <Route path="/" element={<Navigate to="/signin" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
