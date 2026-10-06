import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store";
import axios from "axios";

const EvaluatorDashboard = () => {
  const { token } = useAuth();
  const [assignedSubmissions, setAssignedSubmissions] = useState([]);
  const [profile, setProfile] = useState(null); // ✅ store evaluator profile
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Setup axios with token
  const axiosInstance = useMemo(
    () =>
      axios.create({
        baseURL: "http://localhost:5000/api",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      }),
    [token]
  );

  // ✅ Fetch assigned submissions
  const fetchAssignedSubmissions = async () => {
    try {
      const res = await axiosInstance.get("/evaluators/assigned");
      setAssignedSubmissions(res.data || []);
    } catch (err) {
      console.error("Error fetching assigned submissions:", err);
    }
  };

  // ✅ Fetch evaluator profile
const fetchProfile = async () => {
  if (!token) return; // wait until token is available
  try {
    const res = await axiosInstance.get("/evaluators/me");
    setProfile(res.data);
  } catch (err) {
    console.error("Error fetching evaluator profile:", err.message);
  }
};

  // ✅ Refresh data on mount or after navigating back from score page
  useEffect(() => {
    fetchProfile();
    fetchAssignedSubmissions();
  }, [axiosInstance, location.pathname]);

  // ✅ Handle Evaluate button
  const handleEvaluate = (teamId) => {
    navigate(`/score-submission/${teamId}`);
  };

  return (
    <div className="d-flex">
      {/* Main Content */}
      <main className="flex-grow-1 p-4">
        <h2>Evaluator Dashboard</h2>

        {/* Profile Info */}
        {profile && (
          <div className="mb-4 p-3 border rounded shadow-sm bg-light">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        )}

        {/* Assigned Submissions */}
        {assignedSubmissions.length === 0 ? (
          <p>No submissions assigned yet.</p>
        ) : (
          assignedSubmissions.map((assignment) => {
            const status = assignment.submissionId?.status;
            const isEvaluated = status === "evaluated";
            const hasSubmitted = assignment.hasSubmitted === true;

            return (
              <div key={assignment._id} className="card mb-3 p-3 shadow-sm">
                <h5>Team: {assignment.submissionId?.teamId?.teamName || "N/A"}</h5>
                <p><strong>Topic:</strong> {assignment.submissionId?.topic || "N/A"}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge text-uppercase ${
                      status === "submitted"
                        ? "bg-info text-dark"
                        : status === "under_evaluation"
                        ? "bg-warning text-dark"
                        : isEvaluated
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {status?.replace(/_/g, " ") || "N/A"}
                  </span>
                </p>
                <p><strong>Assigned Date:</strong> {new Date(assignment.assignedDate).toLocaleString()}</p>
                <p>
                  <strong>Video Link:</strong>{" "}
                  {assignment.submissionId?.videoLink ? (
                    <a
                      href={assignment.submissionId.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch Video
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
                <button
                  className={`btn ${isEvaluated || hasSubmitted ? "btn-success" : "btn-primary"}`}
                  disabled={isEvaluated || hasSubmitted}
                  onClick={() => handleEvaluate(assignment.submissionId?.teamId?._id)}
                >
                  {isEvaluated ? "Evaluated ✅" : hasSubmitted ? "Submitted ✅" : "Evaluate"}
                </button>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};

export default EvaluatorDashboard;