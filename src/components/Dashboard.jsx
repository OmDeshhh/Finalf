import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from 'react-feather'; // Using Heart as a placeholder for the icon
import { auth, db } from "../firebase"; // Import Firestore and Firebase auth
import { doc, getDoc } from "firebase/firestore"; // Firestore methods

function Dashboard() {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(""); // State to store the user's name
  const user = auth.currentUser; // Get the currently logged-in user

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleProfileOption = (option) => {
    switch (option) {
      case "Personal Details":
        navigate("/profile");
        break;
      case "Orders":
        navigate("/orders");
        break;
      case "Logout":
        navigate("/login");
        break;
      default:
        break;
    }
    setDropdownOpen(false); // Close the dropdown after selecting an option
  };

  useEffect(() => {
    if (user) {
      // Retrieve the user's name from Firestore
      const getUserData = async () => {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || "User"); // Set the user's name (fallback to "User" if not available)
        }
      };
      getUserData();
    }
  }, [user]); // Effect runs whenever the user changes (i.e., when logged in)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-50 py-4 px-6 border-b border-gray-200 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-purple-700" />
          <span className="text-xl font-bold text-gray-900">HealthGuard</span>
        </div>
        <div className="flex space-x-4">
          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="px-6 py-2 bg-transparent text-blue-600 border border-blue-600 rounded-full text-sm font-medium"
            >
              Profile
            </button>
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <ul className="space-y-2 p-2">
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded"
                    onClick={() => handleProfileOption("Personal Details")}
                  >
                    Personal Details
                  </li>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded"
                    onClick={() => handleProfileOption("Orders")}
                  >
                    Orders
                  </li>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded"
                    onClick={() => handleProfileOption("Logout")}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Welcome Banner */}
      <section className="banner mt-24 py-6 bg-blue-100 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">👋 Welcome, <span className="text-blue-600">{userName}</span>!</h1>
        <p className="text-base sm:text-lg mt-2">Your personalized journey to better health starts now.</p>
      </section>

      {/* Feature Cards */}
      <section className="features grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 py-4">
        <div className="feature-card bg-white shadow-lg rounded-lg p-4 text-center cursor-pointer hover:scale-105 transition-all" onClick={() => navigate('/meals')}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1046/1046797.png"
            alt="Diet Plan"
            className="feature-img mx-auto mb-4 h-16 w-16"
          />
          <h3 className="text-base sm:text-lg font-semibold">🍎 Diet Plan</h3>
          <p className="text-sm sm:text-base">Tailored diet recommendations to manage sugar levels.</p>
        </div>

        <div className="feature-card bg-white shadow-lg rounded-lg p-4 text-center cursor-pointer hover:scale-105 transition-all" onClick={() => navigate('/exercise')}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1049/1049254.png"
            alt="Exercise Tips"
            className="feature-img mx-auto mb-4 h-16 w-16"
          />
          <h3 className="text-base sm:text-lg font-semibold">🏃 Exercise Tips</h3>
          <p className="text-sm sm:text-base">Stay active with daily routines for better health.</p>
        </div>

        <div className="feature-card bg-white shadow-lg rounded-lg p-4 text-center cursor-pointer hover:scale-105 transition-all" onClick={() => navigate('/chatbot')}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2933/2933245.png"
            alt="AI Chat"
            className="feature-img mx-auto mb-4 h-16 w-16"
          />
          <h3 className="text-base sm:text-lg font-semibold">🤖 AI Chat</h3>
          <p className="text-sm sm:text-base">Get instant health insights from AI anytime.</p>
        </div>

        {/* New Feature Card */}
        <div className="feature-card bg-white shadow-lg rounded-lg p-4 text-center cursor-pointer hover:scale-105 transition-all" onClick={() => navigate('/glucose')}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1165/1165583.png"
            alt="Health Insights"
            className="feature-img mx-auto mb-4 h-16 w-16"
          />
          <h3 className="text-base sm:text-lg font-semibold">🩺 Glucose Monitoring</h3>
          <p className="text-sm sm:text-base">Track and manage your blood sugar levels with ease. receive personalized AI recommendations.</p>
        </div>

          {/* New Feature Card */}
        <div className="feature-card bg-white shadow-lg rounded-lg p-4 text-center cursor-pointer hover:scale-105 transition-all" onClick={() => navigate('/nearbytest')}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/5403/5403524.png"
            alt="Health Insights"
            className="feature-img mx-auto mb-4 h-16 w-16"
          />
          <h3 className="text-base sm:text-lg font-semibold">🩸 Blood Test Booking</h3>
          <p className="text-sm sm:text-base">Find Nearby Pathologists To Check Your Sugar Level's.</p>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
