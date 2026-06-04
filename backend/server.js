const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Local MongoDB Connection String (100% immune to network/IP blocks)
const mongoURI = "mongodb://127.0.0.1:27017/jobportal";

console.log("Attempting to connect to local MongoDB...");

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log("=================================");
    console.log("MongoDB Connected Successfully! ✅");
    console.log("=================================");
  })
  .catch(err => {
    console.log("❌ MongoDB Connection Error:");
    console.error(err.message);
  });

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));

// Base Route
app.get("/", (req, res) => {
  res.send("Job Portal Backend Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});