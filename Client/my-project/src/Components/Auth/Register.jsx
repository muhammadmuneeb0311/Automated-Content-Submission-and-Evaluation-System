import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';

const URL = "https://automated-content-submission-and-t73b.onrender.com/api/auth/register";

const Register = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "team",
    qualification: "",
    experience: "",
    specialization: "",
    teamName: "",
    members: [{ name: "", email: "" }],
  });

  const [formErrors, setFormErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle member input change
  const handleMemberChange = (index, field, value) => {
    const newMembers = [...user.members];
    newMembers[index][field] = value;
    setUser((prev) => ({
      ...prev,
      members: newMembers,
    }));
  };

  // Add a new team member
  const addMember = () => {
    if (user.members.length < 5) {
      setUser((prev) => ({
        ...prev,
        members: [...prev.members, { name: "", email: "" }],
      }));
    } else {
      alert("Maximum 5 members allowed!");
    }
  };

  // Remove a team member
  const removeMember = (index) => {
    if (user.members.length > 1) {
      const newMembers = user.members.filter((_, i) => i !== index);
      setUser((prev) => ({
        ...prev,
        members: newMembers,
      }));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFormErrors({});
    setLoading(true);

    if (!user.email || !user.password) {
      setErrorMessage("Email and password are required");
      setLoading(false);
      return;
    }

    // ✅ Build payload based on role
    let payload = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role: user.role,
    };

    // Add team-specific fields
    if (user.role === "team") {
      payload.teamName = user.teamName;
      payload.members = user.members;
    }

    // Add evaluator-specific fields
    if (user.role === "evaluator") {
      payload.qualification = user.qualification;
      payload.specialization = user.specialization;
      payload.experience = user.experience;
    }

    console.log("📤 Sending payload:", payload);

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch { }

      if (!response.ok) {
        if (data.errors) {
          if (Array.isArray(data.errors)) {
            if (typeof data.errors[0] === "string") {
              setErrorMessage(data.errors[0]);
            } else {
              const fieldErrors = {};
              data.errors.forEach((err) => {
                if (err.path && err.path.length > 0) {
                  fieldErrors[err.path[0]] = err.message;
                }
              });
              setFormErrors(fieldErrors);
            }
          }
        } else {
          const backendMsg =
            data.msg ||
            data.message ||
            "❌ Registration failed. Please check your input.";
          setErrorMessage(backendMsg);
        }
        setLoading(false);
        return;
      }

      navigate("/login");
    } catch (error) {
      console.error("❌ Registration error:", error);
      setErrorMessage("Server not responding. Try again later.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bootstrap Icons */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" 
        rel="stylesheet" 
      />

      <div className="bg-gradient-primary min-vh-100 py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} xl={7}>
              {/* Brand Header */}
              <div className="text-center mb-5">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <div className="bg-white rounded-circle p-3 shadow">
                    <i className="bi bi-lightning-charge-fill text-primary fs-2"></i>
                  </div>
                </div>
                <h2 className="text-white fw-bold">ContentEval</h2>
                <p className="text-white-50">Create Your Account</p>
              </div>

              {/* Registration Card */}
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-5">
                  {/* Card Header */}
                  <div className="text-center mb-4">
                    <h3 className="fw-bold text-primary">
                      <i className="bi bi-person-plus me-2"></i>
                      Create Account
                    </h3>
                    <p className="text-muted">Join our content evaluation platform</p>
                  </div>

                  {/* Error Alert */}
                  {errorMessage && (
                    <Alert variant="danger" className="d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {errorMessage}
                    </Alert>
                  )}

                  {/* Registration Form */}
                  <Form onSubmit={handleSubmit}>
                    {/* Role Selection */}
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-person-badge me-2"></i>
                        Account Type
                      </Form.Label>
                      <Form.Select
                        name="role"
                        value={user.role}
                        onChange={handleInput}
                        size="lg"
                        className="border-2"
                      >
                        <option value="team">Team Participant</option>
                        <option value="evaluator">Evaluator</option>
                      </Form.Select>
                      <Form.Text className="text-muted">
                        {user.role === "team" 
                          ? "Register as a team to submit content" 
                          : "Register as an evaluator to review submissions"}
                      </Form.Text>
                    </Form.Group>

                    <Row>
                      {/* Basic Information */}
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-person me-2"></i>
                            {user.role === "team" ? "Team Leader Name" : "Full Name"}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleInput}
                            placeholder="Enter your full name"
                            required
                            size="lg"
                            className={`border-2 py-3 ${formErrors.name ? "is-invalid" : ""}`}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-envelope me-2"></i>
                            Email Address
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleInput}
                            placeholder="Enter your email"
                            required
                            size="lg"
                            className={`border-2 py-3 ${formErrors.email ? "is-invalid" : ""}`}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-phone me-2"></i>
                            Phone Number
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={user.phone}
                            onChange={handleInput}
                            placeholder="Enter your phone number"
                            required
                            size="lg"
                            className={`border-2 py-3 ${formErrors.phone ? "is-invalid" : ""}`}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-lock me-2"></i>
                            Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleInput}
                            placeholder="Create a password"
                            required
                            size="lg"
                            className={`border-2 py-3 ${formErrors.password ? "is-invalid" : ""}`}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Team Specific Fields */}
                    {user.role === "team" && (
                      <div className="bg-light rounded p-4 mb-4">
                        <h5 className="fw-bold text-primary mb-3">
                          <i className="bi bi-people me-2"></i>
                          Team Information
                        </h5>
                        
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">Team Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="teamName"
                            value={user.teamName}
                            onChange={handleInput}
                            placeholder="Enter your team name"
                            required
                            size="lg"
                            className={`border-2 py-3 ${formErrors.teamName ? "is-invalid" : ""}`}
                          />
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <Form.Label className="fw-semibold mb-0">Team Members</Form.Label>
                          <Badge bg="primary" className="fs-6">
                            {user.members.length}/5 Members
                          </Badge>
                        </div>

                        {user.members.map((member, index) => (
                          <Row key={index} className="mb-3 align-items-end">
                            <Col md={5}>
                              <Form.Label className="small text-muted">Member {index + 1} Name</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Full name"
                                value={member.name}
                                onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                                required
                              />
                            </Col>
                            <Col md={5}>
                              <Form.Label className="small text-muted">Email Address</Form.Label>
                              <Form.Control
                                type="email"
                                placeholder="Email address"
                                value={member.email}
                                onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                                required
                              />
                            </Col>
                            <Col md={2}>
                              {user.members.length > 1 && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => removeMember(index)}
                                  className="w-100"
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              )}
                            </Col>
                          </Row>
                        ))}

                        <Button
                          variant="outline-primary"
                          onClick={addMember}
                          disabled={user.members.length >= 5}
                          className="w-100"
                        >
                          <i className="bi bi-plus-circle me-2"></i>
                          Add Team Member
                        </Button>
                      </div>
                    )}

                    {/* Evaluator Specific Fields */}
                    {user.role === "evaluator" && (
                      <div className="bg-light rounded p-4 mb-4">
                        <h5 className="fw-bold text-primary mb-3">
                          <i className="bi bi-award me-2"></i>
                          Professional Information
                        </h5>
                        
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">Qualification</Form.Label>
                              <Form.Control
                                type="text"
                                name="qualification"
                                value={user.qualification}
                                onChange={handleInput}
                                placeholder="Your highest qualification"
                                required
                                size="lg"
                                className={`border-2 py-3 ${formErrors.qualification ? "is-invalid" : ""}`}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">Specialization</Form.Label>
                              <Form.Control
                                type="text"
                                name="specialization"
                                value={user.specialization}
                                onChange={handleInput}
                                placeholder="Your area of expertise"
                                required
                                size="lg"
                                className={`border-2 py-3 ${formErrors.specialization ? "is-invalid" : ""}`}
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">Experience Details</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="experience"
                            value={user.experience}
                            onChange={handleInput}
                            placeholder="Describe your relevant experience..."
                            required
                            className={`border-2 ${formErrors.experience ? "is-invalid" : ""}`}
                          />
                        </Form.Group>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                      className="w-100 py-2 fw-semibold fs-5"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Create Account
                        </>
                      )}
                    </Button>
                  </Form>

                  {/* Login Link */}
                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      Already have an account?{" "}
                      <Link 
                        to="/login" 
                        className="text-decoration-none fw-semibold text-primary"
                      >
                        <i className="bi bi-box-arrow-in-right me-1"></i>
                        Sign In
                      </Link>
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }
        .min-vh-100 {
          min-height: 100vh;
        }
        .border-2 {
          border-width: 2px !important;
        }
        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
      `}</style>
    </>
  );
};

export default Register;