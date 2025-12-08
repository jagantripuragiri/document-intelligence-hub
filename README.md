# Document Intelligence Hub (DocuMind)

A powerful, AI-driven document analysis platform built with the MERN stack. DocuMind allows users to upload documents (PDF/TXT), instantly extract content, and engage in context-aware Q&A using Google's Gemini Pro AI.

![Dashboard Screenshot](/Users/jagantripuragiri/.gemini/antigravity/brain/7abe512e-a71b-4f91-8a90-29eb6b687860/dashboard_auth_success_1765033364135.png)

## 🚀 Key Features

-   **🤖 AI-Powered Analysis**: specialized RAG (Retrieval-Augmented Generation) pipeline using Google Gemini to answer questions based *only* on your provided documents.
-   **🎨 Professional GitHub-like UI**: A clean, developer-focused interface inspired by GitHub's Primer design system (Zinc/Gray themes, clean borders, high information density).
-   **📄 Instant Extraction**: Robust PDF and text parsing for immediate document indexing.
-   **💬 History & Context**: "Issue Thread" style chat interface that preserves context across multiple queries.
-   **🔐 Secure Authentication**: Full JWT-based authentication system with secure session management.

## 🛠️ Tech Stack

-   **Frontend**: React.js 19, Vite, Tailwind CSS v4, Lucide React
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB Atlas
-   **AI Engine**: Google Gemini API
-   **Styling**: Custom CSS Variables & Tailwind Utility Classes

## ⚡ Getting Started

### Prerequisites

-   Node.js (v18+)
-   MongoDB Atlas URI
-   Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jagantripuragiri/document-intelligence-hub.git
    cd document-intelligence-hub
    ```

2.  **Setup Backend:**
    ```bash
    cd server
    npm install
    # Create .env file with PORT, MONGO_URI, JWT_SECRET, GEMINI_API_KEY
    npm run dev
    ```

3.  **Setup Frontend:**
    ```bash
    cd client
    npm install
    npm run dev
    ```

4.  **Access the App:**
    Open `http://localhost:5173` (or the port shown in your terminal).

## 👨‍💻 Developer

**Jagan Tripuragiri**