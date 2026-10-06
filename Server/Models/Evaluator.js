const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const EvaluatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  qualification: { type: String },
  experience: { type: String },
  specialization: { type: String },
  email: { type: String, required: true, unique: true },
  isApproved: { type: Boolean, default: false },
  role: { type: String, default: "evaluator" },
  password: { type: String, required: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  resetPasswordToken: String,
  resetPasswordExpire: Date,

}, { timestamps: true });








module.exports = mongoose.model("Evaluator", EvaluatorSchema);