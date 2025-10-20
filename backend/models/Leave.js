import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  staffEmail: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  type: { type: String, enum: ["Duty", "Casual", "Compensatory"], required: true },
  reason: { type: String },
  alternate: { type: String },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Leave", leaveSchema);
