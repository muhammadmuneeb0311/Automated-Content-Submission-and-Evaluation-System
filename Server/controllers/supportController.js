const SupportConversation = require("../Models/supportConversation");
const SupportMessage = require("../Models/SupportMessage");
const User = require("../Models/User");
const Team = require("../Models/Team");
const TeamMember = require("../Models/TeamMember");
// ===== Create a new conversation =====
exports.createConversation = async (req, res) => {
  try {
    const { team_id, subject, support_agent_id } = req.body;

    if (!team_id) {
      return res.status(400).json({ message: "Team ID is required" });
    }

    const conv = await SupportConversation.create({
      team_id,
      subject: subject || "Support Chat",
      support_agent_id: support_agent_id || null,
    });

    res.status(201).json(conv);
  } catch (err) {
    console.error("❌ Error creating conversation:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===== Get all conversations depending on role =====
exports.getConversations = async (req, res) => {
  try {
    const { user_id, role } = req.params;
    let convs = [];

    if (role === "admin") {
      convs = await SupportConversation.find()
        .populate("team_id", "teamName")
        .sort({ updated_at: -1 });
    } else if (["team", "team_lead", "team_member"].includes(role)) {
      convs = await SupportConversation.find({ team_id: user_id })
        .populate("team_id", "teamName")
        .sort({ updated_at: -1 });
    } else if (role === "evaluator") {
      convs = await SupportConversation.find({ evaluators: user_id })
        .populate("team_id", "teamName")
        .sort({ updated_at: -1 });
    }

    res.json(convs);
  } catch (err) {
    console.error("❌ Error fetching conversations:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===== Get messages for a conversation =====
exports.getMessages = async (req, res) => {
  try {
    // Find messages for this conversation
    const messages = await SupportMessage.find({
      conversation_id: req.params.conversation_id,
    });

    // Map sender_name and sender_role for each message
    const messagesWithSender = await Promise.all(
      messages.map(async (msg) => {
        let sender_name = msg.sender_name || "Unknown";
        let sender_role_type = msg.sender_role || "Unknown";

        if (msg.sender_type === "admin") {
          sender_name = "Admin";
          sender_role_type = "Administrator";
        } else if (msg.sender_type === "team") {
          const team = await Team.findById(msg.sender_id);
          sender_name = team?.teamName || team?.name || "Unknown Team";
          sender_role_type = "Team";
        } else if (msg.sender_type === "team_lead" || msg.sender_type === "teammember") {
          const user = await User.findById(msg.sender_id);
          if (user) {
            sender_name = user.name || "Unknown User";
            sender_role_type = user.role === "team_lead" ? "Team Leader" : "Team Member";
          }
        }

        return { ...msg._doc, sender_name, sender_role: sender_role_type };
      })
    );

    res.json(messagesWithSender);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};





// ===== Send a new message =====

exports.sendMessage = async (req, res) => {
  try {
    const { conversation_id, sender_id, sender_type, sender_role, message_text } = req.body;

    if (!conversation_id || !sender_id || !message_text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let senderName = "Unknown";

    if (sender_type === "admin") {
      senderName = "Admin";
    } else if (sender_type === "team") {
      const team = await Team.findById(sender_id);
      senderName = team?.teamName || team?.name || "Unknown Team";
    } else if (sender_type === "team_lead") {
      const teamLead = await Team.findById(sender_id); // or TeamLead collection if separate
      senderName = teamLead?.teamName || teamLead?.name || "Unknown Team Lead";
    } else if (sender_type === "teammember") {
      const member = await TeamMember.findById(sender_id);
      senderName = member?.name || "Unknown User";
    }

    const msg = await SupportMessage.create({
      conversation_id,
      sender_id,
      sender_type,
      sender_name: senderName,
      sender_role,
      message_text,
    });

    // Update conversation's updated_at
    await SupportConversation.findByIdAndUpdate(conversation_id, { updated_at: new Date() });

    res.status(201).json(msg);
  } catch (err) {
    console.error("❌ Error sending message:", err);
    res.status(500).json({ message: err.message });
  }
};
