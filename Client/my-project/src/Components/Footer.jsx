import "bootstrap-icons/font/bootstrap-icons.css";


const Footer = () => {
  return (
    <>


      <footer className="bg-light border-top mt-auto">
        {/* Compact Footer Content */}
        <div className="container py-3">
          <div className="row align-items-center">
            
            {/* Brand & Version - Left Side */}
            <div className="col-md-6 mb-2 mb-md-0">
              <div className="d-flex align-items-center">
                <div className="bg-primary rounded-circle p-1 me-2">
                  <i className="bi bi-lightning-charge-fill text-white fs-7"></i>
                </div>
                <div>
                  <span className="fw-bold text-primary small">ContentEval System</span>
                  <span className="text-muted small ms-2">v2.1.0</span>
                </div>
              </div>
            </div>

            {/* Copyright & Links - Right Side */}
            <div className="col-md-6">
              <div className="d-flex flex-column flex-md-row justify-content-md-end align-items-center gap-2">
                <span className="text-muted small">
                  © {new Date().getFullYear()} Virtual University
                </span>
                <div className="vr d-none d-md-block"></div>
                <div className="d-flex gap-3">
                  <a href="/support" className="text-muted small text-decoration-none hover-primary">
                    <i className="bi bi-question-circle me-1"></i>
                    Help
                  </a>
                  <a href="/contact" className="text-muted small text-decoration-none hover-primary">
                    <i className="bi bi-envelope me-1"></i>
                    Contact
                  </a>
                  <a href="/privacy" className="text-muted small text-decoration-none hover-primary">
                    <i className="bi bi-shield-check me-1"></i>
                    Privacy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

   
    </>
  );
};

export default Footer;