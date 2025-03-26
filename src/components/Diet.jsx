import React, { useEffect, useState } from "react";
import "./Diet.css";

function Diet() {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "User";
    setUsername(storedUsername);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/"; // Redirect to homepage or login page
  };

  return (
    <div className="diet-page">
      {/* Logout Button */}
      <button id="logout" onClick={logout}>
        Logout
      </button>

      {/* Welcome Banner */}
      <section className="banner">
        <h1>👋 Welcome back, <span id="username">{username}</span>!</h1>
        <p>Explore scientifically proven tips to manage your glucose levels effectively.</p>
      </section>

      {/* Cards Container */}
      <section className="card-container">
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/2731/2731353.png" alt="Muscle Mass" />
          <h3>💪 Muscle Mass</h3>
          <p>Higher muscle mass improves insulin sensitivity and lowers diabetes risk.</p>
        </div>
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/706/706195.png" alt="Natural Fruits" />
          <h3>🍎 Natural Fruits</h3>
          <p>Whole fruits reduce diabetes risk. Blueberries lower Type 2 diabetes risk.</p>
        </div>
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/2814/2814902.png" alt="Vinegar" />
          <h3>🧴 Vinegar Use</h3>
          <p>Vinegar lowers post-meal glucose levels and improves insulin sensitivity.</p>
        </div>
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/2920/2920388.png" alt="Meal Sequencing" />
          <h3>🍽️ Meal Sequence</h3>
          <p>Veggies before carbs reduce glucose spikes by 29%, enhancing control.</p>
        </div>
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/3141/3141816.png" alt="Exercise" />
          <h3>🚶 Walk After Meals</h3>
          <p>Walking for 15 minutes after meals lowers glucose levels by 22%.</p>
        </div>
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/4208/4208433.png" alt="Portion Control" />
          <h3>🍲 Portion Control</h3>
          <p>Smaller portions improve glucose regulation and calorie balance.</p>
        </div>
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/1616/1616438.png" alt="Hydration" />
          <h3>💧 Hydration</h3>
          <p>Increased water intake reduces the risk of hyperglycemia by 21%.</p>
        </div>
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/4192/4192760.png" alt="Weight Loss" />
          <h3>⚖️ Weight Loss</h3>
          <p>5-10% weight loss improves insulin resistance and glucose control.</p>
        </div>
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/850/850932.png" alt="Fiber" />
          <h3>🥗 Fiber Intake</h3>
          <p>Higher fiber intake slows glucose absorption and controls spikes.</p>
        </div>
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/4233/4233421.png" alt="Stress Management" />
          <h3>🧘 Stress Management</h3>
          <p>Reduced stress improves glucose regulation and insulin sensitivity.</p>
        </div>
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/5269/5269125.png" alt="Sleep" />
          <h3>🌙 Sleep Quality</h3>
          <p>Better sleep quality supports glucose balance and insulin function.</p>
        </div>
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/3079/3079357.png" alt="Green Tea" />
          <h3>🍵 Green Tea</h3>
          <p>Green tea improves insulin sensitivity and supports glucose control.</p>
        </div>
      </section>
    </div>
  );
}

export default Diet;
