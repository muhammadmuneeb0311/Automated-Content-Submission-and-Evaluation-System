const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../Models/User");
const admin = require("../Models/Admin");
const Evaluator = require("../Models/Evaluator");
const Team = require("../Models/Team");
const TeamMember = require("../Models/TeamMember");
const sendActivationEmail = require("../utils/sendActivationEmail");
const CompetitionSetting = require("../Models/CompetitionSettings");
const nodemailer = require("nodemailer");

// =============== JWT Generator ===============

const generateToken = (userId, role, teamId = null) => {
  return jwt.sign(
    {
      id: userId.toString(),
      role,
      teamId: teamId ? (teamId._id ? teamId._id.toString() : teamId.toString()) : null,
    },
    process.env.mysecretkey,
    { expiresIn: "1d" }
  );
};


// =============== HOME ROUTE ===============
const home = (req, res) => {
  res.status(200).json({ message: "Welcome to the Auth API 🚀" });
};





const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      qualification,
      specialization,
      experience,
      teamName,
      members
    } = req.body;

    console.log("🧾 Incoming Request Body:", req.body);
    console.log("📋 Extracted Fields:");
    console.log("  - qualification:", qualification, "| Type:", typeof qualification);
    console.log("  - specialization:", specialization, "| Type:", typeof specialization);
    console.log("  - experience:", experience, "| Type:", typeof experience);

    // Active competition check
    const activeSetting = await CompetitionSetting.findOne({ settingValue: "Active" });
    if (!activeSetting) return res.status(400).json({ msg: "No active competition found ❌" });

    const currentDate = new Date();
    const startDate = new Date(activeSetting.start_date);
    const endDate = new Date(activeSetting.end_date);
    endDate.setHours(23, 59, 59, 999);

    if (currentDate < startDate) return res.status(400).json({ msg: "Registration has not started yet ⏳" });
    if (currentDate > endDate) return res.status(400).json({ msg: "Registration period is over 🚫" });

    // Duplicate email check
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email already registered ❌" });

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Build user object
    const userData = { name, email, phone: phone || null, password: hashedPassword, role, isApproved: false };

    if (role === "evaluator") {
      // ✅ Ensure evaluator fields are provided
      if (!qualification || !specialization || !experience) {
        return res.status(400).json({ msg: "Qualification, specialization, and experience are required for evaluators ❌" });
      }
      userData.qualification = qualification;
      userData.specialization = specialization;
      userData.experience = experience;
    }

    if (role === "team") {
      // Handle members sent as a stringified value from some frontends
      let parsedMembers = members;
      if (typeof members === "string") {
        try {
          parsedMembers = JSON.parse(members);
        } catch (e) {
          // Try a best-effort conversion for single-quoted objects (not ideal but helpful during debugging)
          try {
            parsedMembers = JSON.parse(members.replace(/'/g, '"'));
          } catch (e2) {
            parsedMembers = null;
          }
        }
      }

      if (!teamName || !parsedMembers || !Array.isArray(parsedMembers) || parsedMembers.length === 0) {
        return res.status(400).json({ msg: "Team name and at least one member are required for team role ❌" });
      }

      userData.teamName = teamName;
      userData.members = parsedMembers; // will be stored as subdocuments
    }

    const pendingUser = new User(userData);
    await pendingUser.save();

    const userResponse = pendingUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      msg: "User registered successfully ✅ (pending admin approval)",
      user: userResponse,
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

// =============== ACTIVATE ACCOUNT (Team Member) ===============
const activateAccount = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ msg: "Token and password are required" });
    }

    const member = await TeamMember.findOne({ activationToken: token });
    if (!member) {
      return res.status(400).json({ msg: "Invalid or expired activation token" });
    }

    // Hash password and save
    const hashedPassword = await bcrypt.hash(password, 10);
    member.password = hashedPassword;
    member.activationToken = null; // clear token
    member.isApproved = true;      // mark approved after activation
    await member.save();

    res.status(200).json({ msg: "✅ Account activated successfully" });
  } catch (err) {
    console.error("Activation Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// =============== LOGIN ===============
const login = async (req, res) => {
  try {
    const { email, password } = req.body;


    let user =
      (await admin.findOne({ email })) ||
      (await Evaluator.findOne({ email })) ||
      (await Team.findOne({ email })) ||
      (await TeamMember.findOne({ email }).populate("teamId", "_id name teamName"));

    console.log(`Login attempt: email=${email} foundUser=${user ? user.constructor.modelName : 'none'}`);
    if (user) console.log(`  - isApproved=${user.isApproved} roleField=${user.role || 'n/a'}`);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password || "");
  console.log(`  - password match: ${isMatch}`);
  if (!isMatch) return res.status(401).json({ msg: "Invalid email or password" });

    // Identify role
    const role = user.constructor.modelName.toLowerCase();

    // Approval checks
    if ((role === "evaluator" || role === "team" || role === "teammember") && !user.isApproved)
      return res.status(403).json({ msg: "Not approved by admin or pending." });

    // Determine teamId for JWT
    let teamId = null;
    if (role === "team") teamId = user._id;
    else if (role === "teammember") teamId = user.teamId;

    // Generate token
    const token = generateToken(user._id, role, teamId);

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name || user.leaderName,
        email: user.email,
        role,
        teamId: teamId ? (teamId._id ? teamId._id : teamId) : null,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};



// =============== APPROVE USER (Team or Evaluator) ===============

const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { members } = req.body;

    const pendingUser = await User.findById(id);
    if (!pendingUser) return res.status(404).json({ msg: "User not found in pending users" });

    let finalUser;

    switch (pendingUser.role) {
      case "team":
        // ✅ Check active competition before approving team
        const currentSetting = await CompetitionSetting.findOne({ is_active: true });

        if (!currentSetting) {
          return res.status(400).json({ msg: "No active competition available. Please create one first." });
        }

        const now = new Date();
        if (now < currentSetting.start_date || now > currentSetting.end_date) {
          return res.status(400).json({ msg: "Team approval closed. Competition not active." });
        }

        // ✅ Proceed if competition is active
        finalUser = new Team({
          name: pendingUser.name,
          email: pendingUser.email,
          phone: pendingUser.phone,
          password: pendingUser.password,
          teamName: pendingUser.teamName,
          isApproved: true,
          setting_id: currentSetting._id, // 🔗 Link team to active competition
        });
        await finalUser.save();

        if (members && Array.isArray(members)) {
          for (const member of members) {
            const activationToken = crypto.randomBytes(32).toString("hex");
            const newMember = new TeamMember({
              name: member.name,
              email: member.email,
              teamId: finalUser._id,
              teamLeaderId: finalUser._id,
              activationToken
            });
            await newMember.save();
            await sendActivationEmail(member.email, activationToken);
          }
        }
        break;

      case "evaluator":
        finalUser = new Evaluator({
          name: pendingUser.name,
          email: pendingUser.email,
          phone: pendingUser.phone,
          password: pendingUser.password,
          qualification: pendingUser.qualification,
          specialization: pendingUser.specialization,
          experience: pendingUser.experience,
          isApproved: true
        });
        await finalUser.save();
        break;

      default:
        return res.status(400).json({ msg: "Invalid role" });
    }

    await pendingUser.deleteOne();

    res.json({ msg: "User approved and moved to final collection ✅", user: finalUser });
  } catch (err) {
    console.error("Approve Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};



  // Request password reset
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

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpire;
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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      text: `Click to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ msg: "Password reset link sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};         



const resetPassword = async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;

  const query = {
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  };

console.log("Token received:", token);

const user =
  (await User.findOne(query)) ||
  (await Team.findOne(query)) ||
  (await Evaluator.findOne(query)) ||
  (await TeamMember.findOne(query));

console.log("User found:", user);

  if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  res.json({ msg: "Password updated successfully" });
};



module.exports = {
  home,
  register,
  activateAccount,
  login,
  approveUser, forgotPassword, resetPassword
};