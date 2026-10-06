const express = require("express");
const { getMyProfile,getAssignedSubmissions } = require("../../controllers/evaluator/evaluatorController");
const { authMiddleware } = require("../../middleware/authMiddleware");
const router = express.Router();

// GET evaluator profile (requires JWT)
router.get("/me", authMiddleware, getMyProfile);



// Get assigned submissions for evaluator
router.get("/assigned",authMiddleware, getAssignedSubmissions);
  

module.exports = router;
