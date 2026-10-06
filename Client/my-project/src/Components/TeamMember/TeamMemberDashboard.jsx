import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../store";
import axios from "axios";
import { Container, Row, Col, Card, Badge, ProgressBar, ListGroup } from "react-bootstrap";

const TeamMemberDashboard = () => {
  const { token, teamId: contextTeamId } = useAuth();

  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [teamData, setTeamData] = useState({
    submissionStatus: "Not Submitted",
    currentScore: 0,
    maxScore: 100,
    rank: 0,
    totalTeams: 0,
    evaluatorsAssigned: [],
    submissionDate: "",
    deadline: "2025-04-10"
  });

  // ✅ get teamId safely
  const decodedTeamId = useMemo(
    () => contextTeamId || localStorage.getItem("teamId") || "",
    [contextTeamId]
  );

  const axiosInstance = useMemo(
    () =>
      axios.create({
        baseURL: "http://localhost:5000/api",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }),
    [token]
  );

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!token || !decodedTeamId) return;

      setLoading(true);
      try {
        // ✅ CORRECT API
        const res = await axiosInstance.get(
          `/teams/${decodedTeamId}/members`
        );

        setTeamName(res.data.teamName || "Unknown Team");
        setTeamMembers(res.data.members || []);

        // Optional (static / future data)
        setTeamData(prev => ({
          ...prev,
        }));
      } catch (err) {
        console.error("Team fetch error:", err);
        setTeamName("N/A");
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [token, decodedTeamId, axiosInstance]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      <div className="bg-light min-vh-100">
        <Container fluid className="py-4">
          {/* Header */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="h2 fw-bold text-primary mb-1">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Team Member Dashboard
                  </h1>
                  <p className="text-muted mb-0">
                    Welcome to your content evaluation workspace
                  </p>
                </div>
                <Badge bg="primary" className="fs-6">
                  <i className="bi bi-person me-1"></i>
                  Team Member
                </Badge>
              </div>
            </Col>
          </Row>

          <Row className="g-4">
            {/* Team Info */}
            <Col lg={8}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white py-3">
                  <h5 className="mb-0 fw-bold text-primary">
                    <i className="bi bi-people me-2"></i>
                    Team Information
                  </h5>
                </Card.Header>

                <Card.Body>
                  <Row>
                    <Col md={6}>
                      {/* Team Details */}
                      <h6 className="text-muted mb-2">Team Details</h6>
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                          <i className="bi bi-people-fill text-primary"></i>
                        </div>
                        <div>
                          <strong className="d-block fs-5">{teamName}</strong>
                          <small className="text-muted">Team Name</small>
                          <div className="small text-muted mt-1">
                            Team ID: {decodedTeamId}
                          </div>
                        </div>
                      </div>

                      {/* Team Members */}
                      <div className="mb-3">
                        <h6 className="text-muted mb-2">
                          <i className="bi bi-people me-2"></i>
                          Team Members
                        </h6>

                        {teamMembers.length === 0 ? (
                          <p className="small text-muted">No members found</p>
                        ) : (
                          <ul className="list-unstyled">
                            {teamMembers.map(member => (
                              <li
                                key={member._id}
                                className="mb-2 d-flex align-items-center"
                              >
                                <i className="bi bi-person-fill text-info me-2"></i>

                                <div>
                                  <strong>{member.name}</strong>
                                  <div className="small text-muted">
                                    {member.email}
                                  </div>
                                </div>

                                <Badge
                                  bg={member.isApproved ? "success" : "warning"}
                                  className="ms-auto"
                                >
                                  {member.isApproved ? "Approved" : "Pending"}
                                </Badge>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </Col>

                    {/* Score Section (unchanged) */}
                    <Col md={6}>
                      <div className="mb-4 text-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle py-2 px-4 d-inline-block">
                          <h2 className="fw-bold text-primary mb-0">
                            {teamData.currentScore}
                          </h2>
                          <small className="text-muted">
                            / {teamData.maxScore}
                          </small>
                        </div>

                        <ProgressBar
                          now={teamData.currentScore}
                          style={{ height: "8px" }}
                          className="mt-3"
                        />

                        <Badge bg="secondary" className="fs-6 mt-2 p-2">
                          Rank {teamData.rank} of {teamData.totalTeams}
                        </Badge>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Dates */}
            <Col lg={4}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white py-3">
                  <h5 className="mb-0 fw-bold text-info">
                    <i className="bi bi-calendar-event me-2"></i>
                    Important Dates
                  </h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between border-0 px-0">
                      <span>Submission Deadline</span>
                      <Badge bg="warning">{teamData.deadline}</Badge>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default TeamMemberDashboard;
