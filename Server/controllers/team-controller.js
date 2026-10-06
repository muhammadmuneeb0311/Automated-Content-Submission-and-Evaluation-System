const mongoose = require("mongoose");
const Team = require("../Models/Team");
const TeamMember = require("../Models/TeamMember");

// Get Pending Members
// GET /api/teams/pending-members/:teamId
const getPendingMembers = async (req, res) => {
  try {
    const { teamId } = req.params;

    console.log(`GET pending-members for teamId=${teamId}`);

    // ✅ Members pending leader approval or not yet activated
    const pendingMembers = await TeamMember.find({
      teamId,
      $or: [
        { approvedByLeader: false },
        { isApproved: false }
      ]
    }).select("_id name email isApproved approvedByLeader"); // only return necessary fields

    console.log(`  -> found ${pendingMembers.length} pending members`);
    if (pendingMembers.length > 0) {
      return res.json(pendingMembers);
    }

    // Fallback: check embedded members inside Team document (in case TeamMember docs weren't created)
    try {
      const team = await Team.findById(teamId).select("members");
      if (team && Array.isArray(team.members)) {
        const embeddedPending = team.members.filter(m => !m.isApproved).map(m => ({
          _id: m._id,
          name: m.name,
          email: m.email,
        }));
        console.log(`  -> found ${embeddedPending.length} embedded pending members`);
        return res.json(embeddedPending);
      }
    } catch (e) {
      console.error("Fallback check for embedded team members failed:", e);
    }

    return res.json([]);
  } catch (error) {
    console.error("Error fetching pending members:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Debug: return all TeamMember documents for a team (auth protected)
const getAllMembers = async (req, res) => {
  try {
    const { teamId } = req.params;
    if (!teamId) return res.status(400).json({ msg: "teamId param required" });
    console.log(`GET all-members for teamId=${teamId}`);
    const members = await TeamMember.find({ teamId }).select("_id name email isApproved approvedByLeader teamId");
    console.log(`  -> found ${members.length} members`);
    res.json(members);
  } catch (err) {
    console.error("Error fetching all members:", err);
    res.status(500).json({ msg: "Server error" });
  }
};



// ✅ Controller: Get team name for logged-in team member
const getMemberTeamName = async (req, res) => {
  try {
    // Accept either a team id or a member id in the URL param (:id),
    // or fall back to authenticated token teamId (req.user.teamId).
    let id = req.params.id || req.user?.teamId;
    if (!id) return res.status(404).json({ msg: "Member is not assigned to any team" });

    console.log(`GET by-member for id=${id}`);

    // Try to find a Team with this id first
    let team = await Team.findById(id, "_id name teamName");
    if (team) console.log(`  -> resolved id as Team id: ${team._id}`);

    // If not a team id, treat `id` as a TeamMember id and resolve the team via TeamMember.teamId
    if (!team) {
      console.log("  -> id not a Team id, trying as TeamMember id");
      const member = await TeamMember.findById(id);
      if (!member) {
        console.warn(`  -> no TeamMember found for id=${id}`);
        return res.status(404).json({ msg: "No team or member found for provided id" });
      }
      if (!member.teamId) {
        console.warn(`  -> member ${id} has no teamId`);
        return res.status(404).json({ msg: "Member is not assigned to any team" });
      }
      team = await Team.findById(member.teamId, "_id name teamName");
      if (!team) {
        console.warn(`  -> team not found for teamId=${member.teamId}`);
        return res.status(404).json({ msg: "Team not found for this member" });
      }
      console.log(`  -> resolved Team via member.teamId: ${team._id}`);
    }

    res.status(200).json({
      _id: team._id,
      name: team.teamName || team.name,
    });
  } catch (err) {
    console.error("Error fetching team:", err);
    res.status(500).json({ msg: "Server error" });
  }
};






// ✅ Approve a pending member
const approveMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    // Log caller for debugging
    console.log(`PUT approve-member called by user=${req.user?.id} role=${req.user?.role}`);

    // Find the member first so we can authorize and inspect
    const member = await TeamMember.findById(memberId).lean();
    if (!member) return res.status(404).json({ msg: "Member not found" });

    // Ensure the caller is the team (team leader) that owns this member
    // Team documents represent team leaders (role 'team') and their _id is used as teamId
    const callerIsTeamLeader = req.user && req.user.role === "team" && req.user.id === String(member.teamId);
    if (!callerIsTeamLeader) {
      console.warn(`Unauthorized approve attempt by user=${req.user?.id} role=${req.user?.role} for member.teamId=${member.teamId}`);
      return res.status(403).json({ msg: "Only the team leader can approve this member" });
    }

    // Mark TeamMember as approved by leader and also activate the member
    const updated = await TeamMember.findByIdAndUpdate(
      memberId,
      { approvedByLeader: true, isApproved: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Member not found after update" });
    }

    // Also update embedded member inside Team.members (if present) to keep data consistent
    try {
      if (updated.teamId && updated.email) {
        const teamUpdate = await Team.updateOne(
          { _id: updated.teamId, "members.email": updated.email },
          { $set: { "members.$.isApproved": true } }
        );
        // log modifiedCount for modern mongoose and nModified for older
        console.log(`Updated embedded member for team ${updated.teamId}:`, teamUpdate.nModified ?? teamUpdate.modifiedCount ?? 0);
      }
    } catch (e) {
      console.error("Failed to update embedded Team.members for approved member:", e);
    }

    console.log(`Member ${memberId} approved by team leader ${req.user.id}`);
    res.json({ msg: "Member approved successfully", member: updated });
  } catch (error) {
    console.error("Error approving member:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


// Debug helper: resolve an id to Team or TeamMember (temporary)
const debugResolveId = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ msg: "id param required" });

    const team = await Team.findById(id).lean();
    const member = await TeamMember.findById(id).lean();

    return res.json({ teamFound: !!team, team, memberFound: !!member, member });
  } catch (err) {
    console.error("debugResolveId error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

const getTeamMembers = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId)
      .populate("members", "_id name email")
      .exec();

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({
        teamId: team._id,
  teamName: team.teamName, // ✅ REAL TEAM NAME
  leaderName: team.name,   // ✅ OPTIONAL (team lead)
  members: team.members
    });

  } catch (error) {
    console.error("getTeamMembers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  getPendingMembers,
  approveMember,
  getMemberTeamName,
  debugResolveId,getTeamMembers,
};
