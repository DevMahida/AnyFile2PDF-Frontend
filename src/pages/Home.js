import React from "react";
import FileUpload from "../components/FileUpload";
import logo from "../images/pdf.png";
import "../styles/home.css";

function Home() {
  return (
    <div className="landing-root">
      <header className="site-header sticky-top">
        <nav className="container navbar navbar-expand-lg py-3">
          <a className="navbar-brand brand-mark" href="#home" aria-label="AnyFile2PDF Home">
            <img
              src={logo}
              alt="AnyFile2PDF"
              className="brand-logo"
            />
            <h4 className="brand-title gradient-text mb-0">AnyFile2PDF</h4>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto gap-lg-2">
              <li className="nav-item"><a className="nav-link" href="#home">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#convert">Convert</a></li>
              <li className="nav-item"><a className="nav-link" href="#features">Features</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <main className="container py-5 content-layer" id="home">
        <section className="hero-card p-4 p-md-5 mb-4" id="convert">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <p className="hero-kicker gradient-text mb-2">AnyFile2PDF</p>
              <h1 className="hero-title mb-3">Convert Your Files to PDF in Seconds</h1>
              <p className="hero-subtitle mb-4">
                Upload one file and get a polished PDF instantly. Built for quick workflows,
                clean output, and everyday productivity.
              </p>

              <div className="hero-tags d-flex flex-wrap gap-2">
                <span className="badge format-pill">Images</span>
                <span className="badge format-pill">CSV Data</span>
                <span className="badge format-pill">Office Docs</span>
                <span className="badge format-pill">Jupyter Notebooks</span>
              </div>
            </div>

            <div className="col-lg-5">
              <FileUpload />
            </div>
          </div>
        </section>

        <section className="details-card p-4 p-md-5" id="features">
          <div className="row g-4">
            <div className="col-md-6">
              <h2 className="section-title">Supported Conversions</h2>
              <p className="section-copy mb-3">
                You can upload the following file formats and convert them to PDF:
              </p>
              <ul className="format-list mb-0">
                <li>Images: PNG, JPG, JPEG</li>
                <li>Data: CSV</li>
                <li>Office files: DOCX, PPTX, XLSX</li>
                <li>Notebook files: IPYNB</li>
              </ul>
            </div>

            <div className="col-md-6">
              <h2 className="section-title">Why Use It</h2>
              <div className="feature-grid">
                <article className="feature-item">
                  <h3>Fast Workflow</h3>
                  <p>Simple upload and instant PDF generation with no complex steps.</p>
                </article>
                <article className="feature-item">
                  <h3>Single Destination</h3>
                  <p>Convert multiple content types into one standardized PDF format.</p>
                </article>
                <article className="feature-item">
                  <h3>Clean Download</h3>
                  <p>Downloads return meaningful names and ready-to-share files.</p>
                </article>
                <article className="feature-item">
                  <h3>Responsive UI</h3>
                  <p>Designed to work smoothly on desktop, tablet, and mobile screens.</p>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container py-4 d-flex flex-column flex-md-row justify-content-between gap-2">
          <p className="gradient-text mb-0">AnyFile2PDF</p>
          <p className="mb-0">Convert Images, CSV, Office Files, and IPYNB to PDF</p>
        </div>
      </footer>
    </div>

  );
}

export default Home;