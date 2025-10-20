import React, { useState } from "react";
import API from "../api/axios";
import Select from "react-select";

export default function TaskForm({ staffList, onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [deadline, setDeadline] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/tasks", {
      title,
      priority,
      deadline,
      assignedTo: assignedTo.map((s) => s.value),
    });
    setTitle("");
    setDeadline("");
    setAssignedTo([]);
    onTaskAdded();
  };

  const options = staffList.map((s) => ({ value: s._id, label: s.name }));

  return (
    <div className="card p-3 shadow-sm">
      <h5>Add Task</h5>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="form-control mb-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Normal</option>
          <option>High</option>
        </select>
        <input
          type="date"
          className="form-control mb-2"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <Select
          isMulti
          options={options}
          value={assignedTo}
          onChange={setAssignedTo}
          placeholder="Assign staff"
        />
        <button className="btn btn-primary mt-3 w-100">Add Task</button>
      </form>
    </div>
  );
}
