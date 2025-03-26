import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const apiKey = "AIzaSyBaczF7Z18gzWXddh9NicOtmfln8oEA2A8"; // Replace with your actual API key
  const modelId = "tunedModels/diabetesfinetuningdata-cfpexgnkf4kx";

  const sendMessage = async () => {
    if (!userInput) return alert("Please enter a message!");

    const newMessages = [...messages, { role: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${modelId}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: userInput }] }] }),
        }
      );

      const data = await response.json();
      const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't process that.";

      setMessages([...newMessages, { role: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { role: "bot", text: "❌ Error: Unable to get a response." }]);
    }
  };

  return (
    <div className="chat-container">
      <h1>🤖 Diabetes AI Chatbot</h1>
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask me anything about diabetes..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
