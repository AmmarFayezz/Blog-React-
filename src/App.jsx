import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router";
import ManagePosts from "./pages/ManagePosts/ManagePosts";
import Register from "./pages/Register/Register";

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getPosts(currentUser = user) {
    try {
      setLoading(true);
      const config = {};

      if (currentUser && currentUser.accessToken) {
        config.headers = {
          Authorization: `Bearer ${currentUser.accessToken}`,
        };
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/posts?_expand=user`,
        config,
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  useEffect(() => {
    getPosts();
  }, [user]);

  function handlePostSaved(savedPost) {
    setPosts((currentPosts) => {
      const existingPost = currentPosts.find(
        (post) => post.id === savedPost.id,
      );

      if (existingPost) {
        return currentPosts.map((post) =>
          post.id === savedPost.id ? savedPost : post,
        );
      }

      return [savedPost, ...currentPosts];
    });
  }

  function handlePostDeleted(postId) {
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId),
    );
  }

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                posts={posts}
                loading={loading}
                onPostDeleted={handlePostDeleted}
                user={user}
              />
            }
          />
          <Route
            path="/manage-posts"
            element={<ManagePosts onPostSaved={handlePostSaved} />}
          />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
