// routes/chat.js
import express from "express";
import Chat from "../models/Chat.js";
import protect from "../middleware/authMiddleware.js";

import { generateAIResponse } from "../services/geminiService.js";
const router = express.Router();

// Save message route with AI integration
router.post("/save-message", protect, async (req, res) => {
  try {
    const { message, type, timestamp } = req.body;
    const userId = req.user._id;
    const userName = req.user.name;

    console.log(" Saving message for user:", userId, "Message:", message);

    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = new Chat({
        userId,
        userName,
        messages: []
      });
      console.log(" Created new chat session");
    }

    // Add user message
    chat.messages.push({
      message,
      type,
      timestamp: timestamp || new Date(),
      sender: type === "user" ? userName : "HomeFix AI Assistant"
    });

    console.log(" User message saved");

    // If it's a user message, generate AI response
    if (type === "user") {
      try {
        console.log(" Generating AI response...");
        
        // Get recent chat history for context
        const recentMessages = chat.messages.slice(-10).map(msg => ({
          type: msg.type,
          message: msg.message
        }));

        console.log(` Using ${recentMessages.length} previous messages for context`);

        // Generate AI response using Gemini
        const aiResponse = await generateAIResponse(message, recentMessages);
        
        console.log(" AI Response:", aiResponse);
        
        // Add AI response to chat
        chat.messages.push({
          message: aiResponse,
          type: "support",
          timestamp: new Date(),
          sender: "HomeFix AI Assistant"
        });
        
        console.log(" AI response added to chat");
        
      } catch (aiError) {
        console.error(" Error generating AI response:", aiError);
        
        // Better fallback responses based on message content
        const userMessage = message.toLowerCase();
        let fallbackResponse = "I understand you need assistance with home services. Could you please provide more details about what you're looking for?";
        
        if (userMessage.includes('emergency') || userMessage.includes('urgent')) {
          fallbackResponse = "I understand this is urgent! For emergency services, please call our 24/7 hotline at 1-800-HOMEFIX for immediate assistance.";
        } else if (userMessage.includes('book') || userMessage.includes('schedule') || userMessage.includes('appointment')) {
          fallbackResponse = "I'd be happy to help you schedule a service! What type of service do you need, and what's your preferred date and time?";
        } else if (userMessage.includes('price') || userMessage.includes('cost') || userMessage.includes('how much')) {
          fallbackResponse = "I can help you get pricing information! We provide free, no-obligation quotes. Could you tell me which service you're interested in and any specific details?";
        }
        
        chat.messages.push({
          message: fallbackResponse,
          type: "support",
          timestamp: new Date(),
          sender: "HomeFix AI Assistant"
        });
      }
    }

    chat.lastActivity = new Date();
    await chat.save();

    console.log(" Chat saved successfully");

    res.json({
      success: true,
      message: "Message saved successfully",
      chat
    });
  } catch (error) {
    console.error(" Error saving message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save message"
    });
  }
});
// Get chat history
router.get("/history", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const chat = await Chat.findOne({ userId });

    if (!chat || !chat.messages || chat.messages.length === 0) {
      return res.json({
        success: true,
        messages: [
          {
            _id: "welcome",
            type: "support",
            text: "Hello 👋! Welcome to HomeFix Support. How can we assist you today?",
            time: new Date(),
            userId: "support"
          }
        ]
      });
    }

    // Convert stored messages to frontend format
    const messages = chat.messages.map(msg => ({
      _id: msg._id,
      type: msg.type,
      text: msg.message, // Changed from msg.message to msg.text for frontend
      time: new Date(msg.timestamp),
      userId: msg.type === "user" ? userId : "support",
      sender: msg.sender
    }));

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error("Error loading chat history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load chat history"
    });
  }
});

// Edit message - FIXED: Better response format
router.put("/edit-message/:messageId", protect, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;

    console.log("Editing message:", messageId, "New text:", text);

    // Find chat containing the message
    const chat = await Chat.findOne({ "messages._id": messageId });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat session not found"
      });
    }

    // Check if user owns this chat session
    if (chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit messages in this chat"
      });
    }

    // Find and update the specific message
    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    // Check if it's a user message (not support message)
    if (message.type !== "user") {
      return res.status(403).json({
        success: false,
        message: "Can only edit user messages"
      });
    }

    message.message = text;
    message.editedAt = new Date();
    
    await chat.save();

    res.json({
      success: true,
      message: "Message updated successfully",
      updatedMessage: {
        _id: message._id,
        text: message.message, // Send as 'text' for frontend consistency
        type: message.type,
        time: message.timestamp,
        sender: message.sender
      }
    });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message"
    });
  }
});

// Delete message
router.delete("/delete-message/:messageId", protect, async (req, res) => {
  try {
    const { messageId } = req.params;

    console.log("Deleting message:", messageId);

    const chat = await Chat.findOne({ "messages._id": messageId });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat session not found"
      });
    }

    // Check if user owns this chat session
    if (chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete messages from this chat"
      });
    }

    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    // Check if it's a user message (not support message)
    if (message.type !== "user") {
      return res.status(403).json({
        success: false,
        message: "Can only delete user messages"
      });
    }

    // Remove the message using pull
    chat.messages.pull({ _id: messageId });
    await chat.save();

    res.json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message"
    });
  }
});

export default router;