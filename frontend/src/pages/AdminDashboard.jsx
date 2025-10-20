import React, { useState, useEffect } from "react";
import API from "../api/axios";
import "./AdminDashboard.css";

export default function AdminDashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    deadline: "",
    assignedTo: [], // multiple staff
    mentor: "",
  });
  const [staffData, setStaffData] = useState({ name: "", email: "", password: "", role: "staff" });
  const [message, setMessage] = useState("");

  // Fetch tasks, leaves, staff
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, leavesRes, staffRes] = await Promise.all([
          API.get("/tasks"),
          API.get("/leaves"),
          API.get("/staff"),
        ]);
        setTasks(tasksRes.data);
        setLeaves(leavesRes.data);
        setStaffList(staffRes.data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch data from server.");
      }
    };
    fetchData();
  }, []);

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskData.title || !taskData.priority || !taskData.deadline || taskData.assignedTo.length === 0) {
      setMessage("Fill all required fields and assign at least one staff.");
      return;
    }
    try {
      const res = await API.post("/tasks", taskData);
      setTasks([...tasks, res.data]);
      setMessage("Task added successfully!");
      setTaskData({ title: "", description: "", priority: "Low", deadline: "", assignedTo: [], mentor: "" });
    } catch (err) {
      console.error(err);
      setMessage("Failed to add task.");
    }
  };

  // Add new staff
  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/staff", staffData);
      setStaffList([...staffList, res.data]);
      setMessage("Staff added successfully!");
      setStaffData({ name: "", email: "", password: "", role: "staff" });
    } catch (err) {
      console.error(err);
      setMessage("Failed to add staff.");
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
      setMessage("Task deleted successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete task.");
    }
  };

  // Delete staff
  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Delete this staff?")) return;
    try {
      await API.delete(`/staff/${id}`);
      setStaffList(staffList.filter((s) => s._id !== id));
      setMessage("Staff deleted successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete staff.");
    }
  };

  // Approve/Reject Leave
  const handleLeaveAction = async (leave, status) => {
    try {
      const res = await API.patch(`/leaves/${leave._id}`, { status });
      setLeaves(leaves.map((l) => (l._id === leave._id ? res.data : l)));
      setMessage(`Leave ${status} successfully!`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update leave.");
    }
  };

  // Handle checkbox selection
  const handleStaffCheckbox = (email) => {
    if (taskData.assignedTo.includes(email)) {
      setTaskData({ ...taskData, assignedTo: taskData.assignedTo.filter(e => e !== email) });
    } else {
      setTaskData({ ...taskData, assignedTo: [...taskData.assignedTo, email] });
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={onLogout}>Logout</button>
      </div>

      {message && <p className="text-success">{message}</p>}

      {/* Add Task */}
      <div className="card p-3 mb-4">
        <h4>Add Task</h4>
        <form onSubmit={handleAddTask} className="row g-2">
          <div className="col-md-3">
            <input type="text" placeholder="Title" className="form-control" value={taskData.title} onChange={e => setTaskData({...taskData, title: e.target.value})} required/>
          </div>
          <div className="col-md-3">
            <input type="text" placeholder="Description" className="form-control" value={taskData.description} onChange={e => setTaskData({...taskData, description: e.target.value})}/>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={taskData.priority} onChange={e => setTaskData({...taskData, priority: e.target.value})}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
          <div className="col-md-2">
            <input type="date" className="form-control" value={taskData.deadline} onChange={e => setTaskData({...taskData, deadline: e.target.value})} required/>
          </div>
          <div className="col-md-6 mt-2">
            <label>Assign Staff:</label>
            <div className="d-flex flex-wrap">
              {staffList.map(staff => (
                <div key={staff._id} className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={staff.email}
                    checked={taskData.assignedTo.includes(staff.email)}
                    onChange={() => handleStaffCheckbox(staff.email)}
                  />
                  <label className="form-check-label">{staff.name} ({staff.email})</label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-2 mt-2">
            <input type="text" placeholder="Mentor" className="form-control" value={taskData.mentor} onChange={e => setTaskData({...taskData, mentor: e.target.value})}/>
          </div>
          <div className="col-md-2 mt-2">
            <button className="btn btn-primary w-100">Add Task</button>
          </div>
        </form>
      </div>

      {/* Tasks Table */}
      <div className="card p-3 mb-4">
        <h4>Tasks</h4>
        <table className="table table-bordered">
          <thead>
            <tr><th>Title</th><th>Assigned To</th><th>Mentor</th><th>Priority</th><th>Deadline</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>{t.assignedTo.join(", ")}</td>
                <td>{t.mentor}</td>
                <td>{t.priority}</td>
                <td>{new Date(t.deadline).toLocaleDateString()}</td>
                <td>{t.status || "Pending"}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteTask(t._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff */}
      <div className="card p-3 mb-4">
        <h4>Add Staff</h4>
        <form onSubmit={handleAddStaff} className="row g-2">
          <div className="col-md-3">
            <input type="text" placeholder="Name" className="form-control" value={staffData.name} onChange={e=>setStaffData({...staffData,name:e.target.value})} required/>
          </div>
          <div className="col-md-3">
            <input type="email" placeholder="Email" className="form-control" value={staffData.email} onChange={e=>setStaffData({...staffData,email:e.target.value})} required/>
          </div>
          <div className="col-md-3">
            <input type="password" placeholder="Password" className="form-control" value={staffData.password} onChange={e=>setStaffData({...staffData,password:e.target.value})} required/>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={staffData.role} onChange={e=>setStaffData({...staffData,role:e.target.value})}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="col-md-2 mt-2">
            <button className="btn btn-primary w-100">Add Staff</button>
          </div>
        </form>
      </div>

      {/* Staff Table */}
      <div className="card p-3 mb-4">
        <h4>Staff</h4>
        <table className="table table-bordered">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {staffList.map(s => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.role}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteStaff(s._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leaves Table */}
      <div className="card p-3 mb-4">
        <h4>Leaves</h4>
        <table className="table table-bordered">
          <thead>
            <tr><th>Staff</th><th>From</th><th>To</th><th>Type</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {leaves.map(l => (
              <tr key={l._id}>
                <td>{l.staffEmail}</td>
                <td>{new Date(l.from).toLocaleDateString()}</td>
                <td>{new Date(l.to).toLocaleDateString()}</td>
                <td>{l.type}</td>
                <td>{l.status}</td>
                <td>
                  <button className="btn btn-success btn-sm me-1" onClick={() => handleLeaveAction(l, "Approved")}>Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleLeaveAction(l, "Rejected")}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
