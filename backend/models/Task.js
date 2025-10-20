import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, required: true },
  deadline: { type: Date, required: true },
  assignedTo: { type: [String], default: [] }, // multiple staff emails
  mentor: String,
  status: { type: String, default: "Pending" },
});

export default mongoose.model("Task", taskSchema);
