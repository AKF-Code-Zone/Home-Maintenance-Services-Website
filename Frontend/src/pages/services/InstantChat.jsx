import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../../App.css";

const InstantChat = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [isEditing]);

  // Get user info on component load
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        if (token && userData) {
          const userObj = JSON.parse(userData);
          setUser(userObj);
          await loadChatHistory();
        } else {
          toast.error("Please login to access chat");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        toast.error("Error loading user data");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`http://localhost:5000/api/chat/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success && data.messages && data.messages.length > 0) {
        setMessages(data.messages);
      } else {
        // Initial welcome message if no history
        setMessages([
          { 
            _id: "welcome",
            type: "support", 
            text: "Hello 👋! Welcome to HomeFix Support. I'm your AI assistant. I can help you with home services, bookings, pricing, and support. How can I assist you today?", 
            time: new Date(),
            userId: "support"
          }
        ]);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      toast.error("Failed to load chat history");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // If we're in editing mode, handle edit instead of new message
    if (isEditing && editingMessage) {
      await handleSaveEdit();
      return;
    }

    if (message.trim() === "") {
      toast.error("Please enter a message");
      return;
    }

    if (!user) {
      toast.error("Please login to send messages");
      navigate("/login");
      return;
    }

    // Create temporary user message for immediate UI update
    const tempUserMessage = { 
      _id: `temp_${Date.now()}`,
      type: "user", 
      text: message, 
      time: new Date(),
      userId: user._id,
      userName: user.name
    };
    
    // Add temporary AI loading message
    const tempLoadingMessage = {
      _id: `loading_${Date.now()}`,
      type: "support",
      text: "Thinking...",
      time: new Date(),
      userId: "support",
      isLoading: true
    };

    setMessages(prev => [...prev, tempUserMessage, tempLoadingMessage]);
    setMessage("");
    setIsLoadingAI(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("http://localhost:5000/api/chat/save-message", {
        message: message,
        type: "user",
        timestamp: new Date()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success && data.chat) {
        // Replace all messages with updated chat from backend
        const updatedMessages = data.chat.messages.map(msg => ({
          _id: msg._id,
          type: msg.type,
          text: msg.message,
          time: new Date(msg.timestamp),
          userId: msg.type === "user" ? user._id : "support",
          userName: msg.type === "user" ? user.name : "HomeFix AI Assistant"
        }));
        
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error("Error saving message:", error);
      toast.error("Failed to send message");
      // Remove temporary messages if error
      setMessages(prev => prev.filter(msg => 
        !msg._id.startsWith('temp_') && !msg._id.startsWith('loading_')
      ));
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Edit Message Functionality - WhatsApp style
  const handleEditMessage = (message) => {
    if (message.type === "user" && message.userId === user._id && 
        !message._id.startsWith('temp_') && !message._id.startsWith('loading_') && message._id !== 'welcome') {
      setEditingMessage(message._id);
      setMessage(message.text); // Move message to input field
      setIsEditing(true);
      
      // Highlight the message being edited
      const messageElement = document.querySelector(`[data-message-id="${message._id}"]`);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setMessage("");
    setIsEditing(false);
  };

 // Save edit when user presses Enter in input field
const handleSaveEdit = async () => {
  if (!message.trim()) {
    toast.error("Message cannot be empty");
    return;
  }

  if (editingMessage.startsWith('temp_') || editingMessage.startsWith('loading_') || editingMessage === 'welcome') {
    toast.error("Cannot edit this message");
    handleCancelEdit();
    return;
  }

  try {
    const token = localStorage.getItem("token");
    
    // Update UI immediately for better UX
    setMessages(prev => prev.map(msg => 
      msg._id === editingMessage ? { ...msg, text: message } : msg
    ));

    // Use a separate variable to avoid state closure issues
    const messageToSend = message;
    
    const { data } = await axios.put(
      `http://localhost:5000/api/chat/edit-message/${editingMessage}`, 
      { text: messageToSend },
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    if (data.success) {
      toast.success("Message updated successfully");
      
      // Send the edited message as a new message to get AI response
      setTimeout(async () => {
        try {
          const sendResponse = await axios.post("http://localhost:5000/api/chat/save-message", {
            message: messageToSend,
            type: "user",
            timestamp: new Date()
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (sendResponse.data.success && sendResponse.data.chat) {
            // Replace all messages with updated chat from backend
            const updatedMessages = sendResponse.data.chat.messages.map(msg => ({
              _id: msg._id,
              type: msg.type,
              text: msg.message,
              time: new Date(msg.timestamp),
              userId: msg.type === "user" ? user._id : "support",
              userName: msg.type === "user" ? user.name : "HomeFix AI Assistant"
            }));
            
            setMessages(updatedMessages);
          }
        } catch (sendError) {
          console.error("Error sending edited message:", sendError);
          toast.error("Failed to get AI response");
        }
      }, 500);
      
      handleCancelEdit();
    }
  } catch (error) {
    console.error("Error updating message:", error);
    toast.error(error.response?.data?.message || "Failed to update message");
    
    // Reload chat history to sync with server state
    await loadChatHistory();
    handleCancelEdit();
  }
};

  const handleDeleteMessage = async (messageId) => {
    if (messageId.startsWith('temp_') || messageId.startsWith('loading_') || messageId === 'welcome') {
      toast.error("Cannot delete this message");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(
        `http://localhost:5000/api/chat/delete-message/${messageId}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );

      if (data.success) {
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
        toast.success("Message deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  };

  // Handle key press in input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (loading) {
    return (
      <section className="instantchat-section">
        <div className="loading-chat">
          <div className="spinner"></div>
          Loading chat...
        </div>
      </section>
    );
  }

  return (
    <section className="instantchat-section">
      <header className="instantchat-header">
        <h1>
          Instant Chat with <span className="text-emerald-900">HomeFix AI Assistant</span>
        </h1>
        <p>Chat with our AI-powered support for instant help and solutions.</p>
        {user && (
          <div className="user-welcome">
            Welcome, <strong>{user.name}</strong>! You're connected to AI support.
          </div>
        )}
      </header>

      <main className="instantchat-main">
        <div className="chat-window">
          <div className="chat-header bg-emerald-900">
            <h3>AI Support Assistant</h3>
            <span className="online-status">
              <span className="dot bg-emerald-400"></span> 
              {isLoadingAI ? "AI is typing..." : "AI Online"}
            </span>
            {user && (
              <span className="user-info">
                Logged in as: {user.name}
              </span>
            )}
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div 
                key={msg._id} 
                data-message-id={msg._id}
                className={`message ${msg.type} ${editingMessage === msg._id ? 'editing-message' : ''} ${msg.isLoading ? 'loading-message' : ''}`}
              >
                <div className="message-content">
                  {msg.isLoading ? (
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    msg.text
                  )}
                  {msg.editedAt && !msg.isLoading && <span className="edited-badge"> (edited)</span>}
                </div>
                {!msg.isLoading && (
                  <div className="message-time">
                    {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {msg.type === "user" && user && (
                      <span className="message-sender"> • {user.name}</span>
                    )}
                  </div>
                )}
                {msg.type === "user" && msg.userId === user._id && 
                 !msg._id.startsWith('temp_') && !msg._id.startsWith('loading_') && msg._id !== 'welcome' && !msg.isLoading && (
                  <div className="message-actions">
                    <button 
                      onClick={() => handleEditMessage(msg)}
                      className="edit-btn"
                      title="Edit message"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="delete-btn"
                      title="Delete message"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input" onSubmit={handleSendMessage}>
            {isEditing && (
              <div className="edit-indicator bg-emerald-900">
                <span>Editing message</span>
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  className="cancel-edit-btn"
                >
                  Cancel
                </button>
              </div>
            )}
            <div className="input-container">
              <input 
                ref={messageInputRef}
                type="text" 
                placeholder={isEditing ? "Edit your message..." : "Type your message..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!user || isLoadingAI}
                className={isEditing ? 'editing-input' : ''}
              />
              <button 
                type="submit" 
                disabled={!message.trim() || !user || isLoadingAI}
                className={`send-btn ${isEditing ? 'bg-emerald-900' : 'bg-emerald-900'}`}
              >
                {isLoadingAI ? '⏳' : isEditing ? '✓' : '➤'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <section className="why-love">
        <h2>Why Users Love <span className="text-emerald-900">AI-Powered Chat</span></h2>
        <p>
          Powered by Google Gemini AI • Intelligent responses • 24/7 availability • Context-aware conversations
        </p>
      </section>

      <footer className="instantchat-footer bg-emerald-900">
        Powered by Google Gemini AI • Your conversations are saved securely • Available 24/7
      </footer>
    </section>
  );
};

export default InstantChat;