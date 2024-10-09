import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, remove, onValue } from "firebase/database";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import "./AddBlog.css"; // Import the CSS styles
import "./ViewBlogs.css"; // Import the blogs styles

function AddBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [externalImageUrl, setExternalImageUrl] = useState("");
  const [authorName, setAuthorName] = useState(""); // State for author name
  const [blogs, setBlogs] = useState([]); // State to store blogs
  const auth = getAuth(); // Get the authentication object
  const db = getDatabase(app); // Initialize the Realtime Database
  const userUid = auth.currentUser ? auth.currentUser.uid : null; // Get current user UID

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!externalImageUrl) {
      alert("Please provide an image URL.");
      return;
    }

    const blogId = Date.now(); // Unique ID using timestamp
    const timestamp = new Date().toISOString(); // Get the current timestamp
    const newBlog = {
      id: blogId,
      title,
      content,
      author: authorName, // Use the author name from input
      userUid, // Save the UID of the author
      imageUrl: externalImageUrl,
      createdAt: timestamp, // Add the created timestamp
    };

    // Save to Firebase
    set(ref(db, "blogs/" + blogId), newBlog)
      .then(() => {
        alert("Blog added successfully!");
        // Update the local blogs state directly
        setBlogs((prevBlogs) => {
          // Filter out any existing blog with the same ID
          const filteredBlogs = prevBlogs.filter((blog) => blog.id !== blogId);
          // Add the new blog
          return [...filteredBlogs, newBlog];
        });

        // Clear input fields
        setTitle("");
        setContent("");
        setExternalImageUrl("");
        setAuthorName(""); // Clear author name
      })
      .catch((error) => {
        alert("Failed to add blog: " + error.message);
      });
  };

  // Fetch blogs for the logged-in user
  useEffect(() => {
    if (userUid) {
      const blogsRef = ref(db, "blogs/");
      onValue(blogsRef, (snapshot) => {
        const allBlogs = [];
        snapshot.forEach((childSnapshot) => {
          const blogData = childSnapshot.val();
          if (blogData.userUid === userUid) {
            // Filter by author UID
            allBlogs.push(blogData);
          }
        });
        setBlogs(allBlogs); // Set the local state with the user's blogs
      });
    }
  }, [db, userUid]);

  // Function to delete a single blog
  const handleDeleteBlog = (blogId) => {
    remove(ref(db, "blogs/" + blogId))
      .then(() => {
        alert("Blog deleted successfully!");
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId)); // Update local state after deletion
      })
      .catch((error) => {
        alert("Failed to delete blog: " + error.message);
      });
  };

  // Function to delete all blogs
  const handleDeleteAllBlogs = () => {
    if (blogs.length === 0) {
      alert("No blogs to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete all blogs?"
    );
    if (confirmDelete) {
      blogs.forEach((blog) => {
        remove(ref(db, "blogs/" + blog.id)); // Remove each blog from Firebase
      });

      setBlogs([]); // Clear all blogs from local state
      alert("All blogs have been deleted.");
    }
  };

  // Helper function to format the createdAt timestamp
  const timeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    return "Just now";
  };

  return (
    <>
      <div className="add-blog-container ">
        <h2>Add Blog</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Author Name:
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Content:
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Provide Image URL:
              <input
                type="url"
                value={externalImageUrl}
                onChange={(e) => setExternalImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                required
              />
            </label>
          </div>

          {externalImageUrl && (
            <p className="image-preview">
              External image URL provided:{" "}
              <a
                href={externalImageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Image
              </a>
            </p>
          )}

          <button type="submit">Add Blog</button>
        </form>
      </div>

      {/* Your Blogs Section */}
      <div className="blogs-container ">
        <div className="title-button-container">
          <h2 className="blogs-title">Your Blogs</h2>
          {/* Delete All Blogs Icon */}
          <i
            className="fa-solid fa-trash delete-all-blogs-icon"
            onClick={handleDeleteAllBlogs}
            title="Delete all blogs"
            style={{ cursor: "pointer", color: "red", fontSize: "24px" }}
          ></i>
        </div>
        <ul className="blogs-list ">
          {blogs.length === 0 ? (
            <p>No blogs available. Start by adding a new blog!</p>
          ) : (
            blogs.map((blog) => (
              <li className="blog-item" key={blog.id}>
                <div className="blog-content-container">
                  <p className="blog-author">Author: {blog.author}</p>{" "}
                  <h3 className="blog-title">{blog.title}</h3>
                  {/* Display the author name */}
                  <p className="blog-content">{blog.content}</p>
                  <div className="blog-footer">
                    {/* Relative time since created */}
                    <span className="blog-timestamp">
                      {timeAgo(blog.createdAt)}{" "}
                      {/* Call the timeAgo function */}
                    </span>
                    {/* Delete Single Blog Icon */}
                    <i
                      className="fa-solid fa-trash delete-blog-icon"
                      onClick={() => handleDeleteBlog(blog.id)}
                      title="Delete this blog"
                      style={{
                        cursor: "pointer",
                        color: "red",
                        marginLeft: "10px", // 10px gap from timestamp
                      }}
                    ></i>
                  </div>
                </div>
                <img
                  className="image-fluid"
                  style={{ width: "200px", borderRadius: "10%" }}
                  src={blog.imageUrl}
                  alt={blog.title}
                />
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}

export default AddBlog;
