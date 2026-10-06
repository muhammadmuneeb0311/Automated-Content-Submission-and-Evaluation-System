// src/pages/EvaluatorSubmissions.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store";
import axios from "axios";

const EvaluatorSubmissions = () => {
  const { token } = useAuth();
  const [assignedSubmissions, setAssignedSubmissions] = useState([]);
  const navigate = useNavigate();

  // Axios instance with JWT
  const axiosInstance = useMemo(
    () =>
      axios.create({
        baseURL: "http://localhost:5000/api",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      }),
    [token]
  );

  // Fetch assigned submissions
  const fetchAssignedSubmissions = async () => {
    try {
      const res = await axiosInstance.get("/evaluators/assigned");
      setAssignedSubmissions(res.data || []);
    } catch (err) {
      console.error("Error fetching assigned submissions:", err);
    }
  };

  useEffect(() => {
    if (token) fetchAssignedSubmissions();
  }, [token]);

  const handleEvaluate = (teamId) => {
    navigate(`/score-submission/${teamId}`);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Assigned Submissions</h2>

      {assignedSubmissions.length === 0 ? (
        <p>No submissions assigned yet.</p>
      ) : (
        assignedSubmissions.map((assignment) => {
          const status = assignment.submissionId?.status;
          const isEvaluated = status === "evaluated";
          const hasSubmitted = assignment.hasSubmitted;

          return (
            <div
              key={assignment._id}
              className="card mb-3 p-3 shadow-sm"
            >
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
    </div>
  );
};

export default EvaluatorSubmissions;