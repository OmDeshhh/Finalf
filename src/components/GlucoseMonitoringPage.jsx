import React, { useState, useEffect } from "react";
import { Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import html2pdf from "html2pdf.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GlucoseMonitoringPage = () => {
  const navigate = useNavigate();
  const [glucoseData, setGlucoseData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [statusData, setStatusData] = useState([]); // New state for status data
  const [glucoseInput, setGlucoseInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [recommendations, setRecommendations] = useState(""); // State for storing AI recommendations

  const apiKey = "AIzaSyD-m8SIS7HJLeLtPJzAiFhhdQEIscN9x68"; // Your API key

  // Regular expression to validate time and event input
  const timeEventPattern = /^[a-zA-Z]+, \d{1,2}:\d{2} (AM|PM)$/;

  // Load glucose data, time data, and status data from localStorage when the component mounts
  useEffect(() => {
    const savedGlucoseData = JSON.parse(localStorage.getItem("glucoseData")) || [];
    const savedTimeData = JSON.parse(localStorage.getItem("timeData")) || [];
    const savedStatusData = JSON.parse(localStorage.getItem("statusData")) || [];
    setGlucoseData(savedGlucoseData);
    setTimeData(savedTimeData);
    setStatusData(savedStatusData);
  }, []);

  // Save glucose data, time data, and status data to localStorage whenever they change
  useEffect(() => {
    if (glucoseData.length && timeData.length && statusData.length) {
      localStorage.setItem("glucoseData", JSON.stringify(glucoseData));
      localStorage.setItem("timeData", JSON.stringify(timeData));
      localStorage.setItem("statusData", JSON.stringify(statusData)); // Save status data
    }
  }, [glucoseData, timeData, statusData]);

  // Function to determine glucose status
  const getGlucoseStatus = (glucoseLevel) => {
    if (glucoseLevel < 70) {
      return "Low";
    } else if (glucoseLevel <= 140) {
      return "Normal";
    } else {
      return "High";
    }
  };

  // Handle form submission for manual blood sugar logging
  const handleLogBloodSugar = async (e) => {
    e.preventDefault();

    if (!timeEventPattern.test(timeInput)) {
      setErrorMessage("Please enter the event and time in the format: (Event, HH:MM AM/PM)");
      return;
    }

    // Determine glucose status
    const glucoseLevel = parseFloat(glucoseInput);
    const status = getGlucoseStatus(glucoseLevel);

    // Add new glucose data, time, and status to state
    const newTimeData = [...timeData, timeInput];
    const newGlucoseData = [...glucoseData, glucoseLevel];
    const newStatusData = [...statusData, status];

    // Immediately save to localStorage
    localStorage.setItem("glucoseData", JSON.stringify(newGlucoseData));
    localStorage.setItem("timeData", JSON.stringify(newTimeData));
    localStorage.setItem("statusData", JSON.stringify(newStatusData));

    // Update state with new values
    setTimeData(newTimeData);
    setGlucoseData(newGlucoseData);
    setStatusData(newStatusData);

    // Clear input fields after submission
    setGlucoseInput("");
    setTimeInput("");
    setErrorMessage(""); // Clear error message

    // Send the logged glucose level for analysis
    await analyzeGlucoseLevels(glucoseLevel);
  };

  // Analyze the glucose levels using Gemini AI
  const analyzeGlucoseLevels = async (glucoseLevel) => {
    const promptWithHTMLInstruction = `
      You are a helpful medical assistant specialized in diabetes.
      Provide insights and recommendations for managing blood sugar levels. Please respond in clean HTML format.
      
      Glucose Level: ${glucoseLevel} mg/dL
      
      What should the user do to manage their blood sugar levels? Provide diet, exercise, and motivation advice.
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptWithHTMLInstruction }] }],
          }),
        }
      );

      const data = await response.json();
      let botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "<p>Sorry, I couldn't process that.</p>";

      // Clean the response by removing unwanted markdown backticks
      botReply = botReply.replace(/^```html/g, "").replace(/```$/g, "").trim();

      // Set the recommendations state to the AI response
      setRecommendations(botReply);
    } catch (error) {
      console.error("Error:", error);
      setRecommendations("<p>❌ Error: Unable to get a response from the server.</p>");
    }
  };

  // Chart data
  const data = {
    labels: timeData,
    datasets: [
      {
        label: "Blood Sugar Level (mg/dL)",
        data: glucoseData,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Blood Sugar Levels (Manually Logged)",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Blood Sugar Level (mg/dL)",
        },
        min: 0,
        max: 200,
      },
    },
  };

  // Function to handle PDF download
  const downloadPDF = () => {
    const chartElement = document.getElementById("chart-container");

    const options = {
      filename: "blood_sugar_chart.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 4,
        width: chartElement.offsetWidth,
        height: chartElement.offsetHeight,
        x: 0,
        y: 0,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf()
      .from(chartElement)
      .set(options)
      .save();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-50 py-4 px-6 border-b border-gray-200 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Stethoscope className="h-6 w-6 text-purple-700" />
          <span className="text-xl font-bold text-gray-900">Karunya</span>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-transparent text-blue-600 border border-blue-600 rounded-full text-sm font-medium"
          >
            Profile
          </button>
        </div>
      </nav>

      {/* Manual Glucose Logging Form */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Log Your Blood Sugar</h2>
            <p className="text-xl text-gray-700 mb-6">
              Enter your blood sugar levels at different times of the day.
            </p>
            <form onSubmit={handleLogBloodSugar} className="space-y-4">
              <div className="flex space-x-4 justify-center">
                <input
                  type="number"
                  placeholder="Enter glucose level (mg/dL)"
                  value={glucoseInput}
                  onChange={(e) => setGlucoseInput(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="(e.g., Breakfast, 8:00 AM)"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-lg"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Log
                </button>
              </div>
            </form>
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>} {/* Error message display */}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recommendations</h2>
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div dangerouslySetInnerHTML={{ __html: recommendations }} />
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Glucose Data Visualization */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Blood Sugar Level Chart</h2>
            <div id="chart-container" className="bg-white p-6 rounded-lg shadow-xl">
              <Line data={data} options={options} />
              <button
                onClick={downloadPDF}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Download Chart as PDF
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GlucoseMonitoringPage;
