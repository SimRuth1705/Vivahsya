# 💍 Vivahasya - Wedding Management Portal

Welcome to the Vivahasya development repository! This is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to manage leads, bookings, and wedding timelines.

## 🚀 Getting Started for Developers

Follow these steps to get a local copy of the project up and running on your machine.

### Prerequisites
Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v16 or higher)
* [Git](https://git-scm.com/)

---

### 1️⃣ Clone the Repository
Open your terminal and clone the project to your local machine:
\`\`\`bash
git clone https://github.com/YOUR_GITHUB_USERNAME/vivahasya.git
cd vivahasya
\`\`\`

### 2️⃣ Install Dependencies
Because `node_modules` are ignored by Git, you must install the required packages for **both** the frontend and the backend.

**For the Backend:**
\`\`\`bash
cd backend
npm install
cd ..
\`\`\`

**For the Frontend:**
\`\`\`bash
cd frontend
npm install
cd ..
\`\`\`

---

### 3️⃣ Environment Variables (`.env`)
⚠️ **CRITICAL:** The database and authentication will not work without environment variables. 

1. Navigate into the `backend` folder.
2. Create a new file named exactly `.env`.
3. Ask the project admin (Samson) for the secret keys.
4. Your `.env` file should look like this:

\`\`\`text
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0...
JWT_SECRET=your_secret_key
ADMIN_EMAIL=your_email@gmail.com
ADMIN_APP_PASSWORD=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

---

### 4️⃣ Database Access (MongoDB Firewall)
If you see the error `querySrv ECONNREFUSED` when starting the backend, MongoDB is blocking your laptop's IP address.

**How to fix it:**
1. Log into MongoDB Atlas (or ask the admin to do this).
2. Go to **Network Access** under the Security tab.
3. Click **Add IP Address**.
4. Select **Allow Access From Anywhere** (`0.0.0.0/0`).
5. Wait 2 minutes for the firewall to update and try again.

---

### 5️⃣ Running the Application

You will need to run two terminal windows simultaneously—one for the server and one for the React app.

**Terminal 1 (Backend Server):**
\`\`\`bash
cd backend
npm start
\`\`\`
*Expected Output: `✅ MongoDB Atlas Connected` and `🚀 Server running on port 5000`*

**Terminal 2 (Frontend Client):**
\`\`\`bash
cd frontend
npm run dev
\`\`\`
*This will open the application in your browser, usually at `http://localhost:5173`.*

---

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, Recharts, Sonner (Toasts)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas, Mongoose
* **Authentication:** JSON Web Tokens (JWT), Bcrypt.js
* **File Storage:** Cloudinary