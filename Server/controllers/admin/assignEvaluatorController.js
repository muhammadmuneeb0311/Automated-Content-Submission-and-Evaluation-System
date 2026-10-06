const Team = require("../../Models/Team");
const Evaluator = require("../../Models/Evaluator");
const Assignment = require("../../Models/EvaluatorAssignment");
const Submission = require("../../Models/Submission");
const Score = require("../../Models/EvaluationScore");
const User = require("../../Models/User");

// Assign 3 evaluators to a team
const assignEvaluators = async (req, res) => {
  try {
    const { teamId, submissionId } = req.params; // submissionId is needed for Assignment
    const adminId = req.user.id; // from decoded token

    // Validate params early
    if (!teamId || !submissionId) {
      return res.status(400).json({ message: "teamId and submissionId are required" });
    }

    if (!adminId) {
      return res.status(403).json({ message: "Unauthorized: admin id missing from token" });
    }

    
// 1️⃣ Fetch approved evaluators from Evaluator collection
const evaluators = await Evaluator.find({ isApproved: true });
if (evaluators.length < 3) {
  return res.status(400).json({ message: "Not enough approved evaluators" });
}


    // 2️⃣ Pick 3 randomly
const shuffled = evaluators.sort(() => 0.5 - Math.random());
const assigned = shuffled.slice(0, 3);

    // 3️⃣ Update team evaluators (optional)
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    // assign evaluator ids to a stable field (create if not present)
    team.evaluators = assigned.map(e => e._id);
    try {
      await team.save();
    } catch (saveErr) {
      console.error(`Failed to save team ${teamId} after assigning evaluators:`, saveErr);
      return res.status(500).json({ message: 'Failed to update team with evaluators', error: saveErr.message });
    }

    // 4️⃣ Create assignments for submission
    // 4️⃣ Create assignments for submission
    // Ensure submission exists first
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    console.log('Creating assignments', { submissionId, teamId, adminId, assignedIds: assigned.map(a => a._id) });
    const assignmentPromises = assigned.map(async (e) => {
      try {
        return await Assignment.create({
          submissionId,
          evaluatorId: e._id,
          assignedBy: adminId,
          teamId: teamId,
        });
      } catch (innerErr) {
        console.error(`Failed to create assignment for evaluator ${e._id}:`, innerErr);
        // return a detailed client error if it's a validation error
        if (innerErr.name === 'ValidationError') {
          return Promise.reject({ status: 400, message: innerErr.message });
        }
        return Promise.reject(innerErr);
      }
    });
    try {
      await Promise.all(assignmentPromises);
    } catch (createErr) {
      console.error('One or more assignment creations failed:', createErr);
      if (createErr && createErr.status) {
        return res.status(createErr.status).json({ message: createErr.message });
      }
      return res.status(500).json({ message: 'Failed to create evaluator assignments', error: createErr.message || createErr });
    }

    // 5️⃣ ✅ Update submission status to "under_evaluation"
    await Submission.findByIdAndUpdate(submissionId, { status: "under_evaluation" });

  
   // 5️⃣ Populate team evaluators for response
const populatedTeam = await Team.findById(teamId)
  .populate("evaluators", "name email qualification"); // should reference User model now


    res.status(200).json({
      message: `✅ 3 Evaluators assigned successfully and saved to DB`,
      team: populatedTeam,
    });

  } catch (err) {
    console.error("Evaluator assignment error:", err);
    res.status(500).json({ message: "Server error during assignment" });
  }
};





const evaluateSubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { status } = req.body;

    // 1️⃣ Update Assignment Status
    const assignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { status: status || "evaluated" },
      { new: true }
    ).populate("submissionId");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // 2️⃣ Update related Submission status to "evaluated"
    if (assignment.submissionId) {
      await Submission.findByIdAndUpdate(assignment.submissionId._id, {
        status: status || "evaluated",
      });
    }

    res.status(200).json({
      message: "✅ Evaluation submitted successfully",
      assignment,
    });

  } catch (err) {
    console.error("Evaluation error:", err);
    res.status(500).json({ message: "Server error during evaluation" });
  }
};


module.exports = { assignEvaluators ,evaluateSubmission };