import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../store';
import axios from 'axios';
import RoleBasedSidebar from "../RoleBasedSidebar";

const FullPendingUsers = () => {
  const { token } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);

  const axiosInstance = useMemo(
    () =>
      axios.create({
        baseURL: 'https://automated-content-submission-and-t73b.onrender.com/api',
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      }),
    [token]
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get('/admin/pending');
        const pendingTeams = (res.data.teams || []).map((t) => ({ ...t, role: 'team' }));
        const pendingEvaluators = (res.data.evaluators || []).map((e) => ({ ...e, role: 'evaluator' }));
        setPendingUsers([...pendingTeams, ...pendingEvaluators]);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [axiosInstance]);

  const handleApprove = async (id) => {
    try {
      const res = await axiosInstance.put(`/admin/approve/${id}`);
      alert(res.data.msg || 'Approved');
      setPendingUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Error approving user');
    }
  };

  return (
    <div className="d-flex">
      <RoleBasedSidebar />
      <main className="flex-grow-1 p-4">
        <h2 className="mb-4">All Pending Users</h2>
        <div className="card">
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.length > 0 ? (
                  pendingUsers.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name || u.teamName}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(u._id)}>Approve</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No pending users</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FullPendingUsers;
