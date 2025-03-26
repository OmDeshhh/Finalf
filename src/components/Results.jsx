import React, { useEffect, useState } from 'react';
import './Results.css';

const DashboardResults = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [username, setUsername] = useState('User');

  useEffect(() => {
    const storedBookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));
    const storedUsername = localStorage.getItem("username") || "User";

    setUsername(storedUsername);

    if (storedBookingDetails) {
      setBookingDetails(storedBookingDetails);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/index.html";
  };

  const navigateTo = (page) => {
    window.location.href = page;
  };

  return (
    <div>
      {/* Logout Button */}
      <button id="logout" onClick={logout}>Logout</button>

      {/* Welcome Banner */}
      <section className="banner">
        <h1>👋 Welcome back, <span id="username">{username}</span>!</h1>
        <p>Here's your latest health information and resources.</p>
      </section>

      {/* Card Container - Diet, Exercise, AI Chatbot */}
      <section className="card-container">
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png" alt="Diet" />
          <h3>🥗 Personalized Diet Plan</h3>
          <p>Get customized diet suggestions to maintain balanced sugar levels.</p>
          <button onClick={() => navigateTo('diet.html')} className="btn-glow">Explore Diet</button>
        </div>

        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/1666/1666826.png" alt="Exercise" />
          <h3>🏃 Exercise Recommendations</h3>
          <p>Discover the best exercises to regulate blood sugar levels.</p>
          <button onClick={() => navigateTo('exercise.html')} className="btn-glow">Check Exercises</button>
        </div>

        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/2099/2099058.png" alt="AI Chatbot" />
          <h3>🤖 AI Health Chatbot</h3>
          <p>Ask AI-powered questions about diabetes and glucose levels.</p>
          <button onClick={() => navigateTo('chatbot.html')} className="btn-glow">Chat Now</button>
        </div>
      </section>

      {/* Card Container - Booking, Results, Test */}
      <section className="card-container">
        <div className="card">
          <h3>📅 Your Booking Details</h3>
          <p id="bookingDetails">
            {bookingDetails ? (
              <>
                <strong>👨‍⚕️ Doctor:</strong> {bookingDetails.doctorName}<br />
                <strong>📧 Email:</strong> {bookingDetails.email}<br />
                <strong>📱 Phone:</strong> {bookingDetails.phone}<br />
                <strong>🏡 Address:</strong> {bookingDetails.address}<br />
                <strong>🧪 Tests:</strong> {bookingDetails.tests.join(", ")}<br />
                <strong>💰 Price:</strong> {bookingDetails.price}
              </>
            ) : "No upcoming bookings."}
          </p>
        </div>

        <div className="card">
          <h3>📊 View Results</h3>
          <p>Check your latest glucose analysis and trends.</p>
          <button onClick={() => navigateTo('results.html')} className="btn-glow">View Results</button>
        </div>

        <div className="card">
          <h3>🔄 Book Another Test</h3>
          <p>Ready for your next assessment?</p>
          <button onClick={() => navigateTo('book-test.html')} className="btn-glow">Book Test</button>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="success-container">
        <h2>🎉 Success Stories</h2>
        <div className="card-container">
          <div className="success-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png" alt="User 1" />
            <h4>Ramesh Kumar</h4>
            <p>"With personalized diet and exercise plans, my sugar levels are finally under control!"</p>
          </div>

          <div className="success-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2922/2922520.png" alt="User 2" />
            <h4>Neha Sharma</h4>
            <p>"AI chatbot provided instant suggestions that helped me manage diabetes better."</p>
          </div>

          <div className="success-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2922/2922656.png" alt="User 3" />
            <h4>Amit Patel</h4>
            <p>"Regular monitoring and test reminders have helped me stay on track with my health goals."</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardResults;
