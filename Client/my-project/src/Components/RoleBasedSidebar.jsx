// src/Components/Sidebar/RoleBasedSidebar.jsx
import { Link, useLocation } from "react-router-dom";

const RoleBasedSidebar = ({ role }) => {
  const location = useLocation();

  // Define menu items for each role
  const menus = {
    admin: [
  
      { to: "/admin/evaluation-management", label: "Evaluation Management", icon: "bi bi-clipboard-check" },

      { to: "/admin/results", label: "Results", icon: "bi bi-file-text" },
 
      { to: "/support", label: "Chat/Support", icon: "bi bi-chat-dots" },

      { to: "/admin/competition-settings", label: "Competition Settings", icon: "bi bi-award" },
    ],
    evaluator: [
      { to: "/assigned-teams", label: "Assigned Teams", icon: "bi bi-people" },
      { to: "/EvaluatorSubmissions", label: "Evaluate Submissions", icon: "bi bi-pencil-square" },
      { to: "/admin/results", label: "Result Board", icon: "bi bi-trophy" },
    ],
    team: [
      { to: "/upload", label: "Upload Submission", icon: "bi bi-cloud-upload" },

      { to: "/admin/results", label: "Result Board", icon: "bi bi-trophy" },
      { to: "/support", label: "Chat/Support", icon: "bi bi-chat" },
    ],
    teammember: [
      { to: "/member/team-info", label: "Team Information", icon: "bi bi-info-circle" },
      { to: "/upload", label: "Make Submission", icon: "bi bi-cloud-upload" },
      { to: "/support", label: "Chat / Support", icon: "bi bi-chat-left" },
      { to: "/admin/results", label: "Results", icon: "bi bi-file-text" },
    ],
  };

  const items = menus[role] || menus["team"];

  // Role display names and icons
  const roleConfig = {
    admin: {
      name: "Administrator",
      icon: "bi bi-person-gear",
      badge: "bg-danger",
      gradient: "bg-gradient-primary"
    },
    evaluator: {
      name: "Evaluator",
      icon: "bi bi-person-check",
      badge: "bg-success",
      gradient: "bg-gradient-success"
    },
    team: {
      name: "Team Lead",
      icon: "bi bi-person-badge",
      badge: "bg-warning",
      gradient: "bg-gradient-warning"
    },
    teammember: {
      name: "Team Member",
      icon: "bi bi-person",
      badge: "bg-info",
      gradient: "bg-gradient-info"
    }
  };

const currentRole = roleConfig[role] || roleConfig["team"];


  return (
    <>
      {/* Bootstrap Icons CDN */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      <aside className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white vh-100 sticky-top"
        style={{ width: "280px", overflowY: "auto" }}>

        {/* Sidebar Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-secondary">
          <div className="d-flex align-items-center">
            <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${currentRole.gradient}`}
              style={{ width: '50px', height: '50px' }}>
              <i className={`${currentRole.icon} fs-5 text-white`}></i>
            </div>
            <div>
              <span className="fs-6 fw-bold">{currentRole.name}</span>
              <br />
              <small className="text-white-50">Navigation Panel</small>
            </div>
          </div>
          <span className={`badge ${currentRole.badge} rounded-pill`}>PRO</span>
        </div>

        {/* Navigation Menu */}
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item mb-2">
            <small className="text-uppercase text-white-50 fw-bold ms-2">Main Menu</small>
          </li>

          {items.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <li key={item.to} className="nav-item mb-1">
                <Link
                  to={item.to}
                  className={`nav-link text-white d-flex align-items-center ${isActive ? 'active bg-primary' : 'hover-light'
                    }`}
                >
                  <i className={`${item.icon} me-3`} style={{ width: '20px' }}></i>
                  <span className="flex-grow-1">{item.label}</span>
                  {isActive && (
                    <i className="bi bi-chevron-right small"></i>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Sidebar Footer */}
        <div className="border-top border-secondary pt-3 mt-auto">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <small className="text-white-50">System Status</small>
              <div className="d-flex align-items-center">
                <div className="bg-success rounded-circle me-2" style={{ width: '8px', height: '8px' }}></div>
                <small className="text-success">Online</small>
              </div>
            </div>
            <div className="text-end">
              <small className="text-white-50 d-block">v2.1.0</small>
              <small className="text-white-50">Content System</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Custom Bootstrap-based Styles */}
      <style>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }
        .bg-gradient-success {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
        }
        .bg-gradient-warning {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
        }
        .bg-gradient-info {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%) !important;
        }
        .hover-light:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.375rem;
        }
        .nav-link {
          transition: all 0.2s ease-in-out;
          border-radius: 0.375rem;
        }
        .nav-link.active {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
        }
        .sticky-top {
          position: sticky;
          top: 0;
          z-index: 1020;
        }
      `}</style>
    </>
  );
};

export default RoleBasedSidebar;