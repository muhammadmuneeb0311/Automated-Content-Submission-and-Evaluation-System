import { useEffect, useState } from "react";

const TeamList = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch("https://automated-content-submission-and-t73b.onrender.com/api/admin/teams")
      .then(res => res.json())
      .then(data => setTeams(data));
  }, []);

  return (
    <div>
      <h2>Teams</h2>
      <table>
        <thead>
          <tr>
            <th>Team Name</th><th>Members</th><th>Video Link</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <tr key={team._id}>
              <td>{team.teamName}</td>
              <td>{team.members.join(", ")}</td>
              <td>{team.videoLink ? <a href={team.videoLink} target="_blank" rel="noreferrer">View Video</a> : "Not Submitted"}</td>
              <td>{team.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TeamList;
