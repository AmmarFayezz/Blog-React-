import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

export default function Navbar() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setUser(null);
        return;
      }
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="navbar sticky top-0 z-50 bg-base-100/95 backdrop-blur border-b border-base-200 shadow-sm">
      <div className="container lg:max-w-5xl">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost normal-case text-xl font-semibold">
            Blog
          </Link>
        </div>
        <div className="navbar-end">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="badge badge-outline badge-lg">{user?.user?.name || "User"}</span>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  window.dispatchEvent(new Event("storage"));
                  setUser(null);
                  navigate("/");
                }}
                className="btn btn-sm btn-ghost"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/register" className="btn btn-primary btn-sm">
              Login/Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
