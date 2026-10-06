import { useEffect, useState } from "react";

const AssignEvaluator = () => {
  const [teams, setTeams] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedEvaluator, setSelectedEvaluator] = useState("");

  useEffect(() => {
    fetch("https://automated-content-submission-and-t73b.onrender.com/api/admin/teams").then(res => res.json()).then(setTeams);
    fetch("https://automated-content-submission-and-t73b.onrender.com/api/admin/evaluators").then(res => res.json()).then(setEvaluators);
  }, []);

  const assign = async () => {
    await fetch("https://automated-content-submission-and-t73b.onrender.com/api/admin/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId: selectedTeam,
        evaluatorId: selectedEvaluator,
        adminId: "ADMIN_ID_HERE" // replace with logged-in admin id
      })
    });
    alert("Evaluator assigned!");
  };

  return (
    <div>
      <h2>Assign Evaluator to Team</h2>
      <select onChange={e => setSelectedTeam(e.target.value)}>
        <option value="">Select Team</option>
        {teams.map(t => <option key={t._id} value={t._id}>{t.teamName}</option>)}
      </select>
      <select onChange={e => setSelectedEvaluator(e.target.value)}>
        <option value="">Select Evaluator</option>
        {evaluators.filter(ev => ev.approved).map(ev => (
          <option key={ev._id} value={ev._id}>{ev.name}</option>
        ))}
      </select>
      <button onClick={assign}>Assign</button>
    </div>
  );
};
export default AssignEvaluator;
