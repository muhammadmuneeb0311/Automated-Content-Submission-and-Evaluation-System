const Evaluator = require("../../Models/Evaluator");
const jwt = require("jsonwebtoken");
const EvluatorAssignment = require("../../Models/EvaluatorAssignment");
const EvaluationScore = require("../../Models/EvaluationScore");


const getMyProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth header received:", authHeader);

    if (!authHeader) return res.status(401).json({ message: "No authorization header" });

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer")
      return res.status(401).json({ message: "Invalid authorization format" });

    const token = parts[1];
    console.log("Token extracted:", token);

    const secret = process.env.mysecretkey;
    console.log("JWT_SECRET being used:", secret);

    const decoded = jwt.verify(token, secret);
    console.log("Decoded token payload:", decoded);

    const evaluator = await Evaluator.findById(decoded.id).select("name email");
    if (!evaluator) return res.status(404).json({ message: "Evaluator not found" });

    res.status(200).json(evaluator);
  } catch (error) {
    console.error("JWT verify error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};


const getAssignedSubmissions = async (req, res) => {
  try {
    const evaluatorId = req.user.id;

    const assignments = await EvluatorAssignment.find({ evaluatorId })
      .populate({
        path: "submissionId",
        populate: { path: "teamId", select: "teamName" }
      })
      .exec();

    // Attach hasSubmitted flag for each assignment
    const results = await Promise.all(assignments.map(async (a) => {
      const teamId = a.submissionId?.teamId?._id || a.submissionId?.teamId;
      const existing = await EvaluationScore.findOne({ teamId, evaluatorId });
      return { ...a.toObject(), hasSubmitted: !!existing };
    }));

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching assigned submissions" });
  }
};

module.exports = { getMyProfile,getAssignedSubmissions };
