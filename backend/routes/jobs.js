const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  salary: String,
  type: String,
  description: String,
  postedBy: String,
  createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model("Job", JobSchema);

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "No token!" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token!" });
  }
};

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to get jobs!" });
  }
});

// Post a job
router.post("/", auth, async (req, res) => {
  try {
    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();
    res.json({ message: "Job posted successfully!", job });
  } catch (error) {
    res.status(500).json({ error: "Failed to post job!" });
  }
});

// Apply for job
router.post("/:id/apply", auth, async (req, res) => {
  try {
    res.json({ message: "Applied successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to apply!" });
  }
});

// Search jobs
router.get("/search/:keyword", async (req, res) => {
  try {
    const jobs = await Job.find({
      $or: [
        { title: { $regex: req.params.keyword, $options: "i" } },
        { company: { $regex: req.params.keyword, $options: "i" } },
        { location: { $regex: req.params.keyword, $options: "i" } }
      ]
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Search failed!" });
  }
});

module.exports = router;