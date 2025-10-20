import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// GET all tasks (Admin)
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET tasks by staff
router.get("/:staffId", async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.staffId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add task
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, deadline, assignedTo, mentor } = req.body;
    const task = new Task({ title, description, priority, deadline, assignedTo, mentor, status: "Pending" });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update task status
router.put("/:id/status", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
