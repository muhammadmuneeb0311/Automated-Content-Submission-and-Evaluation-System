import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const ScoreSubmission = () => {
    const { teamId } = useParams(); // ✅ get teamId from the URL
    const [criteria, setCriteria] = useState([]);
    const [scores, setScores] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const value = e.target.value === "" ? "" : Number(e.target.value);
        setScores({ ...scores, [e.target.name]: value });
    };

    useEffect(() => {
        const fetchCriteria = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("https://automated-content-submission-and-t73b.onrender.com/api/criteria", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = res.data?.data || [];
                setCriteria(data);

                // initialize scores object with criteria names as keys
                const initial = {};
                data.forEach(c => {
                    const key = c.criteria_name.replace(/\s+/g, "_").toLowerCase();
                    initial[key] = ""; // empty until evaluator selects
                });
                setScores(initial);
            } catch (err) {
                console.error("Error fetching criteria:", err);
            }
        };
        fetchCriteria();
    }, []);



    const navigate = useNavigate(); // 👈 make sure this is at the top of your component

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `https://automated-content-submission-and-t73b.onrender.com/api/scores/team/${teamId}`,
                { scores },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("📤 Sending to:", `https://automated-content-submission-and-t73b.onrender.com/api/scores/team/${teamId}`);
            setMessage(res.data.message);

            // mark submitted and redirect to evaluator dashboard
            setSubmitted(true);
            navigate("/EvaluatorDashboard");
        } catch (err) {
            setMessage(err.response?.data?.message || "Error submitting score ❌");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container mt-4">
            <h2 className="mb-3">Evaluator Score Submission</h2>
            <p><strong>Team ID:</strong> {teamId}</p> {/* ✅ Show team ID from URL */}

            <form onSubmit={handleSubmit}>
                {criteria.length === 0 && <p>Loading criteria...</p>}

                {criteria.map((c) => {
                    const key = c.criteria_name.replace(/\s+/g, "_").toLowerCase();
                    const max = c.max_marks || 5;
                    const val = scores[key] === "" || scores[key] === undefined ? "" : scores[key];
                    return (
                        <div className="mb-3" key={c._id}>
                            <label className="fw-semibold">{c.criteria_name}</label>
                            {c.description && <div className="small text-muted">{c.description}</div>}

                            <div className="d-flex align-items-center mt-2">
                                <select
                                    name={key}
                                    value={val}
                                    onChange={handleChange}
                                    className="form-select me-3"
                                    required
                                    disabled={submitted}
                                >
                                    <option value="">Select</option>
                                    {Array.from({ length: max + 1 }).map((_, idx) => (
                                        <option key={idx} value={idx}>{idx}</option>
                                    ))}
                                </select>

                                <div className="small text-muted">
                                    {val === "" ? `Not rated yet — 0 out of ${max}` : `${val} out of ${max}`}
                                </div>
                            </div>
                        </div>
                    );
                })}

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || submitted || criteria.length === 0}
                >
                    {submitted ? "Submitted ✅" : loading ? "Submitting..." : "Submit Score"}
                </button>
            </form>

            {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
    );
};

export default ScoreSubmission;
