import React, { useEffect, useState } from "react";
import axios from "axios";

const DEFAULT_API_BASE_URL = "https://anyfile2pdf-backend.onrender.com";

function FileUpload() {

  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");
  const [downloadName, setDownloadName] = useState("converted_file.pdf");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);

  const apiBaseUrl = (process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");

  useEffect(() => {
    return () => {
      if (downloadLink) {
        URL.revokeObjectURL(downloadLink);
      }
    };
  }, [downloadLink]);

  const extractFilenameFromDisposition = (headerValue) => {
    if (!headerValue) {
      return "converted_file.pdf";
    }

    const utf8Match = headerValue.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match?.[1]) {
      return decodeURIComponent(utf8Match[1]);
    }

    const plainMatch = headerValue.match(/filename="?([^";]+)"?/i);
    if (plainMatch?.[1]) {
      return plainMatch[1];
    }

    return "converted_file.pdf";
  };

  const readBlobErrorMessage = async (error) => {
    const blobData = error?.response?.data;
    if (!(blobData instanceof Blob)) {
      return null;
    }

    try {
      const text = await blobData.text();
      const parsed = JSON.parse(text);
      return parsed?.detail ? String(parsed.detail) : null;
    } catch {
      return null;
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrorMessage("");
      setDownloadLink("");
      setUploadProgress(0);
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
      setDownloadLink("");
      setUploadProgress(0);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setErrorMessage("Please choose a file first.");
      return;
    }

    setErrorMessage("");
    if (downloadLink) {
      URL.revokeObjectURL(downloadLink);
    }
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
          responseType: "blob",
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) {
              return;
            }
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          },
        }
      );

      const contentType = res?.headers?.["content-type"] || "application/pdf";
      const disposition = res?.headers?.["content-disposition"];
      const filename = extractFilenameFromDisposition(disposition);
      const pdfBlob = new Blob([res.data], { type: contentType });
      const objectUrl = URL.createObjectURL(pdfBlob);

      setDownloadName(filename);
      setDownloadLink(objectUrl);
    } catch (error) {
      const backendDetail = await readBlobErrorMessage(error);
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
            download={downloadName}
          >
            Download PDF
          </a>
        </div>
      )}

    </div>

  );
}

export default FileUpload;