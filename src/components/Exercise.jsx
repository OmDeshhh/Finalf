import React from "react";
import "./Exercise.css";

function Exercise() {
  return (
    <div>
      {/* Logout Button */}
      <button id="logout" onClick={() => logout()}>Logout</button>

      {/* Welcome Banner */}
      <section className="banner">
        <h1>🏃 Exercise Tips for Diabetes Management</h1>
        <p>Explore effective workout methods that regulate glucose levels and boost overall health.</p>
      </section>

      {/* Cards Container */}
      <section className="card-container">
        {/* Card 1: Walk After Meals */}
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/1145/1145805.png" alt="Walk After Meals" />
          <h3>🚶 Walk After Meals</h3>
          <p>Walking for 15 minutes post-meal reduces glucose levels by 22%.</p>
        </div>

        {/* Card 2: Strength Training */}
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/2942/2942031.png" alt="Strength Training" />
          <h3>🏋️ Strength Training</h3>
          <p>Builds muscle mass, enhancing insulin sensitivity and lowering blood sugar.</p>
        </div>

        {/* Card 3: HIIT Workouts */}
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/4136/4136785.png" alt="HIIT" />
          <h3>⚡ HIIT Workouts</h3>
          <p>High-intensity intervals improve insulin resistance and glucose control.</p>
        </div>

        {/* Card 4: Yoga & Flexibility */}
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/2826/2826276.png" alt="Yoga" />
          <h3>🧘 Yoga & Flexibility</h3>
          <p>Reduces stress and promotes glucose control through mindful movements.</p>
        </div>

        {/* Card 5: Swimming */}
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/3437/3437494.png" alt="Swimming" />
          <h3>🏊 Swimming</h3>
          <p>Engages all muscle groups and improves glucose utilization.</p>
        </div>

        {/* Card 6: Cycling */}
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/2942/2942044.png" alt="Cycling" />
          <h3>🚴 Cycling</h3>
          <p>Promotes cardiovascular health and reduces insulin resistance.</p>
        </div>

        {/* Card 7: Stretching Exercises */}
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/4315/4315392.png" alt="Stretching" />
          <h3>🤸 Stretching</h3>
          <p>Improves circulation and muscle flexibility, supporting glucose balance.</p>
        </div>

        {/* Card 8: Resistance Bands */}
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/3176/3176259.png" alt="Resistance Bands" />
          <h3>🏋️‍♂️ Resistance Bands</h3>
          <p>Increases strength and insulin sensitivity through controlled movement.</p>
        </div>

        {/* Card 9: Dance Workouts */}
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/2703/2703088.png" alt="Dance" />
          <h3>💃 Dance Workouts</h3>
          <p>Improves cardiovascular health and promotes fun glucose control.</p>
        </div>

        {/* Card 10: Pilates */}
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/3589/3589307.png" alt="Pilates" />
          <h3>✨ Pilates</h3>
          <p>Enhances core strength and supports glucose management.</p>
        </div>

        {/* Card 11: Tai Chi */}
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/3575/3575975.png" alt="Tai Chi" />
          <h3>☯️ Tai Chi</h3>
          <p>Improves balance, flexibility, and insulin function through slow movements.</p>
        </div>

        {/* Card 12: Aerobic Exercises */}
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/2503/2503836.png" alt="Aerobic" />
          <h3>🏃 Aerobic Exercises</h3>
          <p>Enhances cardiovascular endurance and aids glucose management.</p>
        </div>
      </section>
    </div>
  );
}

function logout() {
  localStorage.clear();
  window.location.href = "/";
}

export default Exercise;
