require("dotenv").config({ override: true }); // ensures process.env is populated
console.log("JWT_SECRET at startup:", process.env.mysecretkey); // should print supersecret





const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDb = require("./utils/db");
const competitionSettingRoutes = require("./Routes/adminRoutes/CompetitionSettingRoute");
const evaluatorRoutes = require("./Routes/evaluatorRoutes/evaluatorRoutes");


const app = express();

// ===== CORS SETUP (for frontend JWT requests) =====
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // allow multiple frontend origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // allow cookies/JWT headers
  })
);

// ===== PARSE JSON =====
app.use(express.json());

// ===== Import Controllers =====
const { activateAccount } = require("./controllers/auth-controllers");

// ===== Import Routes =====
const authRoutes = require("./Routes/Auth");
const AdminRoute = require("./Routes/adminRoutes/AdminRoute");
const TeamRoutes = require("./Routes/TeamRoute");
const submissionRoutes = require("./Routes/SubmissionRoute");
const assignEvaluatorRoutes = require("./Routes/adminRoutes/assignEvaluatorRoutes");
const assignmentRoutes = require("./Routes/Assignments");
const teamMemberRoutes = require("./Routes/teamMemberRoutes");
const scoreRoutes = require("./Routes/scoreRoutes");
const evaluationCriteriaRoutes = require("./Routes/adminRoutes/evaluationCriteriaRoutes");
const debugRoutes = require("./Routes/debugRoutes");
const resultRoutes = require("./Routes/adminRoutes/resultRoutes");
const supportRoutes = require("./Routes/supportRoutes");
const SupportConversation = require("./Models/supportConversation")

// ===== ROUTE MOUNTING =====
app.use("/api/admin/result", resultRoutes);
app.post("/api/auth/activate", activateAccount);
app.use("/api/auth", authRoutes);
app.use("/api/admin", AdminRoute);
app.use("/api/criteria", evaluationCriteriaRoutes);
app.use("/api/teams", TeamRoutes);
app.use("/api/team", teamMemberRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/admin/evaluators", assignEvaluatorRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/debug", debugRoutes);
app.use("/api/admin/competition-settings", competitionSettingRoutes);
app.use("/api/support", supportRoutes);


// ===== EVALUATOR ROUTES =====
app.use("/api/evaluators", evaluatorRoutes);

// ===== DEFAULT ROUTE =====
app.get("/", (req, res) => res.send("🚀 Server is running"));

// ===== 404 CATCH-ALL =====
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ===== START SERVER WITH SOCKET.IO =====
connectDb().then(() => {
  const PORT = process.env.PORT || 5000;
  const server = http.createServer(app);

  // ===== Initialize Socket.IO with multiple allowed origins =====
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001"], // <-- fix here
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // Join specific room
    socket.on("join_room", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    // Handle message sending
    socket.on("send_message", (data) => {
      io.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  // ===== Start Server =====
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
