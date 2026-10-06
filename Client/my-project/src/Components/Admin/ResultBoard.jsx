import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../store";

const ResultBoard = () => {
  const { token } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const role = localStorage.getItem("role");

  // Fetch all published results
  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/result/published",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) setResults(data.results);
      else setResults([]);
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Calculate & publish results
  const calculateAndPublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/result/calculate-publish",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) setResults(data.results);
      else console.error("Publish failed:", data.message);
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    console.log(results);
  }, [results]);

  if (loading) return <div>Loading results...</div>;

  return (
    <div className="container mt-4">
      <h2>Published Results</h2>

      {role === "admin" && (
        <button
          className="btn btn-primary mb-3"
          onClick={calculateAndPublish}
          disabled={publishing}
        >
          {publishing ? "Publishing..." : "Publish Results"}
        </button>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team Name</th>
            <th>Average Score</th>
          </tr>
        </thead>

        <tbody>
          {results.length > 0 ? (
            results
              .sort((a, b) => b.averageScore - a.averageScore)
              .map((result, index) => (
                <tr key={result._id || index}>
                  <td>{index + 1}</td>
                  <td>{result.teamId?.teamName || "N/A"}</td>
                  <td>{result.averageScore.toFixed(2)}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="3">No results available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResultBoard;