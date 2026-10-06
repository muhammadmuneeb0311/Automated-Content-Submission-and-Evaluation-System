import { Link } from 'react-router-dom';
import { Button, Container, Row, Col, Card, Badge } from 'react-bootstrap';
import "bootstrap-icons/font/bootstrap-icons.css";


const Home = () => {
  const features = [
    {
      icon: 'bi-lightning-charge',
      title: 'Fast Evaluation',
      description: 'Get your content evaluated quickly with our automated system',
      color: 'primary'
    },
    {
      icon: 'bi-graph-up',
      title: 'Real-time Tracking',
      description: 'Monitor your submission progress with live updates',
      color: 'success'
    },
    {
      icon: 'bi-shield-check',
      title: 'Secure Platform',
      description: 'Enterprise-grade security for all your submissions',
      color: 'info'
    },
    {
      icon: 'bi-people',
      title: 'Team Collaboration',
      description: 'Work together with your team on submissions',
      color: 'warning'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Register Account',
      description: 'Create your account as participant or evaluator',
      icon: 'bi-person-plus'
    },
    {
      number: '02',
      title: 'Submit Content',
      description: 'Upload your video content and related information',
      icon: 'bi-cloud-upload'
    },
    {
      number: '03',
      title: 'Get Evaluated',
      description: 'Professional reviewers assess your submission',
      icon: 'bi-clipboard-check'
    },
    {
      number: '04',
      title: 'Track Progress',
      description: 'Monitor scores and feedback in real-time',
      icon: 'bi-graph-up-arrow'
    }
  ];

  const stats = [
    { value: '500+', label: 'Active Teams' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Platform Uptime' },
    { value: '1000+', label: 'Submissions' }
  ];

  return (
    <>
      {/* Bootstrap Icons */}
     

      {/* Header Navigation */}
      <nav className="bg-white shadow-sm py-3">
        <Container>
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center">
                <div className="bg-primary rounded-circle p-2 me-3">
                  <i className="bi bi-lightning-charge-fill text-white fs-5"></i>
                </div>
                <h4 className="fw-bold text-primary mb-0">ContentEval</h4>
              </div>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-2">
                <Button as={Link} to="/login" variant="outline-primary" className="px-4">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Button>
                <Button as={Link} to="/register" variant="primary" className="px-4">
                  <i className="bi bi-person-plus me-2"></i>
                  Register
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-50 py-5">
            <Col lg={8} className="mx-auto text-center">
              <Badge bg="light" text="primary" className="mb-4 fs-6 px-3 py-2">
                <i className="bi bi-star-fill me-2"></i>
                Trusted Platform
              </Badge>
              <h1 className="display-4 fw-bold mb-4">
                Automated Content Evaluation System
              </h1>
              <p className="lead fs-4 mb-4 opacity-75">
                Submit, evaluate, and track your content submissions with our advanced AI-powered platform
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="light" 
                  size="lg"
                  className="px-5 py-3 fw-semibold"
                >
                  <i className="bi bi-rocket-takeoff me-2"></i>
                  Get Started Free
                </Button>
                <Button 
                  as={Link} 
                  to="/about" 
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
                  No credit card required • Free trial available
                </small>
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

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <Badge bg="primary" className="mb-3 fs-6 px-3 py-2">
                Features
              </Badge>
              <h2 className="display-5 fw-bold mb-3">Why Choose Our Platform?</h2>
              <p className="text-muted lead">
                Experience the future of content evaluation with our comprehensive features
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col key={index} lg={3} md={6}>
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

      {/* How It Works Section */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <Badge bg="success" className="mb-3 fs-6 px-3 py-2">
                Process
              </Badge>
              <h2 className="display-5 fw-bold mb-3">How It Works</h2>
              <p className="text-muted lead">
                Simple steps to get your content evaluated by professionals
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {steps.map((step, index) => (
              <Col key={index} lg={3} md={6}>
                <Card className="border-0 shadow h-100 text-center position-relative">
                  <Card.Body className="p-4">
                    <div className="position-absolute top-0 start-50 translate-middle">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                           style={{width: '50px', height: '50px', marginTop: '-25px'}}>
                        <span className="fw-bold fs-5">{step.number}</span>
                      </div>
                    </div>
                    <div className="pt-4">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                           style={{width: '60px', height: '60px'}}>
                        <i className={`${step.icon} text-primary fs-3`}></i>
                      </div>
                      <Card.Title className="h5 fw-bold mb-3">{step.title}</Card.Title>
                      <Card.Text className="text-muted">
                        {step.description}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-gradient-primary text-white">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h3 className="display-6 fw-bold mb-4">Ready to Get Started?</h3>
              <p className="lead mb-4 opacity-75">
                Join hundreds of teams who trust our platform for fair and efficient content evaluation
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
                  to="/contact" 
                  variant="outline-light" 
                  size="lg"
                  className="px-5 py-3 fw-semibold"
                >
                  <i className="bi bi-chat-dots me-2"></i>
                  Contact Sales
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center">
                <i className="bi bi-lightning-charge-fill text-primary fs-4 me-2"></i>
                <span className="fw-bold">ContentEval System</span>
              </div>
              <p className="text-white-50 mt-2 mb-0">
                Revolutionizing content evaluation through automation and innovation
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <p className="text-white-50 mb-0">
                © {new Date().getFullYear()} Content Evaluation System. All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>

 
    </>
  );
};

export default Home;