# 🛠️ CORS Debugger

A simple tool that helps developers **check whether CORS (Cross-Origin Resource Sharing)** is correctly configured in their **React frontend** and **Flask backend** code.

🔗 **Live Demo:** [https://cors-debugger.vercel.app](https://cors-debugger.vercel.app)

---

## 🚀 Features

- Paste your **React (frontend)** and **Flask (backend)** code
- The tool scans the code for proper CORS setup
- Get **specific error messages** for common CORS issues
- Visual indicators for success or failure
- Clean UI
- Copy-to-clipboard for request code
- Dark/light theme toggle
- Hosted on Vercel and Render

---

## ⚙️ Tech Stack

### Frontend

- React
- CSS

### Backend

- Flask

---

## 🔍 How It Works

1. Paste your **React frontend code** on the left panel
2. Paste your **Flask backend code** on the right panel
3. Click **Run**
4. The tool parses both code snippets and:
   - Detects whether CORS is enabled properly
   - Shows specific feedback if configuration is missing or incorrect
