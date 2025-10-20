import express from "express";
import Staff from "../models/Staff.js";

const router = express.Router();

// GET all staff
router.get("/", async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add staff
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const staff = new Staff({ name, email, password, role });
    await staff.save();
    res.status(201).json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE staff
router.delete("/:id", async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
