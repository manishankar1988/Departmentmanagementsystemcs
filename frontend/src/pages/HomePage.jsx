import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; // your Axios instance

export default function Home() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksRes = await API.get("/tasks");
        const leavesRes = await API.get("/leaves");
        setTasks(tasksRes.data);
        setLeaves(leavesRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <img
        src="Sahrdayaheader.png"
        alt="Sahrdaya Header"
        style={{ width: "100%", maxWidth: "800px", height: "auto" }}
      />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Department Dashboard</h3>
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>

      {/* Tasks */}
      <div className="card mb-4 p-3">
        <h5>Tasks</h5>
        <table className="table table-bordered mt-2">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Assigned Staff</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.priority}</td>
                <td>{task.deadline}</td>
                <td>{task.status || "Pending"}</td>
                <td>{task.assignedTo.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leaves */}
      <div className="card p-3">
        <h5>Leave Applications & Alternate Arrangements</h5>
        <table className="table table-bordered mt-2">
          <thead className="table-light">
            <tr>
              <th>Staff</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Alternate Arrangement</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.staff}</td>
                <td>{leave.type}</td>
                <td>{leave.from}</td>
                <td>{leave.to}</td>
                <td>{leave.reason}</td>
                <td>{leave.alternate}</td>
                <td>{leave.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
