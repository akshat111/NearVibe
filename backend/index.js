const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use("/api/admin", adminRoutes);

// Connect to database  

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to the NearVibe API");
});

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "NearVibe backend running ✅" });
});

// routes
app.use("/api/auth", authRoutes);

// events
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
