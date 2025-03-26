import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./Dashboard.css"; // Import the CSS for Dashboard

function Dashboard() {
  const navigate = useNavigate();
  
  return (
    <div className="dashboard">
      {/* Welcome Banner */}
      <section className="banner">
        <h1>👋 Welcome back, <span id="username">User</span>!</h1>
        <p>Your personalized journey to better health starts now.</p>
      </section>

      {/* Feature Cards */}
      <section className="features">
        <div className="feature-card glass" onClick={() => navigate('/Diet')}>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/1046/1046797.png" 
            alt="Diet Plan" 
            className="feature-img" 
          />
          <h3>🍎 Diet Plan</h3>
          <p>Tailored diet recommendations to manage sugar levels.</p>
        </div>
        <div className="feature-card glass" onClick={() => navigate('/Results')}>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3388/3388601.png" 
            alt="Tasks" 
            className="feature-img" 
          />
          <h3>📋 Daily Tasks</h3>
          <p>Track and complete daily goals for a healthier you.</p>
        </div>
        <div className="feature-card glass" onClick={() => navigate('/ChatBot')}>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2933/2933245.png" 
            alt="AI Chat" 
            className="feature-img" 
          />
          <h3>🤖 AI Chat</h3>
          <p>Get instant health insights from AI anytime.</p>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="success-stories">
        <h3>🌟 Success Stories</h3>
        <div className="story-container">
          <div className="story-card">
            <img src="https://randomuser.me/api/portraits/men/15.jpg" className="avatar" alt="Rohan" />
            <p>“I reversed my prediabetes in 6 months!” - <strong>Rohan</strong></p>
          </div>
          <div className="story-card">
            <img src="https://randomuser.me/api/portraits/women/12.jpg" className="avatar" alt="Priya" />
            <p>“The AI diet plan helped me manage sugar levels.” - <strong>Priya</strong></p>
          </div>
          <div className="story-card">
            <img src="https://randomuser.me/api/portraits/women/10.jpg" className="avatar" alt="Neha" />
            <p>“Best platform for diabetes management!” - <strong>Neha</strong></p>
          </div>
        </div>
      </section>

      {/* Book Test Button */}
      <div className="cta">
        <button 
          onClick={() => navigate('/user-dashboard')} 
          className="btn-glow"
        >
          🚀 Book Your Next Test
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
