import React from "react";
import "../../App.css";// Importing external CSS
 
const InstantChat = () => {
  return (
    <section className="instantchat-section">

      {/* ---------- HEADER SECTION ---------- */}
      <header className="instantchat-header">
        <h1>
          Instant Chat with <span>HomeFix Experts</span>
        </h1>
        <p>Chat live and solve issues instantly.</p>
      </header>

      {/* ---------- FORM & CHAT SECTION ---------- */}
      <main className="instantchat-main">
        {/* --- LEFT: FORM --- */}
        <div className="chat-form">
          <h2>Start a Chat</h2>
          <p>
            Enter your details to start chatting instantly with certified service
            providers.
          </p>

          <form className="form-fields">
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Email Address" />
            <input type="tel" placeholder="Mobile Number" />
            <button type="submit">Start Chat</button>
          </form>
        </div>

        {/* --- RIGHT: CHAT WINDOW --- */}
        <div className="chat-window">
          <div className="chat-header">
            <h3>Live Support</h3>
            <span className="online-status">
              <span className="dot"></span> Online
            </span>
          </div>

          <div className="chat-messages">
            <div className="message support">
              Hello 👋! How can we assist you today?
            </div>
            <div className="message user">
              I need help booking a technician.
            </div>
          </div>

          <div className="chat-input">
            <input type="text" placeholder="Type your message..." />
            <button>➤</button>
          </div>
        </div>
      </main>

      {/* ---------- WHY USERS LOVE SECTION ---------- */}
      <section className="why-love">
        <h2>
          Why Users Love <span>Instant Chat</span>
        </h2>
        <p>
          Fast responses, reliable experts, and hassle-free support make Instant Chat
          the go-to choice for users who want real-time help without the wait.
        </p>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="instantchat-footer">
        Trusted by hundreds of users daily — powered by real-time communication and
        secure service.
      </footer>
    </section>
  );
};

export default InstantChat;