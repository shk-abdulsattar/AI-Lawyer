# ⚖️ AI-Lawyer 

**AI-Lawyer** is an AI powered web application designed to make legal advice fast, clear, and accessible. Users can chat directly via **voice** with an AI legal consultant to ask questions about Indian laws, analyze legal documents in plain language, and search for qualified lawyers.

---

## 🌟 Key Features

* **🎙️ Interactive AI Voice Chat (Core Feature):** 
  * Speak directly with an AI Lawyer in real time using voice commands.
  * Get quick, easy-to-understand explanations of complex legal scenarios.

* **📄 AI Document Analyzer:**
  * Upload contracts, legal notices, or agreements.
  * Get simple AI summaries, key clauses extractions, and potential risk flags.

* **🔍 Find a Lawyer:**
  * Directory search tool to find verified legal professionals based on city and specialization.

* **📚 Know Your Rights:**
  * Educational portal explaining fundamental legal rights, and police interaction guides in India.

* **⚡ Modern & Responsive UI:**
  * Built using React and Vite for a clean, fast, and mobile-friendly user experience.

---

## 🏗️ Project Architecture

This application uses a modern full-stack system architecture:

1. **Frontend (This Repository):**
   * Built with **React.js**, **Vite**, and **Web Audio / Speech APIs**.
   * Manages user interface, page routes, state, and real-time audio input/output controls.

2. **Backend & AI Engine (Private Repository):**
   * Integrates with **Speech-to-Text (STT)** and **Text-to-Speech (TTS)** services.
   * Leverages Large Language Models prompted on **Indian Legal Statutes**.
   * Manages secure API gateways, database queries, and user sessions.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, JavaScript , CSS3, Web Speech API
* **Backend (Private):** Node.js, Express, Speech Recognition APIs, AI Models, Database

---

## 🚀 How to Run the App Locally

Follow these simple steps to start the frontend application on your computer:

### Prerequisites

* Install **Node.js** (version 16 or higher).

### Steps

1. Open terminal and navigate to the client folder:
   ```bash
   cd ai-lawyer/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to:
   ```text
   http://localhost:5173
   ```

