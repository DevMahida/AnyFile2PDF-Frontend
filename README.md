# AnyFile2PDF Frontend

React frontend for uploading files and converting them to PDF through the AnyFile2PDF backend API.

## Features

- Drag-and-drop file upload UI
- Progress indicator during upload
- Conversion support UI for PNG/JPG, CSV, DOCX/PPTX/XLSX, and IPYNB
- Download link generation from backend response
- Responsive layout for desktop and mobile

## Tech Stack

- React (Create React App)
- Axios
- Bootstrap

## Local Development

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Run

```bash
npm install
npm start
```

App runs at `http://localhost:3000`.

## Environment Variables

The frontend reads the backend API from `REACT_APP_API_BASE_URL`.

Example:

```env
REACT_APP_API_BASE_URL=https://anyfile2pdf-backend.onrender.com
```

If not provided, the app uses the default Render backend URL configured in code.

## Build

```bash
npm run build
```

Production output is generated in the `build/` folder.

## Deployment

### Vercel (Recommended for Frontend)

1. Import this repository in Vercel.
2. Ensure environment variable is set:
   `REACT_APP_API_BASE_URL=https://anyfile2pdf-backend.onrender.com`
3. Deploy.

### Render Static Site (Alternative)

- Build command: `npm ci && npm run build`
- Publish directory: `build`
- Set the same `REACT_APP_API_BASE_URL` environment variable.

## Repository

- Frontend repo: `https://github.com/DevMahida/AnyFile2PDF-Frontend`
- Backend repo: `https://github.com/DevMahida/AnyFile2PDF-Backend`
