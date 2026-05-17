# Fake Account Detector

This project contains a Next.js frontend and a Python backend for detecting fake accounts.

## Project Structure

- `app/`: Next.js frontend application.
- `backend/`: Python backend for the Machine Learning model and API.

## Setup Instructions

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup

1. Create and activate a Python virtual environment.
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the backend server:
   ```bash
   cd backend
   .\venv\Scripts\activate
   python -m uvicorn main:app --reload --port 8000
   ```
*(Enjoy detecting fake accounts!)*