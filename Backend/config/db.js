import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    console.log(`🔗 Connection URL: ${process.env.MONGO_URI}`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

export default mongoose;