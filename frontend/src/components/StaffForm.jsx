import React, { useState } from "react";
import API from "../api/axios";

export default function StaffForm({ onStaffAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/staff", { name, email });
    setName("");
    setEmail("");
    onStaffAdded();
  };

  return (
    <div className="card p-3 shadow-sm">
      <h5>Add Staff</h5>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-success w-100">Add Staff</button>
      </form>
    </div>
  );
}
