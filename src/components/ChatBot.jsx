import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const apiKey = "AIzaSyD-m8SIS7HJLeLtPJzAiFhhdQEIscN9x68"; // Replace with your actual API key

  const sendMessage = async () => {
    if (!userInput.trim()) {
      alert("Please enter a message!");
      return;
    }

    // Prompt formatted to instruct Gemini to respond in HTML
    const promptWithHTMLInstruction = `
You are a helpful medical assistant specialized in diabetes.
Always respond in clean HTML format. Use:
- <p> for paragraphs
- <ul> and <li> for bullet points
- <strong> for important text
Avoid Markdown, return only HTML content.

Answer this:
${userInput}
`;

    const newMessages = [...messages, { role: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

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
      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "<p>Sorry, I couldn't process that.</p>";

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

  return (
    <div className="chat-container">
      <h1>🤖 <span className="title">Diabetes AI Chatbot</span></h1>

      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
            {msg.isHTML ? (
              <span dangerouslySetInnerHTML={{ __html: msg.text }} />
            ) : (
              msg.text
            )}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask me anything about diabetes..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
