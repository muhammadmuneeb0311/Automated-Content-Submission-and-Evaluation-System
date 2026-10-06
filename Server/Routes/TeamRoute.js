const express = require("express");
const router = express.Router();
const { getPendingMembers, approveMember,getMemberTeamName,getTeamMembers } = require("../controllers/team-controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const Team = require("../Models/Team");


console.log("✅ TeamRoute.js loaded");


// routes/teamRoute.js
router.get("/pending-members/:teamId",authMiddleware, getPendingMembers);


// Approve member
router.put("/member/approve/:memberId", authMiddleware, approveMember);


router.get("/by-member/:id", authMiddleware, getMemberTeamName);

// ===== New route: Get team by ID =====
router.get("/:teamId", authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ msg: "Team not found" });
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// Get team members (id + name)
router.get("/:teamId/members", authMiddleware, getTeamMembers);




module.exports = router;
