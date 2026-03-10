// models/Chat.js
import mongoose from "mongoose";

// models/Chat.js - Remove custom _id generation
const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["user", "support"],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sender: {
    type: String,
    required: true
  },
  editedAt: {
    type: Date
  }
}, { _id: true }); // Let Mongoose handle _id automatically

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  userName: {
    type: String,
    required: true
  },
  messages: [messageSchema],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;