import React, { useState, useEffect } from "react";
import "./chatbot.css";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋🏻 Welcome to Vivahasya Weddings!" }
  ]);
  const [input, setInput] = useState("");

  // 🔥 AUTO POPUP AFTER 5 SECONDS
  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
      setMessages([
        { from: "bot", text: "Hi 👋🏻 Need help with booking or venues?" }
      ]);
    }, 5000);
  }, []);

  const replies = {
    venue: "We provide venues in Bangalore, Goa, Mangalore and Shivamogga.",
    booking: "Go to venues page and click 'Check availability'.",
    contact: "Call us at +91 9876543210.",
    default: "Our team will assist you shortly 😊"
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    let botReply = replies.default;
    const text = input.toLowerCase();

    if (text.includes("price")) botReply = replies.price;
    else if (text.includes("venue")) botReply = replies.venue;
    else if (text.includes("book")) botReply = replies.booking;
    else if (text.includes("contact")) botReply = replies.contact;

    setMessages([...messages, userMsg, { from: "bot", text: botReply }]);
    setInput("");
  };

  return (
    <>
      {/* ICON */}
      <div className="chat-icon" onClick={() => setOpen(!open)}>
        🤖
      </div>

      {/* CHAT WINDOW */}
      {open && (
        <div className="chat-box">
         <div className="chatbot-header">
             Vivahasya Assistant 

        {/* ❌ CLOSE BUTTON */}
             <span className="close-btn" onClick={() => setOpen(false)}>✖</span>
        </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={msg.from === "bot" ? "bot-msg" : "user-msg"}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
        
      )}
    </>
  );
};

export default ChatBot;