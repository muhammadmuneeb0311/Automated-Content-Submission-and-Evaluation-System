import { Routes, Route } from "react-router-dom";
import { useAuth } from "./Components/store";
import Layout from "./Pages/Layout";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import ProtectedRoute from "./Components/ProtectedRoutes";
import Home from "./Pages/Home";
import UploadSubmission from "./Components/Team/UploadSubmission";
import ActivateAccount from "./Pages/ActivateAccount";
import CompetitionSettings from "./Components/Admin/CompetitionSettings";
// ✅ Import separate dashboards
import AdminDashboard from "./Components/Admin/AdminDashboard";
import EvaluatorDashboard from "./Components/Evaluator/EvaluatorDashboard";
import TeamDashboard from "./Components/Team/TeamDashboard";
import TeamMemberDashboard from "./Components/TeamMember/TeamMemberDashboard";
import ScoreSubmission from "./Components/Evaluator/ScoreSubmission";
import EvaluationManagement from "./Components/Admin/EvaluationManagement";
import FullPendingUsers from "./Components/Admin/FullPendingUsers";
import FullEvaluators from "./Components/Admin/FullEvaluators";
import FullSubmissions from "./Components/Admin/FullSubmissions";
import Results from "./Components/Admin/ResultBoard";
import SupportChat from "./Components/SupportChat";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import ResetPassword from "./Components/Auth/ResetPassword";
import RoleBasedSidebar from "./Components/RoleBasedSidebar";
import RoleBasedDashboard from "./Components/RoleBasedDashboard";
import EvaluatorSubmissions from "./Components/Evaluator/EvaluatorSubmissions";


function App() {
  const { userRole } = useAuth();

  // Function to get dashboard component based on role
  const getDashboardComponent = (role) => {
    switch (role) {
      case "admin":
        return <AdminDashboard />;
      case "evaluator":
        return <EvaluatorDashboard />;
      case "team":
        return <TeamDashboard />;
      case "teammember":
        return <TeamMemberDashboard />;
      default:
        return <Login />;
    }
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/activate" element={<ActivateAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/forgot-password/:token" element={<ForgotPassword />} />


      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "evaluator", "team", "teammember"]}>
            <Layout role={userRole}>
              {getDashboardComponent(userRole)}
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Team / Team Member Upload Submission */}
      <Route
        path="/upload"
        element={
          <ProtectedRoute allowedRoles={["team", "teammember"]}>
            <Layout role={userRole}>
              <UploadSubmission />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/score-submission/:teamId"
        element={
          <ProtectedRoute allowedRoles={["evaluator"]}>
            <Layout role={userRole}>
              <ScoreSubmission />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/evaluation-management"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout role={userRole}>
              <EvaluationManagement />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pending-users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout role={userRole}>
              <FullPendingUsers />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/approved-evaluators"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout role={userRole}>
              <FullEvaluators />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/submissions"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout role={userRole}>
              <FullSubmissions />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/competition-settings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout role={userRole}>
              <CompetitionSettings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/results"
        element={
          <ProtectedRoute allowedRoles={["admin", "evaluator", "team", "teammember"]}>
            <Layout role={userRole}>
              <Results />
            </Layout>
          </ProtectedRoute>
        }
      />


      <Route
        path="/support"
        element={
          <ProtectedRoute allowedRoles={["admin", "evaluator", "team", "teammember"]}>
            <Layout role={userRole}>
              <SupportChat />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/EvaluatorSubmissions"
        element={
          <ProtectedRoute allowedRoles={["evaluator"]}>
            <Layout role={userRole}>
              <EvaluatorSubmissions />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/RoleBasedSidebar"
        element={
          <ProtectedRoute allowedRoles={["admin", "evaluator", "team", "teammember"]}>
            <Layout role={userRole}>
              <SupportChat />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/RoleBasedDashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "evaluator", "team", "teammember"]}>
            <Layout role={userRole}>
              <RoleBasedDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="/*" element={<Login />} />
    </Routes>
  );
}

export default App;
