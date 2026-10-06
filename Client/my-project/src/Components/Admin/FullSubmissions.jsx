import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../store';
import axios from 'axios';
import RoleBasedSidebar from "../RoleBasedSidebar";

const FullSubmissions = () => {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState([]);

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
        const res = await axiosInstance.get('/admin/submissions/latest');
        setSubmissions(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [axiosInstance]);

  const handleAssignEvaluators = async (teamId, submissionId) => {
    try {
      const res = await axiosInstance.post(`/evaluators/assign/${teamId}/${submissionId}`);
      alert(res.data.message || 'Evaluators assigned successfully ✅');
      // refresh list
      const latestRes = await axiosInstance.get('/admin/submissions/latest');
      setSubmissions(latestRes.data || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error assigning evaluators ❌');
    }
  };

  return (
    <div className="d-flex">
      <RoleBasedSidebar />
      <main className="flex-grow-1 p-4">
        <h2 className="mb-4">All Submissions</h2>
        <div className="card">
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Teams Name</th>
                  <th>Project Title</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length > 0 ? (
                  submissions.map((s) => (
                    <tr key={s._id}>
                      <td>{s.teamId?.teamName || 'N/A'}</td>
                      <td>{s.topic || 'Untitled'}</td>
                      <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${s.status === 'evaluated' ? 'bg-success' : s.status === 'under_evaluation' ? 'bg-info' : 'bg-warning'}`}>
                          {s.status === 'evaluated' ? 'Evaluated ✅' : s.status === 'under_evaluation' ? 'Under Evaluation ⏳' : 'Submitted 📨'}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn ${s.status === 'under_evaluation' ? 'btn-secondary' : s.status === 'evaluated' ? 'btn-success' : 'btn-primary'} btn-sm`}
                          disabled={!(s.status === 'draft' || s.status === 'submitted')}
                          onClick={() => handleAssignEvaluators(s.teamId._id, s._id)}
                        >
                          {s.status === 'draft' && 'Assign Evaluators'}
                          {s.status === 'submitted' && 'Assign Evaluators'}
                          {s.status === 'under_evaluation' && 'Assigned ✅'}
                          {s.status === 'evaluated' && 'Evaluation Done'}
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

export default FullSubmissions;
