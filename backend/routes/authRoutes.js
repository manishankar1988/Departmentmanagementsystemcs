import express from "express";
import Staff from "../models/Staff.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await Staff.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    // Simple password check (plain text)
    if (user.password !== password)
      return res.status(401).json({ message: "Invalid password" });

    res.json({ user: { email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
