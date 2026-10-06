const express = require("express");
const router = express.Router();
const { assignEvaluators, evaluateSubmission } = require("../../controllers/admin/assignEvaluatorController");
const { authMiddleware, adminMiddleware } = require("../../middleware/authMiddleware");


// Admin assigns evaluators
router.post(
  "/assign/:teamId/:submissionId",
  authMiddleware,
  adminMiddleware,
  assignEvaluators
);

// Evaluator updates evaluation status
router.put("/evaluate/:assignmentId", authMiddleware, evaluateSubmission);



module.exports = router;
