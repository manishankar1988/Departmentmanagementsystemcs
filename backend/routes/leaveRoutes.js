import express from "express";
import Leave from "../models/Leave.js";

const router = express.Router();

// GET all leaves
router.get("/", async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST apply leave
router.post("/", async (req, res) => {
  try {
    console.log("POST /leaves body:", req.body);
    const { staffEmail, from, to, type, reason, alternate } = req.body;
    if (!staffEmail || !from || !to || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const leave = new Leave({ staffEmail, from, to, type, reason, alternate, status: "Pending" });
    await leave.save();
    res.status(201).json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// PATCH update leave status
router.patch("/:id", async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE leave
router.delete("/:id", async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id);
    res.json({ message: "Leave deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
