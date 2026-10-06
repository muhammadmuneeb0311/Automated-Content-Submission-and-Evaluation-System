import { Container, Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const About = () => {
  const features = [
    {
      icon: 'bi-lightning-charge',
      title: 'Automated Evaluation',
      description: 'Streamlined scoring system with predefined criteria and real-time feedback',
      color: 'primary'
    },
    {
      icon: 'bi-people-fill',
      title: 'Team Collaboration',
      description: 'Support for team-based submissions with up to 5 members per team',
      color: 'success'
    },
    {
      icon: 'bi-graph-up',
      title: 'Real-time Analytics',
      description: 'Live leaderboard and progress tracking with detailed performance metrics',
      color: 'info'
    },
    {
      icon: 'bi-chat-dots',
      title: 'Instant Feedback',
      description: 'Immediate evaluation results with constructive feedback from experts',
      color: 'warning'
    },
    {
      icon: 'bi-shield-check',
      title: 'Secure Platform',
      description: 'Enterprise-grade security with role-based access control',
      color: 'danger'
    },
    {
      icon: 'bi-clock-history',
      title: '24/7 Availability',
      description: 'Round-the-clock access with automated submission handling',
      color: 'secondary'
    }
  ];

  const stats = [
    { value: '500+', label: 'Active Teams' },
    { value: '50+', label: 'Expert Evaluators' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Platform Uptime' }
  ];

  const technologies = [
    { name: 'React.js', level: 95 },
    { name: 'Node.js', level: 90 },
    { name: 'MongoDB', level: 85 },
    { name: 'Express.js', level: 88 },
    { name: 'Bootstrap 5', level: 92 },
    { name: 'JWT Auth', level: 87 }
  ];

  return (
    <>
      {/* Bootstrap Icons */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" 
        rel="stylesheet" 
      />

      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-50 py-5">
            <Col lg={8} className="mx-auto text-center">
              <Badge bg="light" text="primary" className="mb-3 fs-6 px-3 py-2">
                <i className="bi bi-star-fill me-2"></i>
                Trusted Platform
              </Badge>
              <h1 className="display-4 fw-bold mb-4">
                Transforming Content Evaluation
              </h1>
              <p className="lead mb-4 fs-5">
                Revolutionizing the way educational content is submitted, evaluated, and improved 
                through cutting-edge automation and intelligent assessment systems.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Button 
                  as={Link} 
                  to="/contact" 
                  variant="light" 
                  size="lg"
                  className="px-4 py-2 fw-semibold"
                >
                  <i className="bi bi-envelope me-2"></i>
                  Contact Us
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="outline-light" 
                  size="lg"
                  className="px-4 py-2 fw-semibold"
                >
                  <i className="bi bi-rocket-takeoff me-2"></i>
                  Get Started
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-4 bg-white">
        <Container>
          <Row className="g-4">
            {stats.map((stat, index) => (
              <Col key={index} xs={6} md={3}>
                <Card className="border-0 shadow-sm h-100 text-center">
                  <Card.Body className="p-4">
                    <h3 className="text-primary fw-bold mb-2">{stat.value}</h3>
                    <p className="text-muted mb-0 small fw-semibold">{stat.label}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <Card className="border-0 shadow">
                <Card.Body className="p-5">
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary rounded-circle p-3 me-3">
                      <i className="bi bi-bullseye text-white fs-4"></i>
                    </div>
                    <h3 className="fw-bold mb-0">Our Mission</h3>
                  </div>
                  <p className="text-muted lead mb-4">
                    To democratize content evaluation by providing an automated, transparent, 
                    and efficient platform that empowers educators, students, and professionals 
                    to showcase their creativity and technical expertise.
                  </p>
                  <Button variant="primary" size="lg">
                    <i className="bi bi-arrow-right me-2"></i>
                    Learn More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="border-0 shadow">
                <Card.Body className="p-5">
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-success rounded-circle p-3 me-3">
                      <i className="bi bi-eye text-white fs-4"></i>
                    </div>
                    <h3 className="fw-bold mb-0">Our Vision</h3>
                  </div>
                  <p className="text-muted lead mb-4">
                    To become the global standard for automated content evaluation, fostering 
                    innovation in educational technology and creating opportunities for 
                    lifelong learning and skill development.
                  </p>
                  <ul className="list-unstyled text-muted">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Global accessibility
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Continuous innovation
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Community-driven development
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <Badge bg="primary" className="mb-3 fs-6 px-3 py-2">
                Features
              </Badge>
              <h2 className="display-5 fw-bold mb-3">Why Choose Our Platform?</h2>
              <p className="text-muted lead">
                Experience the future of content evaluation with our comprehensive suite of features
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col key={index} lg={4} md={6}>
                <Card className="border-0 shadow-sm h-100 feature-card">
                  <Card.Body className="p-4 text-center">
                    <div className={`bg-${feature.color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4`} 
                         style={{width: '80px', height: '80px'}}>
                      <i className={`${feature.icon} text-${feature.color} fs-2`}></i>
                    </div>
                    <Card.Title className="h5 fw-bold mb-3">{feature.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Technology Stack */}
      <section className="py-5 bg-dark text-white">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <Badge bg="light" text="dark" className="mb-3 fs-6 px-3 py-2">
                Technology
              </Badge>
              <h2 className="display-5 fw-bold mb-3">Built with Modern Stack</h2>
              <p className="text-light lead">
                Leveraging cutting-edge technologies for optimal performance and user experience
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {technologies.map((tech, index) => (
              <Col key={index} lg={6} className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-semibold">{tech.name}</span>
                  <span className="text-light">{tech.level}%</span>
                </div>
                <ProgressBar 
                  now={tech.level} 
                  variant="primary" 
                  className="mb-3"
                  style={{height: '8px'}}
                />
              </Col>
            ))}
          </Row>
          <Row className="mt-4">
            <Col className="text-center">
              <div className="d-flex flex-wrap justify-content-center gap-3">
                {['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Bootstrap', 'JWT'].map((tech, index) => (
                  <Badge key={index} bg="light" text="dark" className="fs-6 px-3 py-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    {tech}
                  </Badge>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-gradient-primary text-white">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h3 className="display-6 fw-bold mb-4">Ready to Transform Your Content Evaluation?</h3>
              <p className="lead mb-4 opacity-75">
                Join thousands of educators and students who trust our platform for fair, 
                transparent, and efficient content assessment.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="light" 
                  size="lg"
                  className="px-5 py-3 fw-semibold"
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Start Free Trial
                </Button>
                <Button 
                  as={Link} 
                  to="/demo" 
                  variant="outline-light" 
                  size="lg"
                  className="px-5 py-3 fw-semibold"
                >
                  <i className="bi bi-play-circle me-2"></i>
                  Watch Demo
                </Button>
              </div>
              <div className="mt-4">
                <small className="opacity-75">
                  <i className="bi bi-shield-check me-1"></i>
                  No credit card required • 30-day free trial
                </small>
              </div>
            </Col> 
          </Row>
        </Container>
      </section>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }
        .min-vh-50 {
          min-height: 50vh;
        }
        .feature-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,.175) !important;
        }
      `}</style>
    </>
  );
};

export default About;