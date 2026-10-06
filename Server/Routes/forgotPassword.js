const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../Models/user");
const Team = require("../Models/Team");
const Evaluator = require("../Models/Evaluator");
const TeamMember = require("../Models/TeamMember");

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user in any collection
    const user =
      (await User.findOne({ email })) ||
      (await Team.findOne({ email })) ||
      (await Evaluator.findOne({ email })) ||
      (await TeamMember.findOne({ email }));

    if (!user) return res.status(404).json({ msg: "Email not found" });

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset your password",
      html: `<p>Click the link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    res.json({ msg: "Password reset link sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = forgotPassword;