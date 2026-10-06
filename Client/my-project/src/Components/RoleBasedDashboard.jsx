import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const RoleBasedDashboard = () => {
  const [userRole, setUserRole] = useState('teammember');
  const [userData, setUserData] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for different roles
  const mockData = {
    admin: {
      name: "Admin User",
      email: "admin@vusystem.edu.pk",
      totalTeams: 45,
      totalEvaluators: 12,
      submissionsReceived: 38,
      pendingApprovals: 3,
      systemStatus: "Active",
      recentActivities: [
        "Team 'Tech Wizards' submitted their video",
        "Evaluator 'Dr. Johnson' completed 3 evaluations",
        "New evaluator registration pending approval",
        "System backup completed successfully",
        "Deadline reminder sent to all participants"
      ]
    },
    evaluator: {
      name: "Dr. Sarah Smith",
      email: "s.smith@vu.edu.pk",
      assignedSubmissions: 15,
      evaluatedSubmissions: 10,
      pendingEvaluations: 5,
      averageRating: 4.2,
      upcomingDeadline: "2025-04-05",
      recentSubmissions: [
        {
          teamName: "Code Masters",
          topic: "Machine Learning Algorithms",
          submittedDate: "3 days ago",
          status: "pending"
        },
        {
          teamName: "Data Wizards", 
          topic: "Blockchain Technology",
          submittedDate: "5 days ago",
          status: "evaluated"
        },
        {
          teamName: "AI Pioneers",
          topic: "Neural Networks",
          submittedDate: "1 week ago",
          status: "pending"
        }
      ]
    },
    teamLead: {
      name: "John Doe",
      email: "john.doe@student.vu.edu.pk",
      teamName: "Tech Innovators",
      teammembers: [
        { name: "John Doe", role: "Lead", email: "john.doe@student.vu.edu.pk" },
        { name: "Jane Smith", role: "Developer", email: "jane.smith@student.vu.edu.pk" },
        { name: "Mike Johnson", role: "Researcher", email: "mike.j@student.vu.edu.pk" },
        { name: "Sarah Wilson", role: "Designer", email: "sarah.w@student.vu.edu.pk" }
      ],
      submissionStatus: "Submitted",
      submissionDate: "2025-03-15",
      evaluatorsAssigned: ["Dr. Smith", "Prof. Johnson", "Ms. Davis"],
      currentScore: 85,
      maxScore: 100,
      feedback: "Great content but needs more practical examples. The technical depth is excellent, but consider adding more real-world applications.",
      deadline: "2025-04-10",
      rank: 3,
      totalTeams: 25
    },
    teammember: {
      name: "Jane Smith",
      email: "jane.smith@student.vu.edu.pk", 
      teamName: "Tech Innovators",
      teamLead: "John Doe",
      submissionStatus: "Submitted",
      submissionDate: "2025-03-15",
      currentScore: 85,
      maxScore: 100,
      feedback: "Great content but needs more practical examples",
      deadline: "2025-04-10",
      rank: 3,
      totalTeams: 25,
      myContributions: [
        "Research on ML algorithms",
        "Video script writing",
        "Technical content development"
      ]
    }
  };

  useEffect(() => {
    setUserData(mockData[userRole]);
    setActiveTab('overview');
  }, [userRole]);

  // Evaluation criteria data
  const evaluationCriteria = [
    { id: 1, criteria: "Relevance to Learning Objectives/Outcomes", weightage: 5, score: 4 },
    { id: 2, criteria: "Innovation & Creativity", weightage: 15, score: 12 },
    { id: 3, criteria: "Clarity and Accessibility", weightage: 10, score: 8 },
    { id: 4, criteria: "Depth", weightage: 5, score: 4 },
    { id: 5, criteria: "Interactivity and Engagement", weightage: 25, score: 20 },
    { id: 6, criteria: "Use of Technology", weightage: 5, score: 4 },
    { id: 7, criteria: "Scalability and Adaptability", weightage: 10, score: 8 },
    { id: 8, criteria: "Alignment with Ethical Standards", weightage: 5, score: 5 },
    { id: 9, criteria: "Practical Application", weightage: 10, score: 9 },
    { id: 10, criteria: "Video Quality", weightage: 10, score: 11 }
  ];

  const roleConfig = {
    admin: { color: 'danger', icon: 'bi-shield-check' },
    evaluator: { color: 'success', icon: 'bi-person-check' },
    teamLead: { color: 'warning', icon: 'bi-person-badge' },
    teammember: { color: 'info', icon: 'bi-person' }
  };

  return (
    <>
      {/* Bootstrap Icons */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" 
        rel="stylesheet" 
      />

      <div className="container-fluid py-4 bg-light min-vh-100">
        {/* Header with Role Selection */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center py-3">
                <div className="d-flex align-items-center">
                  <div className={`bg-${roleConfig[userRole]?.color} rounded-circle p-2 me-3`}>
                    <i className={`${roleConfig[userRole]?.icon} text-white fs-5`}></i>
                  </div>
                  <div>
                    <h4 className="mb-0 fw-bold">Content Submission & Evaluation System</h4>
                    <small className="opacity-75">
                      Role: {userRole === 'team' ? 'Team Lead' : 
                            userRole === 'teammember' ? 'Team Member' : 
                            userRole === 'admin' ? 'Administrator' : 
                            userRole === 'evaluator' ? 'Evaluator' : 
                            userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </small>
                  </div>
                </div>
                <div className="btn-group" role="group">
                  {['teammember', 'team', 'evaluator', 'admin'].map((role) => (
                    
                    <button 
                      key={role}
                      type="button" 
                      className={`btn ${userRole === role ? 'btn-light' : 'btn-outline-light'} d-flex align-items-center`}
                      onClick={() => setUserRole(role)}
                    >
                      <i className={`${roleConfig[role]?.icon} me-2`}></i>
                      {role === 'team' ? 'Team Lead' : 
                       role === 'teammember' ? 'Team Member' : 
                       role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h5 className="fw-bold text-primary mb-1">Welcome, {userData.name}!</h5>
                    <p className="text-muted mb-0">
                      <i className="bi bi-envelope me-1"></i>
                      {userData.email}
                    </p>
                    {userData.teamName && (
                      <p className="text-muted mb-0">
                        <i className="bi bi-people me-1"></i>
                        <strong>Team:</strong> {userData.teamName}
                      </p>
                    )}
                  </div>
                  <div className="col-md-6 text-md-end">
                    <div className="alert alert-info border-0 mb-0">
                      <div className="d-flex align-items-center justify-content-md-end">
                        <i className="bi bi-clock-history me-2 fs-5"></i>
                        <div>
                          <strong className="d-block">Evaluation Period</strong>
                          <small>Deadline: April 10, 2025</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <ul className="nav nav-pills nav-fill p-3">
                  <li className="nav-item">
                    <button 
                      className={`nav-link d-flex align-items-center justify-content-center ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      <i className="bi bi-speedometer2 me-2"></i>
                      Overview
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link d-flex align-items-center justify-content-center ${activeTab === 'submissions' ? 'active' : ''}`}
                      onClick={() => setActiveTab('submissions')}
                    >
                      <i className={`bi ${userRole === 'evaluator' ? 'bi-clipboard-check' : 'bi-cloud-upload'} me-2`}></i>
                      {userRole === 'evaluator' ? 'Evaluations' : 'Submissions'}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link d-flex align-items-center justify-content-center ${activeTab === 'progress' ? 'active' : ''}`}
                      onClick={() => setActiveTab('progress')}
                    >
                      <i className="bi bi-graph-up me-2"></i>
                      Progress
                    </button>
                  </li>
                  {(userRole === 'teamLead' || userRole === 'admin') && (
                    <li className="nav-item">
                      <button 
                        className={`nav-link d-flex align-items-center justify-content-center ${activeTab === 'management' ? 'active' : ''}`}
                        onClick={() => setActiveTab('management')}
                      >
                        <i className="bi bi-gear me-2"></i>
                        Management
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="row">
          
          {/* Team Member & Team Lead Overview */}
          {(userRole === 'teammember' || userRole === 'team') && activeTab === 'overview' && (
            <>
              <div className="col-lg-8 mb-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <h5 className="mb-0 fw-bold text-primary">
                      <i className="bi bi-clipboard-data me-2"></i>
                      Submission Overview
                    </h5>
                    <span className={`badge bg-${userData.submissionStatus === 'Submitted' ? 'success' : 'warning'} fs-6`}>
                      {userData.submissionStatus}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-4">
                          <h6 className="fw-semibold text-muted mb-3">Submission Details</h6>
                          <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-people text-primary me-2"></i>
                            <span><strong>Team:</strong> {userData.teamName}</span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-calendar text-primary me-2"></i>
                            <span><strong>Submitted:</strong> {userData.submissionDate}</span>
                          </div>
                          <div className="mb-2">
                            <strong className="text-muted">Evaluators:</strong>
                            <ul className="list-unstyled mt-1">
                              {userData.evaluatorsAssigned && userData.evaluatorsAssigned.map((evaluator, index) => (
                                <li key={index} className="d-flex align-items-center">
                                  <i className="bi bi-person-check text-success me-2 small"></i>
                                  {evaluator}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card bg-gradient-primary text-white text-center h-100">
                          <div className="card-body d-flex flex-column justify-content-center">
                            <h3 className="display-4 fw-bold mb-2">{userData.currentScore}</h3>
                            <p className="mb-3 opacity-75">Current Score</p>
                            <div className="progress bg-white bg-opacity-25 mb-2" style={{height: '6px'}}>
                              <div 
                                className="progress-bar bg-white" 
                                style={{width: `${userData.currentScore}%`}}
                              ></div>
                            </div>
                            <span className="badge bg-light text-dark">
                              Rank {userData.rank} of {userData.totalTeams}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h6 className="fw-semibold text-muted mb-3">
                        <i className="bi bi-chat-left-text me-2"></i>
                        Feedback
                      </h6>
                      <div className="alert alert-info border-0">
                        <div className="d-flex">
                          <i className="bi bi-info-circle me-2 mt-1"></i>
                          <div>{userData.feedback}</div>
                        </div>
                      </div>
                    </div>

                    {userRole === 'teammember' && (
                      <div className="mt-4">
                        <h6 className="fw-semibold text-muted mb-3">
                          <i className="bi bi-check-circle me-2"></i>
                          My Contributions
                        </h6>
                        <div className="row g-2">
                          {userData.myContributions && userData.myContributions.map((contribution, index) => (
                            <div key={index} className="col-md-6">
                              <div className="card border-0 bg-light">
                                <div className="card-body py-2">
                                  <div className="d-flex align-items-center">
                                    <i className="bi bi-check2 text-success me-2"></i>
                                    <span className="small">{contribution}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-4 mb-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-bold text-warning">
                      <i className="bi bi-lightning me-2"></i>
                      Quick Actions
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      {userRole === 'teamLead' ? (
                        <>
                          <button className="btn btn-primary d-flex align-items-center justify-content-center py-2">
                            <i className="bi bi-pencil-square me-2"></i>
                            Update Submission
                          </button>
                          <button className="btn btn-outline-primary d-flex align-items-center justify-content-center py-2">
                            <i className="bi bi-people me-2"></i>
                            Manage Team
                          </button>
                        </>
                      ) : (
                        <button className="btn btn-outline-primary d-flex align-items-center justify-content-center py-2">
                          <i className="bi bi-person-badge me-2"></i>
                          View My Contributions
                        </button>
                      )}
                      <button className="btn btn-outline-info d-flex align-items-center justify-content-center py-2">
                        <i className="bi bi-chat-dots me-2"></i>
                        Contact Evaluators
                      </button>
                      <button className="btn btn-outline-success d-flex align-items-center justify-content-center py-2">
                        <i className="bi bi-trophy me-2"></i>
                        View Leaderboard
                      </button>
                      <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center py-2">
                        <i className="bi bi-download me-2"></i>
                        Download Resources
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <div className="card bg-light border-0">
                        <div className="card-body">
                          <h6 className="fw-semibold text-muted mb-3">
                            <i className="bi bi-calendar-event me-2"></i>
                            Important Dates
                          </h6>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="small">Submission Deadline:</span>
                            <strong className="text-danger">{userData.deadline}</strong>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="small">Results Announcement:</span>
                            <strong className="text-success">2025-04-20</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Evaluator Dashboard */}
          {userRole === 'evaluator' && activeTab === 'overview' && (
            <>
              <div className="col-lg-8 mb-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-bold text-primary">
                      <i className="bi bi-list-task me-2"></i>
                      Evaluation Tasks
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row text-center mb-4">
                      <div className="col-md-4 mb-3">
                        <div className="card bg-gradient-primary text-white border-0">
                          <div className="card-body py-4">
                            <h2 className="fw-bold mb-1">{userData.assignedSubmissions}</h2>
                            <p className="mb-0 opacity-75">Assigned Submissions</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="card bg-gradient-success text-white border-0">
                          <div className="card-body py-4">
                            <h2 className="fw-bold mb-1">{userData.evaluatedSubmissions}</h2>
                            <p className="mb-0 opacity-75">Evaluated</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="card bg-gradient-warning text-white border-0">
                          <div className="card-body py-4">
                            <h2 className="fw-bold mb-1">{userData.pendingEvaluations}</h2>
                            <p className="mb-0 opacity-75">Pending</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h6 className="fw-semibold text-muted mb-3">Recent Submissions</h6>
                    <div className="list-group border-0">
                      {userData.recentSubmissions && userData.recentSubmissions.map((submission, index) => (
                        <div key={index} className="list-group-item border-0 shadow-sm mb-2">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-1">{submission.teamName}</h6>
                              <p className="text-muted mb-1">{submission.topic}</p>
                              <small className="text-muted">
                                <i className="bi bi-clock me-1"></i>
                                {submission.submittedDate}
                              </small>
                            </div>
                            <div className="text-end">
                              <span className={`badge bg-${submission.status === 'pending' ? 'warning' : 'success'} mb-2`}>
                                {submission.status}
                              </span>
                              <br />
                              <button className="btn btn-sm btn-outline-primary">
                                {submission.status === 'pending' ? 'Start Evaluation' : 'View Details'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 mb-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-bold text-warning">
                      <i className="bi bi-lightning me-2"></i>
                      Quick Actions
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2 mb-4">
                      <button className="btn btn-primary d-flex align-items-center justify-content-center py-2">
                        <i className="bi bi-plus-circle me-2"></i>
                        Start New Evaluation
                      </button>
                      <button className="btn btn-outline-primary d-flex align-items-center justify-content-center py-2">
                        <i className="bi bi-clock-history me-2"></i>
                        View History
                      </button>
                      <button className="btn btn-outline-info d-flex align-items-center justify-content-center py-2">
                        <i className="bi bi-person me-2"></i>
                        Update Profile
                      </button>
                      <button className="btn btn-outline-success d-flex align-items-center justify-content-center py-2">
                        <i className="bi bi-file-text me-2"></i>
                        View Guidelines
                      </button>
                    </div>
                    
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <h6 className="fw-semibold text-muted mb-3">Evaluation Stats</h6>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Average Rating:</span>
                          <strong className="text-primary">{userData.averageRating}/5</strong>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Upcoming Deadline:</span>
                          <strong className="text-warning">{userData.upcomingDeadline}</strong>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>Total Evaluations:</span>
                          <strong className="text-success">{userData.evaluatedSubmissions}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Admin Dashboard */}
          {userRole === 'admin' && activeTab === 'overview' && (
            <div className="col-12 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0 fw-bold text-primary">
                    <i className="bi bi-speedometer2 me-2"></i>
                    System Overview
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row text-center mb-4">
                    <div className="col-md-3 mb-3">
                      <div className="card bg-gradient-primary text-white border-0 h-100">
                        <div className="card-body py-4">
                          <h2 className="fw-bold mb-1">{userData.totalTeams}</h2>
                          <p className="mb-0 opacity-75">Total Teams</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="card bg-gradient-success text-white border-0 h-100">
                        <div className="card-body py-4">
                          <h2 className="fw-bold mb-1">{userData.totalEvaluators}</h2>
                          <p className="mb-0 opacity-75">Evaluators</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="card bg-gradient-warning text-white border-0 h-100">
                        <div className="card-body py-4">
                          <h2 className="fw-bold mb-1">{userData.submissionsReceived}</h2>
                          <p className="mb-0 opacity-75">Submissions</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="card bg-gradient-danger text-white border-0 h-100">
                        <div className="card-body py-4">
                          <h2 className="fw-bold mb-1">{userData.pendingApprovals}</h2>
                          <p className="mb-0 opacity-75">Pending</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white py-3">
                          <h6 className="mb-0 fw-bold text-muted">
                            <i className="bi bi-activity me-2"></i>
                            Recent Activities
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="list-group list-group-flush">
                            {userData.recentActivities && userData.recentActivities.map((activity, index) => (
                              <div key={index} className="list-group-item px-0 border-0">
                                <div className="d-flex align-items-center">
                                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                    <i className="bi bi-circle-fill text-primary small"></i>
                                  </div>
                                  <span className="small">{activity}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white py-3">
                          <h6 className="mb-0 fw-bold text-muted">
                            <i className="bi bi-graph-up me-2"></i>
                            System Status
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="alert alert-success border-0 d-flex align-items-center">
                            <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                            <div>
                              <strong>Status:</strong> {userData.systemStatus}
                            </div>
                          </div>
                          <div className="mt-3">
                            <h6 className="fw-semibold text-muted mb-3">Quick Stats</h6>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span>Submission Rate:</span>
                              <strong className="text-success">84%</strong>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span>Evaluation Completion:</span>
                              <strong className="text-warning">67%</strong>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span>System Uptime:</span>
                              <strong className="text-primary">99.8%</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Tab - Evaluation Criteria */}
          {(userRole === 'teammember' || userRole === 'teamLead') && activeTab === 'progress' && (
            <div className="col-12 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0 fw-bold text-success">
                    <i className="bi bi-graph-up me-2"></i>
                    Evaluation Criteria & Scores
                  </h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="bg-light">
                        <tr>
                          <th>#</th>
                          <th>Criteria</th>
                          <th>Weightage</th>
                          <th>Score</th>
                          <th>Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evaluationCriteria.map(criterion => {
                          const percentage = (criterion.score / criterion.weightage) * 100;
                          let progressVariant = 'success';
                          if (percentage < 60) progressVariant = 'danger';
                          else if (percentage < 80) progressVariant = 'warning';

                          return (
                            <tr key={criterion.id}>
                              <td className="fw-bold">{criterion.id}</td>
                              <td>{criterion.criteria}</td>
                              <td>
                                <span className="badge bg-secondary">{criterion.weightage}%</span>
                              </td>
                              <td>
                                <span className="fw-bold text-primary">{criterion.score}</span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="progress flex-grow-1 me-2" style={{height: '8px'}}>
                                    <div 
                                      className={`progress-bar bg-${progressVariant}`}
                                      style={{width: `${percentage}%`}}
                                    ></div>
                                  </div>
                                  <small className="text-muted">{percentage.toFixed(1)}%</small>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="table-primary fw-bold">
                          <td colSpan="2">Total</td>
                          <td>100%</td>
                          <td>85</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress flex-grow-1 me-2" style={{height: '8px'}}>
                                <div className="progress-bar bg-primary" style={{width: '85%'}}></div>
                              </div>
                              <small>85%</small>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Management */}
          {userRole === 'team' && activeTab === 'management' && (
            <div className="col-12 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0 fw-bold text-primary">
                    <i className="bi bi-people me-2"></i>
                    Team Management
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="fw-semibold text-muted mb-3">Team Members</h6>
                      <div className="list-group">
                        {userData.teammembers && userData.teammembers.map((member, index) => (
                          <div key={index} className="list-group-item border-0 shadow-sm mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                  <i className="bi bi-person text-primary"></i>
                                </div>
                                <div>
                                  <h6 className="mb-0 fw-bold">{member.name}</h6>
                                  <small className="text-muted">{member.role} • {member.email}</small>
                                </div>
                              </div>
                              {member.role !== 'Lead' && (
                                <button className="btn btn-sm btn-outline-danger">
                                  <i className="bi bi-trash"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="btn btn-success mt-3 d-flex align-items-center">
                        <i className="bi bi-person-plus me-2"></i>
                        Add Team Member
                      </button>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-semibold text-muted mb-3">Team Submission</h6>
                      <div className="card border-0 bg-light">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span>Status:</span>
                            <span className="badge bg-success">{userData.submissionStatus}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span>Submission Date:</span>
                            <strong>{userData.submissionDate}</strong>
                          </div>
                          <div className="mb-3">
                            <span>Video Link:</span>
                            <div className="mt-1">
                              <a href="#" className="text-decoration-none">
                                <i className="bi bi-link-45deg me-1"></i>
                                https://drive.google.com/team-video-link
                              </a>
                            </div>
                          </div>
                          <div className="d-grid gap-2">
                            <button className="btn btn-primary d-flex align-items-center justify-content-center">
                              <i className="bi bi-pencil-square me-2"></i>
                              Update Submission
                            </button>
                            <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center">
                              <i className="bi bi-eye me-2"></i>
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Management */}
          {userRole === 'admin' && activeTab === 'management' && (
            <div className="col-12 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0 fw-bold text-warning">
                    <i className="bi bi-gear me-2"></i>
                    Administrative Actions
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    {[
                      { title: 'Team Management', description: 'Manage participant teams and submissions', icon: 'bi-people', variant: 'primary' },
                      { title: 'Evaluator Management', description: 'Approve and manage evaluators', icon: 'bi-person-check', variant: 'success' },
                      { title: 'System Settings', description: 'Configure competition parameters', icon: 'bi-sliders', variant: 'info' },
                      { title: 'Reports & Analytics', description: 'View competition statistics and reports', icon: 'bi-graph-up', variant: 'warning' },
                      { title: 'Announcements', description: 'Create and manage system announcements', icon: 'bi-megaphone', variant: 'secondary' },
                      { title: 'Backup & Recovery', description: 'System backup and data recovery', icon: 'bi-cloud-arrow-down', variant: 'dark' }
                    ].map((action, index) => (
                      <div key={index} className="col-md-4">
                        <div className="card border-0 shadow-sm h-100">
                          <div className="card-body text-center p-4">
                            <div className={`bg-${action.variant} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
                                 style={{width: '60px', height: '60px'}}>
                              <i className={`${action.icon} text-${action.variant} fs-4`}></i>
                            </div>
                            <h6 className="fw-bold mb-2">{action.title}</h6>
                            <p className="text-muted small mb-3">{action.description}</p>
                            <button className={`btn btn-${action.variant} btn-sm w-100`}>
                              Manage
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }
        .bg-gradient-success {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
        }
        .bg-gradient-warning {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%) !important;
        }
        .bg-gradient-danger {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%) !important;
        }
        .min-vh-100 {
          min-height: 100vh;
        }
        .nav-pills .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border: none;
        }
        .card {
          border-radius: 0.75rem;
        }
      `}</style>
    </>
  );
};

export default RoleBasedDashboard;