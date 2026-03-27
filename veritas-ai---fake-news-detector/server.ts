import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
let isUsingMongoDB = false;

async function connectDB() {
  console.log("--- MongoDB Connection Initialization ---");
  
  if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is UNDEFINED or EMPTY.");
    return;
  }

  console.log(`Found MONGODB_URI (Length: ${MONGODB_URI.length})`);
  let uri = MONGODB_URI.trim();
  
  // Auto-fix: Remove brackets if the user accidentally included them from the Atlas UI placeholder
  // e.g., mongodb+srv://user:<password>@... -> mongodb+srv://user:password@...
  if (uri.includes('<') && uri.includes('>')) {
    console.warn("Detected brackets in MONGODB_URI. Attempting to clean placeholder brackets...");
    uri = uri.replace('<', '').replace('>', '');
  }

  // Auto-fix: URL-encode special characters in the password if detected
  // If there are multiple '@' symbols, the password likely contains an unencoded '@'
  const atCount = (uri.match(/@/g) || []).length;
  if (atCount > 1) {
    console.warn("Detected multiple '@' symbols in MONGODB_URI. Attempting to URL-encode the password...");
    try {
      // Extract the part between '://' and the LAST '@'
      const protocolMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.*)@(.*)$/);
      if (protocolMatch) {
        const protocol = protocolMatch[1];
        const credentials = protocolMatch[2];
        const hostAndRest = protocolMatch[3];
        
        // Split credentials into user and pass
        const colonIndex = credentials.indexOf(':');
        if (colonIndex !== -1) {
          const user = credentials.substring(0, colonIndex);
          const pass = credentials.substring(colonIndex + 1);
          
          // Encode user and pass separately
          const encodedUser = encodeURIComponent(user);
          const encodedPass = encodeURIComponent(pass);
          
          uri = `${protocol}${encodedUser}:${encodedPass}@${hostAndRest}`;
          console.log("✅ Successfully URL-encoded credentials.");
          const newMasked = uri.replace(/:([^@]+)@/, ":****@");
          console.log(`New Masked URI: ${newMasked}`);
        }
      }
    } catch (e) {
      console.error("❌ Failed to auto-encode URI credentials:", e);
    }
  }

  // Mask URI for logging
  const maskedUri = uri.replace(/:([^@]+)@/, ":****@");
  console.log(`Connecting to: ${maskedUri}`);

  try {
    console.log(`Current Mongoose State: ${mongoose.connection.readyState}`);
    // Mongoose 6+ options are simplified
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000, // Increase timeout to 15s for slower clusters
    });
    
    isUsingMongoDB = true;
    console.log("✅ Successfully connected to MongoDB Cluster.");
    console.log(`New Mongoose State: ${mongoose.connection.readyState}`);
    
    // Log database name
    const dbName = mongoose.connection.name;
    console.log(`Using database: ${dbName}`);
    
  } catch (err) {
    isUsingMongoDB = false;
    console.error("❌ MongoDB connection failed:");
    if (err instanceof Error) {
      console.error(`Error Message: ${err.message}`);
      if (err.message.includes("ETIMEOUT") || err.message.includes("selection timed out")) {
        console.error("Connection timed out. This usually means:");
        console.error("1. Your IP is not whitelisted in MongoDB Atlas (Network Access).");
        console.error("2. The cluster URL is incorrect.");
      }
      if (err.message.includes("Authentication failed") || err.message.includes("auth failed")) {
        console.error("Invalid credentials. Please verify your username and password.");
        console.error("Note: If your password has special characters, ensure they are URL-encoded.");
      }
    } else {
      console.error(String(err));
    }
    console.log("⚠️ Falling back to local memory storage for this session.");
  }
}

// Handle connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB runtime error:', err);
  isUsingMongoDB = false;
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Reverting to local storage.');
  isUsingMongoDB = false;
});

connectDB();

const historySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  text: String,
  type: { type: String, enum: ['text', 'url'], default: 'text' },
  result: {
    status: String,
    credibilityScore: Number,
    explanation: String
  }
});

const HistoryModel = mongoose.models.History || mongoose.model("History", historySchema);

// In-memory fallback storage
let localHistory: any[] = [];

// API Routes
app.get("/api/history", async (req, res) => {
  try {
    if (isUsingMongoDB) {
      const history = await HistoryModel.find().sort({ timestamp: -1 });
      return res.json(history);
    }
    res.json(localHistory);
  } catch (error) {
    console.error("Fetch history error:", error);
    res.status(500).json({ error: "Failed to load history" });
  }
});

app.post("/api/history", async (req, res) => {
  try {
    const entryData = {
      text: req.body.text,
      result: req.body.result,
      timestamp: new Date()
    };

    if (isUsingMongoDB) {
      const newEntry = new HistoryModel(entryData);
      await newEntry.save();
      return res.status(201).json(newEntry);
    }

    const newEntry = { id: Date.now().toString(), ...entryData };
    localHistory.unshift(newEntry);
    res.status(201).json(newEntry);
  } catch (error) {
    console.error("Save history error:", error);
    res.status(500).json({ error: "Failed to save history" });
  }
});

app.get("/api/status", (req, res) => {
  res.json({ 
    database: isUsingMongoDB ? "MongoDB" : "Local Memory",
    connected: isUsingMongoDB
  });
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
