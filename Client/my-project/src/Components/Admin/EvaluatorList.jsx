import { useEffect, useState } from "react";

const EvaluatorList = () => {
  const [evaluators, setEvaluators] = useState([]);

  useEffect(() => {
    fetch("https://automated-content-submission-and-t73b.onrender.com/api/admin/evaluators")
      .then(res => res.json())
      .then(data => setEvaluators(data));
  }, []);

  const approveEvaluator = async (id) => {
    await fetch(`https://automated-content-submission-and-t73b.onrender.com/api/admin/approve-evaluator/${id}`, {
      method: "PUT"
    });
    setEvaluators(evaluators.map(ev => ev._id === id ? { ...ev, approved: true } : ev));
  };

  return (
    <div>
      <h2>Evaluators</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {evaluators.map(ev => (
            <tr key={ev._id}>
              <td>{ev.name}</td>
              <td>{ev.email}</td>
              <td>{ev.approved ? "Approved" : "Pending"}</td>
              <td>
                {!ev.approved && <button onClick={() => approveEvaluator(ev._id)}>Approve</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default EvaluatorList;
