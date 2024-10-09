import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./ViewBlogs.css";

function ViewBlogs() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const db = getDatabase(app);
    const blogsRef = ref(db, "blogs");

    onValue(blogsRef, (snapshot) => {
      const data = snapshot.val();
      const blogsArray = data ? Object.values(data) : [];
      setBlogs(blogsArray);
    });
  }, []);

  const handleAddBlog = () => {
    navigate("/add-blog");
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

  // Function to handle liking a blog
  const handleLike = (blog) => {
    const updatedLikes = (blog.likes || 0) + 1; // Increment the like count
    const db = getDatabase(app);
    const blogRef = ref(db, "blogs/" + blog.id);

    update(blogRef, { likes: updatedLikes }) // Update the likes in Firebase
      .then(() => {
        // Optionally, update the local state to reflect the change
        setBlogs((prevBlogs) =>
          prevBlogs.map((b) =>
            b.id === blog.id ? { ...b, likes: updatedLikes } : b
          )
        );
      })
      .catch((error) => {
        alert("Failed to like the blog: " + error.message);
      });
  };

  return (
    <div className="blogs-container">
      <div className="title-button-container">
        <h2 className="blogs-title">Blogs</h2>
        <button className="add-blog-button" onClick={handleAddBlog}>
          Add Blog
        </button>
      </div>
      <ul className="blogs-list">
        {blogs.map((blog, index) => (
          <li key={index} className="blog-item">
            <div className="blog-content-container">
              <p className="blog-author">
                <strong>Author:</strong> {blog.author || "Unknown"}
              </p>
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-content">{blog.content}</p>
              <div className="blog-footer">
                <span className="blog-timestamp">
                  {timeAgo(blog.createdAt)} {/* Display the timestamp */}
                </span>
                <button
                  className="like-button"
                  onClick={() => handleLike(blog)}
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                >
                  <i class="fa-solid fa-hands-clapping"></i>
                  <span style={{ marginLeft: "5px" }}>
                    {blog.likes || 0}
                  </span>{" "}
                  {/* Display like count */}
                </button>
              </div>
            </div>
            {blog.imageUrl && (
              <img
                className="img-fluid"
                src={blog.imageUrl}
                alt={blog.title}
                loading="lazy" // Optional for lazy loading
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewBlogs;
