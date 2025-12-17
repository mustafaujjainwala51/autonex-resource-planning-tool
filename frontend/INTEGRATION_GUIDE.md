# Frontend-Backend Integration Guide

## 📋 Overview

You have a **backend repository** at GitHub and an **already-built frontend** (our Vite React app). We need to integrate them properly.

## 🎯 Strategy

Instead of creating a new React app (as instructions suggest), we'll integrate our **superior** existing frontend into the repository.

---

## 🚀 Step-by-Step Integration

### Step 1: Clone the Backend Repository

Open your terminal and run:

```bash
# Navigate to where you want the project
cd ~/Documents/Projects  # or wherever you keep projects

# Clone the repository
git clone https://github.com/mustafaujjainwala51/autonex-resource-planning-tool.git

# Enter the directory
cd autonex-resource-planning-tool
```

**What this does:** Downloads the backend code to your machine.

---

### Step 2: Check Backend Branch

```bash
# Fetch all branches
git fetch

# Switch to backend branch
git checkout backend-project-setup

# Verify you're on the right branch
git branch
```

**Expected output:** Should show `* backend-project-setup`

---

### Step 3: Create Frontend Branch

```bash
# Create and switch to new branch for frontend work
git checkout -b frontend-project-creation
```

**What this does:** Creates a new branch called `frontend-project-creation` so your frontend work is separate from backend.

---

### Step 4: Examine Backend Structure

```bash
# List files to see backend structure
ls -la
```

**You should see something like:**
```
backend/
  ├── app/
  │   ├── main.py
  │   ├── models/
  │   └── routes/
  ├── requirements.txt
  └── ...
```

---

### Step 5: Integrate Our Frontend

**Option A: If `frontend/` folder doesn't exist yet:**

```bash
# Create frontend directory
mkdir frontend

# Extract our built frontend into it
# (You'll need to extract autonex-frontend-v2.zip here)
```

**Option B: If `frontend/` already exists:**

```bash
# Remove the existing frontend folder (if it's empty/placeholder)
rm -rf frontend

# Extract our frontend
# (Extract autonex-frontend-v2.zip and rename to 'frontend')
```

**Manual Steps:**
1. Download `autonex-frontend-v2.zip` from earlier
2. Extract it on your computer
3. Rename the extracted folder from `autonex-frontend` to `frontend`
4. Copy this `frontend` folder into `autonex-resource-planning-tool/`

**Final structure should look like:**
```
autonex-resource-planning-tool/
├── backend/
│   ├── app/
│   ├── main.py
│   └── ...
└── frontend/
    ├── src/
    ├── package.json
    ├── vite.config.js
    └── ...
```

---

### Step 6: Update API Configuration

Navigate to the frontend and update the API endpoint:

```bash
cd frontend
```

**Edit `src/api/config.js`:**

```javascript
// Change this line:
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// To match your backend endpoint (remove /api if backend doesn't use it):
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';
```

**Why?** Your backend might serve projects at `http://localhost:8000/projects` directly, not `http://localhost:8000/api/projects`.

---

### Step 7: Check Backend API Contract

**Check what endpoint your backend actually uses:**

```bash
cd ../backend
# Look at the routes file
cat app/routes/projects.py  # or wherever routes are defined
```

**You're looking for:** The endpoint path like `/projects` or `/api/projects`

**Common patterns:**
- FastAPI: Usually `@app.post("/projects")`
- Flask: Usually `@app.route('/projects', methods=['POST'])`

---

### Step 8: Update Frontend API Endpoints

Based on what you found, update `frontend/src/api/config.js`:

**If backend uses `/projects` directly:**
```javascript
export const API_ENDPOINTS = {
  PROJECTS: '/projects',  // ✅ Correct
  PROJECT_BY_ID: (id) => `/projects/${id}`,
  // ... rest stays the same
};
```

**If backend uses `/api/projects`:**
```javascript
export const API_ENDPOINTS = {
  PROJECTS: '/api/projects',  // ✅ With /api prefix
  PROJECT_BY_ID: (id) => `/api/projects/${id}`,
  // ... rest stays the same
};
```

---

### Step 9: Install Frontend Dependencies

```bash
cd frontend
npm install
```

**What this does:** Installs all required packages (React, Vite, etc.)

**Expected output:** Should install ~200+ packages without errors.

---

### Step 10: Start Backend Server

**Open a NEW terminal window** (keep frontend terminal separate):

```bash
cd ~/Documents/Projects/autonex-resource-planning-tool/backend

# Activate virtual environment
# On Windows Git Bash:
source venv/Scripts/activate

# On Windows CMD:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate

# Install backend dependencies (if needed)
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

**Keep this terminal running!**

---

### Step 11: Start Frontend Server

**In your frontend terminal:**

```bash
cd frontend  # if not already there
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Your browser should open automatically to http://localhost:3000**

---

### Step 12: Test the Integration

1. **Open browser:** http://localhost:3000
2. **Navigate to:** "Create Project" page
3. **Fill in the form:**
   - Project Name: "Test Project"
   - Client: "Test Client"
   - Type: PoC
   - Total Tasks: 100
   - Start Date: Today
   - End Date: 1 month from now
   - Required Expertise: Select some skills
   - Estimated Time per Task: 1.5
   - Weekly Target: 50

4. **Click "Create Project"**

5. **Expected behavior:**
   - ✅ Loading indicator appears
   - ✅ Success message or redirect
   - ✅ No errors in browser console (F12)

6. **Check backend terminal:**
   - Should see: `POST /projects 200 OK` or similar

---

### Step 13: Troubleshooting Common Issues

#### Issue 1: CORS Error in Browser Console

**Error:** `Access to fetch at 'http://localhost:8000/projects' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:** Backend needs CORS configuration.

**Add to backend (FastAPI example):**

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Restart backend** after adding this.

---

#### Issue 2: 404 Not Found

**Error:** `POST http://localhost:8000/projects 404 (Not Found)`

**Solution:** Wrong endpoint path.

**Check:**
1. Backend route definition
2. Frontend API_ENDPOINTS configuration
3. Make sure they match!

---

#### Issue 3: Validation Error 422

**Error:** `POST http://localhost:8000/projects 422 (Unprocessable Entity)`

**Solution:** Data format mismatch.

**Check backend response:**
```json
{
  "detail": [
    {
      "loc": ["body", "required_expertise"],
      "msg": "field required"
    }
  ]
}
```

**Fix:** Ensure frontend sends data in exact format backend expects.

**Example backend model:**
```python
class Project(BaseModel):
    name: str
    client: str
    project_type: str  # Note: might be 'type' or 'project_type'
    required_expertise: List[str]  # Must be array
```

**Frontend must send:**
```javascript
{
  name: "Test",
  client: "Client",
  project_type: "PoC",  // Match backend field name
  required_expertise: ["skill1", "skill2"]  // Array, not string
}
```

---

### Step 14: Verify Data Field Names

**Check backend model fields:**

```bash
cd backend
cat app/models/project.py  # or wherever models are
```

**Common mismatches:**

| Frontend | Backend Might Use |
|----------|-------------------|
| `type` | `project_type` |
| `sla_deadline` | `deadline` |
| `total_tasks` | `task_count` |

**If mismatch found, update `frontend/src/pages/ProjectCreate.jsx`:**

```javascript
// Before API call, transform data:
const projectData = {
  name: formData.name,
  client: formData.client,
  project_type: formData.type,  // ← Transform 'type' to 'project_type'
  total_tasks: parseInt(formData.total_tasks),
  // ... rest of fields
};

await createProject(projectData);
```

---

### Step 15: Push Your Changes

Once everything works:

```bash
# Make sure you're in the repo root
cd ~/Documents/Projects/autonex-resource-planning-tool

# Add all frontend files
git add frontend/

# Commit
git commit -m "Frontend: Integrated Vite React app with Project Creation"

# Push to your branch
git push origin frontend-project-creation
```

---

### Step 16: Create Pull Request (Optional)

1. Go to: https://github.com/mustafaujjainwala51/autonex-resource-planning-tool
2. Click "Pull Requests"
3. Click "New Pull Request"
4. Select:
   - Base: `backend-project-setup`
   - Compare: `frontend-project-creation`
5. Add description
6. Submit

---

## 🎯 Key Differences from Instructions

| Instruction Says | What We Did Instead | Why Better |
|-----------------|---------------------|------------|
| Use Create React App | Used existing Vite app | Faster, modern, already built |
| Create new form | Use existing form | Already has all features |
| Basic structure | Modular architecture | Scalable, maintainable |
| Manual axios | API service layer | Cleaner, reusable |

---

## 📁 Final Project Structure

```
autonex-resource-planning-tool/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   │   └── project.py
│   │   └── routes/
│   │       └── projects.py
│   ├── venv/
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── config.js          ← Updated API URL
    │   │   └── projects.js
    │   ├── components/
    │   ├── pages/
    │   │   └── ProjectCreate.jsx  ← Main form
    │   ├── hooks/
    │   ├── utils/
    │   └── App.jsx
    ├── package.json
    └── vite.config.js              ← Fixed process error
```

---

## ✅ Success Checklist

- [ ] Backend repository cloned
- [ ] Backend branch checked out
- [ ] Frontend branch created
- [ ] Frontend code integrated
- [ ] API URL updated in config.js
- [ ] npm install successful
- [ ] Backend server running (port 8000)
- [ ] Frontend server running (port 3000)
- [ ] CORS configured in backend
- [ ] Test project created successfully
- [ ] No errors in browser console
- [ ] Changes committed and pushed

---

## 🆘 Need Help?

### Check Backend Logs
```bash
# Backend terminal should show:
POST /projects 200 OK
```

### Check Frontend Console
```bash
# Press F12 in browser
# Look for:
- Network tab: Should show POST request to /projects with 200 status
- Console tab: Should have no red errors
```

### Test API Directly
```bash
# Use curl to test backend directly:
curl -X POST http://localhost:8000/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "client": "Test Client",
    "project_type": "PoC",
    "required_expertise": ["robotics"],
    "start_date": "2025-02-01",
    "end_date": "2025-03-01"
  }'
```

If this works, backend is fine. Problem is in frontend.
If this fails, backend needs fixing.

---

## 🎓 What You Learned

1. ✅ How to integrate frontend and backend in same repo
2. ✅ How to handle CORS issues
3. ✅ How to match API contracts between frontend/backend
4. ✅ How to use Git branches for separate features
5. ✅ How to debug API integration issues

---

**You're ready to integrate!** Follow these steps and you'll have a working full-stack application.
