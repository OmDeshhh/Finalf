import React, { useState } from "react";
import { Stethoscope } from "lucide-react";

// Navbar component
const Navbar = ({ toggleDropdown, isDropdownOpen, handleProfileOption }) => (
  <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-50 py-4 px-6 border-b border-gray-200 shadow-md flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <Stethoscope className="h-8 w-8 text-purple-700" />
      <span className="text-2xl font-bold text-gray-900">HealthGuard</span>
    </div>
    <div className="flex space-x-4">
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="px-6 py-2 bg-transparent text-blue-600 border border-blue-600 rounded-full text-sm font-medium hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out"
        >
          Profile
        </button>
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
);

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [showButtons, setShowButtons] = useState(true); // State to control the button visibility

  const apiKey = "AIzaSyD-m8SIS7HJLeLtPJzAiFhhdQEIscN9x68"; // Use environment variable for API key

  const sendMessage = async () => {
    if (!userInput.trim()) {
      return; // Do nothing if the user input is empty, no alert
    }
  
    const promptWithHTMLInstruction = `
    You are a helpful medical assistant specialized in diabetes.
    Always respond in clean HTML format. Use the following HTML elements:
    
    - <p> for paragraphs.
    - <ul> and <li> for bullet points (unordered list).
    - <ol> and <li> for numbered points (ordered list).
    - <strong> for important text (bold).
    - <em> for emphasis (italic).
    - <h1>, <h2>, <h3>, <h4>, <h5>, and <h6> for headings (use h1 for the main title and smaller h-tags for subheadings).
    - <a href="URL"> for hyperlinks (use this tag for references to additional resources).
    - <br> for line breaks.
    - <table>, <tr>, <th>, and <td> for tables (use these for displaying data in table format).
    - <blockquote> for quoting important information.
    - <code> for code snippets (use for technical references or medical codes).
    - <img src="imageURL" alt="description"> for images (use for visual aids like charts or diagrams).
    - <span> for inline styling or additional information.
    
    Avoid Markdown or any non-HTML syntax. Return only valid HTML content. You can format your response to make it more visually appealing and easy to read by using headings, bullet points, ordered lists, hyperlinks, and appropriate tags.
  
    Answer this:
    ${userInput}
  `;
  

  
    const newMessages = [...messages, { role: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setChatStarted(true); // Set chatStarted to true when chat begins
  
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
      botReply = botReply.replace(/^```html/g, '').replace(/```$/g, '').trim();
  
      setMessages([
        ...newMessages,
        { role: "bot", text: botReply, isHTML: true },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        {
          role: "bot",
          text: "<p>❌ Error: Unable to get a response from the server.</p>",
          isHTML: true,
        },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleProfileOption = (option) => {
    console.log(option);
    setIsDropdownOpen(false);
  };

  const predefinedQueries = [
    "What is prediabetes?",
    "How to prevent diabetes?",
    "Symptoms of type 2 diabetes",
    "What to eat for diabetes control",
  ];

  const handleButtonClick = (query) => {
    setUserInput(query); // Set the user input directly from the button text
    setShowButtons(false); // Hide buttons once a button is clicked
    sendMessage(); // Send the message immediately after setting the input
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-100 min-h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <Navbar
        toggleDropdown={toggleDropdown}
        isDropdownOpen={isDropdownOpen}
        handleProfileOption={handleProfileOption}
      />

      <div className="flex flex-col flex-1 justify-between pt-20 px-6">
        {/* Show initial "Diabetes AI ChatBot" message */}
        {!chatStarted && (
          <div className="flex items-center justify-center p-10 bg-gradient-to-r from-purple-400 to-blue-500 text-white shadow-xl rounded-lg mb-6 animate__animated animate__fadeIn">
            <h1 className="text-4xl font-semibold text-center">Diabetes AI ChatBot</h1>
          </div>
        )}

        {/* Predefined Search Queries */}
        {showButtons && (
          <div className="grid grid-cols-2 gap-6 mb-6">
            {predefinedQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(query)}
                className="flex justify-center items-center p-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
              >
                <span className="text-xl font-semibold">{query}</span>
              </button>
            ))}
          </div>
        )}

        {/* Chatbox */}
<div className="flex-1 overflow-y-auto p-10 space-y-6 max-h-[80vh] w-full">
  <div className="max-w-3xl w-full mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
    {/* Ensure full height on inner container */}
    <div className="flex-1 overflow-y-auto h-full">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex items-start space-x-4 mb-4 ${msg.role === "user" ? "justify-end" : ""}`}
        >
          {msg.role !== "user" && (
            <div className="h-12 w-12 bg-gradient-to-r from-purple-400 to-blue-500 text-white rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold">B</span>
            </div>
          )}
          <div
            className={`${
              msg.role === "user"
                ? "bg-gradient-to-r from-blue-100 to-blue-200"
                : "bg-gradient-to-r from-gray-100 to-gray-200"
            } p-4 rounded-lg flex-1 max-w-full shadow-lg`}
          >
            <p
              className={`${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          </div>
          {msg.role === "user" && (
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold">U</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</div>


        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <div className="flex items-center">
            <input
              type="text"
              id="userInput"
              name="userInput"
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg placeholder-gray-500"
              placeholder="Ask me anything about diabetes..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={sendMessage}
              className="ml-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full hover:bg-blue-700 focus:outline-none transition duration-300 ease-in-out"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
