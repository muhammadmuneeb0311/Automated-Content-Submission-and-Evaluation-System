import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../store';
import axios from 'axios';
import RoleBasedSidebar from "../RoleBasedSidebar";

const FullEvaluators = () => {
  const { token } = useAuth();
  const [evaluators, setEvaluators] = useState([]);

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
        const res = await axiosInstance.get('/admin/approved-evaluators');
        setEvaluators(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [axiosInstance]);

  return (
    <div className="d-flex">
      <RoleBasedSidebar />
      <main className="flex-grow-1 p-4">
        <h2 className="mb-4">Approved Evaluators</h2>
        <div className="card">
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
                {evaluators.length > 0 ? (
                  evaluators.map((e) => (
                    <tr key={e._id}>
                      <td>{e.name}</td>
                      <td>{e.email}</td>
                      <td>{e.expertise || 'N/A'}</td>
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
      </main>
    </div>
  );
};

export default FullEvaluators;
