import React, { useState } from "react";
import axios from "axios";

const DEFAULT_API_BASE_URL = "https://anyfile2pdf-backend.onrender.com";

function FileUpload() {

  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);

  const apiBaseUrl = (process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrorMessage("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setErrorMessage("");
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setErrorMessage("Please choose a file first.");
      return;
    }

    setErrorMessage("");
    setDownloadLink("");
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const convertEndpoint = `${apiBaseUrl}/convert`;

      const res = await axios.post(
        convertEndpoint,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) {
              return;
            }
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          },
        }
      );

      const pdfUrl = res?.data?.pdf_url;

      if (!pdfUrl) {
        setErrorMessage("Conversion succeeded but no PDF link was returned.");
        return;
      }

      const normalizedLink = pdfUrl.startsWith("http")
        ? pdfUrl
        : `${apiBaseUrl}${pdfUrl}`;

      setDownloadLink(normalizedLink);
    } catch (error) {
      const backendDetail = error?.response?.data?.detail;
      const statusCode = error?.response?.status;

      if (backendDetail) {
        setErrorMessage(String(backendDetail));
      } else if (statusCode) {
        setErrorMessage(`Conversion failed (HTTP ${statusCode}). Check backend URL/env on Vercel.`);
      } else {
        setErrorMessage(
          "Could not reach conversion API. Render free instances may take time to wake up; please retry in a few seconds."
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-card p-4">

      <p className="upload-title mb-2">Upload and Convert</p>
      <p className="upload-subtitle mb-3">Choose a file and generate your PDF.</p>

      <label
        className={`drop-zone mb-3 ${isDragActive ? "active" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="form-control file-picker"
          onChange={handleChange}
        />
        <span className="drop-zone-title">Drag and drop file here</span>
        <span className="drop-zone-sub">or click to browse</span>
        {file && <span className="selected-file">Selected: {file.name}</span>}
      </label>

      <button
        className="btn convert-btn w-100"
        onClick={uploadFile}
        disabled={isUploading}
      >
        {isUploading ? "Converting..." : "Convert to PDF"}
      </button>

      {isUploading && (
        <div className="progress-wrap mt-3">
          <div className="d-flex justify-content-between mb-1">
            <small>Uploading</small>
            <small>{uploadProgress}%</small>
          </div>
          <div className="progress" role="progressbar" aria-valuenow={uploadProgress} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-bar progress-bar-striped progress-bar-animated upload-progress-bar" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger mt-3 mb-0" role="alert">
          {errorMessage}
        </div>
      )}

      {downloadLink && (
        <div className="mt-3 d-grid">
          <a
            className="btn download-btn"
            href={downloadLink}
          >
            Download PDF
          </a>
        </div>
      )}

    </div>

  );
}

export default FileUpload;