// components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("Signed out successfully!");
        navigate("/login");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate("/dashboard")}>
        Diabetes Health Hub
      </div>
      <ul className="nav-links">
        <li><Link to="/dashboard">Home</Link></li>
        <li><Link to="/diet">Diet</Link></li>
        <li><Link to="/results">Results</Link></li>
        <li><Link to="/chatbot">ChatBot</Link></li>
        <li><Link to="/exercise">Exercise</Link></li>
        <li><Link to="/user-dashboard">Book Test</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
