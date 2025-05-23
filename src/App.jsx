import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
import Booking from "./components/Booking";
import Profile from "./components/profile";
import HomePage from "./components/HomePage";
import Assessment from "./components/Assessment";
import Dashboard from "./components/Dashboard";
import Chatbot from "./components/ChatBot";
import Exercise from "./components/Exercise";
import Meals from "./components/Meals";
import Loader from "./components/Loader"; 
import GlucoseMonitoringPage from "./components/GlucoseMonitoringPage";
import "./App.css";

const NavigationButtons = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    const choice = window.confirm("Are you signing up as a Pathologist? Click OK for Pathologist, Cancel for User.");
    navigate(choice ? "/signup/pathologist" : "/signup/user");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <button style={buttonStyle} onClick={() => navigate("/login")}>Login</button>
      <button style={buttonStyle} onClick={handleSignupClick}>Sign Up</button>
    </div>
  );
};

const buttonStyle = {
  padding: "10px 20px",
  margin: "10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

function App() {
  return (
    <Router>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup/:type" element={<Signup />} />
          <Route path="/glucose" element={<GlucoseMonitoringPage/>}/>
          <Route path="/load" element={<Loader/>}/>
          <Route path="/exercise" element={<Exercise />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/meals" element={<Meals />} /> {/* ✅ Meals route added */}
          <Route path="/nearbytest" element={<UserDashboard />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
