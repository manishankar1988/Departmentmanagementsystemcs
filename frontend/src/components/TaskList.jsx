import React from "react";
import API from "../api/axios";

export default function TaskList({ tasks, isStaff, onStatusChange }) {
  const handleStatus = async (id, newStatus) => {
    await API.put(`/tasks/${id}`, { status: newStatus });
    onStatusChange();
  };

  return (
    <div>
      <h5 className="mt-4 mb-3">Tasks</h5>
      {tasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Deadline</th>
              <th>Status</th>
              {isStaff && <th>Update</th>}
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>{t.priority}</td>
                <td>{new Date(t.deadline).toLocaleDateString()}</td>
                <td>{t.status}</td>
                {isStaff && (
                  <td>
                    <select
                      className="form-select"
                      value={t.status}
                      onChange={(e) => handleStatus(t._id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
