import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../store";
import axios from "axios";


const TeamDashboard = () => {
  const { token, teamId: contextTeamId } = useAuth();
  const [teamName, setTeamName] = useState("");
  const [teamData, setTeamData] = useState({ submissions: [], score: 0, rank: "-" });
  const [pendingMembers, setPendingMembers] = useState([]);

  const decodedTeamId = useMemo(() => contextTeamId || localStorage.getItem("teamId") || "", [contextTeamId]);

  const axiosInstance = useMemo(() =>
    axios.create({ baseURL: "https://automated-content-submission-and-t73b.onrender.com/api", headers: { Authorization: token ? `Bearer ${token}` : "" } }),
    [token]
  );

  const teamAxios = useMemo(() =>
    axios.create({ baseURL: "https://automated-content-submission-and-t73b.onrender.com/api/teams", headers: { Authorization: token ? `Bearer ${token}` : "" } }),
    [token]
  );

  const handleApproveMember = async (memberId) => {
    try {
      const res = await teamAxios.put(`/member/approve/${memberId}`);
      alert(res.data.msg);
      setPendingMembers(prev => prev.filter(u => u._id !== memberId));
    } catch (err) {
      console.error(err);
      alert("Error approving member");
    }
  };

  useEffect(() => {
    const fetchTeamName = async () => {
      if (!token || !decodedTeamId) return;
      try {
        const res = await axiosInstance.get(`/teams/by-member/${decodedTeamId}`);
        setTeamName(res.data.name || "Unknown Team");
      } catch {
        setTeamName("N/A");
      }
    };
    fetchTeamName();
  }, [token, decodedTeamId, axiosInstance]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!decodedTeamId) return;
      try {
        const res = await axiosInstance.get(`/submissions/my-submissions/${decodedTeamId}`);
        setTeamData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubmissions();
  }, [decodedTeamId, axiosInstance]);

  useEffect(() => {
    const fetchPendingMembers = async () => {
      if (!decodedTeamId) return;
      try {
        const res = await axiosInstance.get(`/teams/pending-members/${decodedTeamId}`);
        setPendingMembers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPendingMembers();
  }, [decodedTeamId, axiosInstance]);

  return (
    <div className="d-flex">
    


      {/* Main Content */}
      <main className="flex-grow-1 p-4">
        <h2 className="mb-4">Team Leader Dashboard</h2>

        {/* Team Info */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white fw-bold">My Team Information</div>
          <div className="card-body">
            <p><strong>Team Name:</strong> {teamName || "N/A"}</p>
            <p><strong>Team ID:</strong> {decodedTeamId || "N/A"}</p>
          </div>
        </div>

        {/* Submissions */}
        <div className="card mb-4">
          <div className="card-header bg-success text-white fw-bold">Team Submissions</div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Topic</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Uploaded On</th>
                </tr>
              </thead>
              <tbody>
                {teamData.submissions?.length > 0 ? (
                  teamData.submissions.map((sub) => (
                    <tr key={sub._id}>
                      <td>{sub.topic}</td>
                      <td>
                        <span className={`badge text-uppercase ${
                          sub.status === "draft" ? "bg-secondary" :
                          sub.status === "submitted" ? "bg-info text-dark" :
                          sub.status === "under_evaluation" ? "bg-warning text-dark" :
                          "bg-success"
                        }`}>
                          {sub.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td>{sub.score ?? "-"}</td>
                      <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="text-center">No submissions yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Members */}
        <div className="card mb-4">
          <div className="card-header bg-warning fw-bold">Pending Members</div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr><th>Name</th><th>Email</th><th>Action</th></tr>
              </thead>
              <tbody>
                {pendingMembers.length > 0 ? pendingMembers.map(m => (
                  <tr key={m._id}>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>
                      <button className="btn btn-success btn-sm" onClick={() => handleApproveMember(m._id)}>Approve</button>
                    </td>
                  </tr>
                )) : <tr><td colSpan="3" className="text-center">No pending members</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

      
      </main>
    </div>
  );
};

export default TeamDashboard;
