import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../store";
import axios from "axios";



const AdminDashboard = () => {
  const { token } = useAuth();
  const [data, setData] = useState({
    totalTeams: 0,
    totalSubmissions: 0,
    evaluationsCompleted: 0,
    pendingApprovals: 0,
  });
  const [pendingMembers, setPendingMembers] = useState([]);
  const [approvedEvaluators, setApprovedEvaluators] = useState([]);
  const [latestSubmissions, setLatestSubmissions] = useState([]);

  const axiosInstance = useMemo(
    () =>
      axios.create({
        baseURL: "http://localhost:5000/api",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      }),
    [token]
  );

  
  

  const handleAssignEvaluators = async (teamId, submissionId) => {
    try {
      const res = await axiosInstance.post(`/admin/evaluators/assign/${teamId}/${submissionId}`);
      alert(res.data.message || "Evaluators assigned successfully ✅");
      const latestRes = await axiosInstance.get("/admin/submissions/latest");
      setLatestSubmissions(latestRes.data || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error assigning evaluators ❌");
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statusRes, pendingRes, evaluatorsRes, latestRes] = await Promise.all([
          axiosInstance.get("/admin/dashboard/status"),
          axiosInstance.get("/admin/pending"),
          axiosInstance.get("/admin/approved-evaluators"),
          axiosInstance.get("/admin/submissions/latest"),
        ]);

        const pendingTeams = (pendingRes.data.teams || []).map((t) => ({ ...t, role: "team" }));
        const pendingEvaluators = (pendingRes.data.evaluators || []).map((e) => ({ ...e, role: "evaluator" }));

        setData({ ...statusRes.data, pendingApprovals: pendingTeams.length + pendingEvaluators.length });
        setPendingMembers([...pendingTeams, ...pendingEvaluators]);
        setApprovedEvaluators(evaluatorsRes.data || []);
        setLatestSubmissions(latestRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAdminData();
  }, [axiosInstance]);

  // ✅ Define handleApprove here, before return
  const handleApprove = async (id) => {
    try {
      const res = await axiosInstance.put(`/admin/approve/${id}`);
      alert(res.data.msg);

      setPendingMembers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error approving user");
    }
  };
console.log(latestSubmissions);
const allEvaluated=latestSubmissions.filter(s=>s.status==="evaluated").length;


  return (
    <div className="d-flex">
 

      {/* ✅ Main Content */}
      <main className="flex-grow-1 p-4">
        <h2 className="mb-4">Admin Dashboard</h2>

        {/* Summary Cards */}
        <div className="row mb-4">
          {["Total Teams", "Total Submissions", "Evaluations Completed", "Pending Approvals"].map((title, i) => (
            <div className="col-md-3" key={i}>
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5>{title}</h5>
                  {title==="Evaluations Completed" ? <h3>{allEvaluated}</h3> :
                  <h3>{Object.values(data)[i]}</h3>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Users Table (show first 5) */}
        <div className="card mb-4">
          <div className="card-header bg-warning fw-bold d-flex justify-content-between align-items-center">
            <div>Pending Users</div>
            <div className="d-flex align-items-center gap-2">
              <small className="text-muted">Showing {Math.min(5, pendingMembers.length)} of {pendingMembers.length}</small>
              <a className="btn btn-link btn-sm" href="/admin/pending-users" target="_blank" rel="noopener noreferrer">View all »</a>
            </div>
          </div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingMembers.length > 0 ? (
                  pendingMembers.slice(0,5).map((user) => (
                    <tr key={user._id}>
                      <td>{user.name || user.teamName}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(user._id)}
                        >
                          Approve
                        </button>
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

        {/* Approved Evaluators (show first 5) */}
        <div className="card mb-4">
          <div className="card-header bg-success text-white fw-bold d-flex justify-content-between align-items-center">
            <div>Approved Evaluators</div>
            <div className="d-flex align-items-center gap-2">
              <small className="text-white-50">Showing {Math.min(5, approvedEvaluators.length)} of {approvedEvaluators.length}</small>
              <a className="btn btn-link btn-sm text-white-50" href="/admin/approved-evaluators" target="_blank" rel="noopener noreferrer">View all »</a>
            </div>
          </div>
          <div className="card-body p-0">
            <table className="table table-striped mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Expertise</th>
                </tr>
              </thead>
              <tbody>
                {approvedEvaluators.length > 0 ? (
                  approvedEvaluators.slice(0,5).map((e) => (
                    <tr key={e._id}>
                      <td>{e.name}</td>
                      <td>{e.email}</td>
                      <td>{e.expertise || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">No approved evaluators</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Submissions (show first 5) */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white fw-bold d-flex justify-content-between align-items-center">
            <div>Teams Submissions</div>
            <div className="d-flex align-items-center gap-2">
              <small className="text-white-50">Showing {Math.min(5, latestSubmissions.length)} of {latestSubmissions.length}</small>
              <a className="btn btn-link btn-sm text-white-50" href="/admin/submissions" target="_blank" rel="noopener noreferrer">View all »</a>
            </div>
          </div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Teams Name</th>
                  <th>Project Title</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {latestSubmissions.length > 0 ? (
                  latestSubmissions.slice(0,15).map((s) => (
                    <tr key={s._id}>
                      <td>{s.teamId?.teamName || "N/A"}</td>
                      <td>{s.topic || "Untitled"}</td>
                      <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            s.status === "evaluated"
                              ? "bg-success"
                              : s.status === "under_evaluation"
                              ? "bg-info"
                              : "bg-warning"
                          }`}
                        >
                          {s.status === "evaluated"
                            ? "Evaluated ✅"
                            : s.status === "under_evaluation"
                            ? "Under Evaluation ⏳"
                            : "Submitted 📨"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn ${
                            s.status === "under_evaluation"
                              ? "btn-secondary"
                              : s.status === "evaluated"
                              ? "btn-success"
                              : "btn-primary"
                          } btn-sm`}
                          disabled={!(s.status === "draft" || s.status === "submitted")}
                          onClick={() => handleAssignEvaluators(s.teamId._id, s._id)}
                        >
                          {s.status === "draft" && "Assign Evaluators"}
                          {s.status === "submitted" && "Assign Evaluators"}
                          {s.status === "under_evaluation" && "Assigned ✅"}
                          {s.status === "evaluated" && "Evaluation Done"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No submissions found</td>
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

export default AdminDashboard;
