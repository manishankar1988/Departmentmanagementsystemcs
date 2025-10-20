import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // simple plaintext for now
  role: { type: String, enum: ["admin", "staff"], required: true },
});

export default mongoose.model("Staff", staffSchema);
