import React, { useState } from "react";
import API from "../api/axios";

export default function LeaveForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [alternate, setAlternate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type || !from || !to || !reason || !alternate) {
      alert("Please fill all fields!");
      return;
    }

    // Leave object includes type and status
    const leaveData = {
      type,
      from,
      to,
      reason,
      alternate,
      status: "Pending", // default pending, admin approves later
    };

    try {
      // Send to backend API
      await API.post("/leave", leaveData);
      alert("Leave request submitted successfully!");
      // Reset form
      setFrom("");
      setTo("");
      setType("");
      setReason("");
      setAlternate("");
    } catch (err) {
      console.error(err);
      alert("Error submitting leave request!");
    }
  };

  return (
    <div className="card p-3 shadow-sm">
      <h5>Apply Leave</h5>
      <form onSubmit={handleSubmit}>
        <label>Leave Type</label>
        <select
          className="form-select mb-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="Duty">Duty Leave</option>
          <option value="Casual">Casual Leave</option>
          <option value="Compensatory">Compensatory Leave</option>
        </select>

        <label>From</label>
        <input
          type="date"
          className="form-control mb-2"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />

        <label>To</label>
        <input
          type="date"
          className="form-control mb-2"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <label>Reason</label>
        <textarea
          className="form-control mb-2"
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <label>Alternate Arrangement</label>
        <input
          className="form-control mb-2"
          placeholder="Alternate arrangement"
          value={alternate}
          onChange={(e) => setAlternate(e.target.value)}
        />

        <button className="btn btn-warning w-100">Submit</button>
      </form>
    </div>
  );
}
