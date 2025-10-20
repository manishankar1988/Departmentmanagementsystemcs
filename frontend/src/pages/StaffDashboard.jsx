import React, { useState, useEffect } from "react";
import API from "../api/axios";
import "./StaffForm.css";

export default function StaffDashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [newStatus, setNewStatus] = useState({});
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch tasks and leaves for logged-in staff
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksRes = await API.get("/tasks");
        const leavesRes = await API.get("/leaves");

        // Filter only assigned tasks and staff's leaves
        const myTasks = tasksRes.data.filter((t) => t.assignedTo.includes(user.email));
        const myLeaves = leavesRes.data.filter((l) => l.staffEmail === user.email);

        setTasks(myTasks);
        setLeaves(myLeaves);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch tasks or leaves.");
      }
    };
    fetchData();
  }, [user.email]);

  // Update task status
  const handleStatusUpdate = async (taskId) => {
    const status = newStatus[taskId];
    if (!status) return;
    try {
      const res = await API.patch(`/tasks/${taskId}`, { status });
      setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
      setMessage(`Task updated to ${status}`);
      setNewStatus({ ...newStatus, [taskId]: "" });
    } catch (err) {
      console.error(err);
      setMessage("Failed to update task status.");
    }
  };

  // Apply leave
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const type = form.type.value;
    const from = form.from.value;
    const to = form.to.value;
    const reason = form.reason.value;
    const alternate = form.alternate.value;

    try {
      const res = await API.post("/leaves", { staffEmail: user.email, type, from, to, reason, alternate, status: "Pending" });
      setLeaves([...leaves, res.data]);
      setMessage("Leave applied successfully and pending admin approval!");
      form.reset();
    } catch (err) {
      console.error(err);
      setMessage("Failed to apply leave.");
    }
  };

  // Delete leave
  const handleDeleteLeave = async (id) => {
    if (!window.confirm("Delete this leave?")) return;
    try {
      await API.delete(`/leaves/${id}`);
      setLeaves(leaves.filter((l) => l._id !== id));
      setMessage("Leave deleted successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete leave.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Welcome, {user.email}</h3>
        <button className="btn btn-danger" onClick={onLogout}>Logout</button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {/* Tasks Table */}
      <div className="card p-3 mb-4">
        <h5>My Tasks</h5>
        <table className="table table-bordered mt-2">
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>{t.priority}</td>
                <td>{new Date(t.deadline).toLocaleDateString()}</td>
                <td>{t.status}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={newStatus[t._id] || ""}
                    onChange={(e) => setNewStatus({ ...newStatus, [t._id]: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="Pending">Pending</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button className="btn btn-sm btn-primary mt-1" onClick={() => handleStatusUpdate(t._id)}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Apply Leaves */}
      <div className="card p-3 mb-4">
        <h5>Apply Leave</h5>
        <form onSubmit={handleApplyLeave} className="row g-2">
          <div className="col-md-2">
            <select name="type" className="form-select" required>
              <option value="">Select Type</option>
              <option value="Duty">Duty Leave</option>
              <option value="Casual">Casual Leave</option>
              <option value="Compensatory">Compensatory Leave</option>
            </select>
          </div>
          <div className="col-md-2">
            <input type="date" name="from" className="form-control" required />
          </div>
          <div className="col-md-2">
            <input type="date" name="to" className="form-control" required />
          </div>
          <div className="col-md-3">
            <input type="text" name="reason" placeholder="Reason" className="form-control" required />
          </div>
          <div className="col-md-3">
            <input type="text" name="alternate" placeholder="Alternate Arrangement" className="form-control" required />
          </div>
          <div className="col-md-2 mt-2">
            <button className="btn btn-success w-100">Apply</button>
          </div>
        </form>

        {/* Applied Leaves Table */}
        {leaves.length > 0 && (
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Alternate</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l._id}>
                  <td>{l.type}</td>
                  <td>{new Date(l.from).toLocaleDateString()}</td>
                  <td>{new Date(l.to).toLocaleDateString()}</td>
                  <td>{l.reason}</td>
                  <td>{l.alternate}</td>
                  <td>{l.status}</td>
                  <td>
                    {l.status === "Pending" && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteLeave(l._id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
