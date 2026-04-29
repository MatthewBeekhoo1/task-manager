const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = verified;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// CREATE - link task to the logged-in user
router.post("/", authMiddleware, async (req, res) => {
  const task = new Task({
    title: req.body.title,
    user: req.user.userId
  });
  const saved = await task.save();
  res.json(saved);
});

// READ - only return tasks belonging to the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ user: req.user.userId });
  res.json(tasks);
});

// UPDATE - only update if the task belongs to the logged-in user
router.put("/:id", authMiddleware, async (req, res) => {
  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userId },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Task not found" });
  res.json(updated);
});

// DELETE - only delete if the task belongs to the logged-in user
router.delete("/:id", authMiddleware, async (req, res) => {
  const deleted = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId
  });
  if (!deleted) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Deleted" });
});

module.exports = router;