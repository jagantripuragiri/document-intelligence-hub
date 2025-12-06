# Document Intelligence and Knowledge Search Hub (DocuMind)

DocuMind is a full-stack MERN application that enables users to upload documents (PDF/Text), automatically extract their content, and interact with an AI-powered Q&A interface using Google Gemini. Users can ask questions about their uploaded documents and receive meaningful answers supported by relevant document references. This project was developed as a task for reaidy.io during my campus placement drive.


## Features
- **Modern UI**: Built with React, Tailwind CSS, and Framer Motion for a premium feel.
- **Document Processing**: Upload and extract text from PDFs and TXT files instantly.
- **AI Intelligence**: Ask questions about your documents and get answers with references.
- **Authentication**: Secure JWT-based Signup/Login.
- **History**: View past queries and answers.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, Multer (File Upload), PDF-Parse
- **Database**: MongoDB
- **AI**: Google Gemini API

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB URI (local or Atlas)
- Google Gemini API Key

### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   -  create `.env`  and add your keys:
     ```
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     GEMINI_API_KEY=your_gemini_api_key
     ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

##  Steps
1. Open the frontend URL .
2. **Sign Up** for a new account.
3. **Upload** a PDF or Text document on the Dashboard.
4. **Click "Start Chatting"** and ask a question about the document content.
5. Verify the answer is correct and check the **Recent Inquiries** on the Dashboard.


Developed by **Jagan Tripuragiri**