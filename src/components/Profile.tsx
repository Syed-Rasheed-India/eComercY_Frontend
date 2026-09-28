import { useEffect, useState } from "react";
import { User, LogOut, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import "../styles/Profile.css";

const API_URL = "http://localhost:3000";

interface UserData {
  name: string;
  email: string;
}

function Profile() {

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    const getUser = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {

        const response = await fetch(
          `${API_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await response.json();

        setUser(data.user);

      } catch (error) {

        console.error(
          "User error:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    getUser();

  }, [navigate]);


  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };


  if (loading) {

    return (
      <>
        <Navbar />

        <main className="profile-page">
          <p>Loading profile...</p>
        </main>
      </>
    );

  }


  return (
    <>
      <Navbar />

      <main className="profile-page">

        <div className="profile-card">

          <div className="profile-avatar">
            <User size={35} />
          </div>

          <h1>My Profile</h1>


          <div className="profile-info">

            <div className="profile-row">

              <User size={18} />

              <div>
                <span>Name</span>
                <strong>
                  {user?.name || "User"}
                </strong>
              </div>

            </div>


            <div className="profile-row">

              <Mail size={18} />

              <div>
                <span>Email</span>
                <strong>
                  {user?.email}
                </strong>
              </div>

            </div>

          </div>


          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={17} />

            Logout
          </button>

        </div>

      </main>
    </>
  );
}

export default Profile;