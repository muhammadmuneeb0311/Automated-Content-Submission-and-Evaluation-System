import { useState, useMemo } from "react";
import { useAuth } from "../store";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadSubmission = () => {
  const { token, teamId } = useAuth();  
  // const decoded = useMemo(() => (token ? jwtDecode(token) : {}), [token]);
  // const userId = decoded.id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    videoLink: "",
    topic: "",
    description: "",
    learningOutcomes: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: "http://localhost:5000/api",
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [token]);

  // const [teamData, setTeamData] = useState({
  //   team: null,
  //   totalVideos: 0,
  //   submissions: []
  // });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidUrl(form.videoLink)) {
      setMessage("❌ Please enter a valid video link");
      return;
    }

    if (!teamId || teamId === 'undefined' || teamId === 'null') {
      setMessage("❌ No team assigned to your account");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        topic: form.topic,
        videoLink: form.videoLink,
        description: form.description,
        learningOutcomes: form.learningOutcomes,
      };

      await axiosInstance.post(`/submissions/submit/${teamId}`, payload);

      setMessage("✅ Submission uploaded successfully!");
      setForm({ videoLink: "", topic: "", description: "", learningOutcomes: "" });
      setTimeout(() => navigate("/my-submissions"), 1500);
    } catch (err) {
      console.error(err);
      setMessage(`❌ Error: ${err.response?.data?.message || "Network error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {/* Card Container */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
              <h4 className="card-title mb-0">
                <i className="bi bi-cloud-upload me-2"></i>
                Upload Video Submission
              </h4>
            </div>
            
            <div className="card-body p-4">
              {/* Alert Message */}
              {message && (
                <div 
                  className={`alert ${
                    message.includes("✅") 
                      ? "alert-success" 
                      : message.includes("❌") 
                        ? "alert-danger" 
                        : "alert-info"
                  } alert-dismissible fade show`}
                  role="alert"
                >
                  {message}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setMessage("")}
                  ></button>
                </div>
              )}

              {/* Upload Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="videoLink" className="form-label">
                    <i className="bi bi-link-45deg me-1"></i>
                    Video Link
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="videoLink"
                    name="videoLink"
                    placeholder="https://youtube.com/watch?v=..."
                    value={form.videoLink}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text">
                    Enter YouTube or other video platform URL
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="topic" className="form-label">
                    <i className="bi bi-chat-square-text me-1"></i>
                    Topic
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="topic"
                    name="topic"
                    placeholder="Enter the video topic"
                    value={form.topic}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    <i className="bi bi-card-text me-1"></i>
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    placeholder="Describe your video content..."
                    rows="3"
                    value={form.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label htmlFor="learningOutcomes" className="form-label">
                    <i className="bi bi-lightbulb me-1"></i>
                    Learning Outcomes
                  </label>
                  <textarea
                    className="form-control"
                    id="learningOutcomes"
                    name="learningOutcomes"
                    placeholder="What will viewers learn from this video?"
                    rows="3"
                    value={form.learningOutcomes}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-upload me-2"></i>
                      Upload Submission
                    </>
                  )}
                </button>
              </form>

              {/* Video Preview */}
              {(form.videoLink.includes("youtube.com") || form.videoLink.includes("youtu.be")) && (
                <div className="mt-5 pt-4 border-top">
                  <h5 className="mb-3">
                    <i className="bi bi-play-circle me-2"></i>
                    Video Preview
                  </h5>
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={
                        form.videoLink.includes("watch?v=")
                          ? form.videoLink.replace("watch?v=", "embed/")
                          : form.videoLink.includes("youtu.be/")
                            ? form.videoLink.replace("youtu.be/", "www.youtube.com/embed/")
                            : form.videoLink
                      }
                      title="Video Preview"
                      allowFullScreen
                      className="rounded"
                    ></iframe>
                  </div>
                  <div className="text-muted small mt-2 text-center">
                    Preview of your video submission
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center mt-3">
            <small className="text-muted">
              Need help? Make sure your video link is accessible and all fields are filled properly.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSubmission;