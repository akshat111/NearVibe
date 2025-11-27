const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
