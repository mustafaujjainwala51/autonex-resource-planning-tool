# Quick Reference: Manual Steps You Need to Do

## 🎯 Your Action Items (In Order)

### 1️⃣ Clone and Setup Repository (5 minutes)

```bash
# Open terminal and run these commands:
cd ~/Documents/Projects  # or your projects folder
git clone https://github.com/mustafaujjainwala51/autonex-resource-planning-tool.git
cd autonex-resource-planning-tool
git fetch
git checkout backend-project-setup
git checkout -b frontend-project-creation
```

**What this does:** Gets the backend code and creates your work branch.

---

### 2️⃣ Integrate Frontend (10 minutes)

**Download & Extract:**
1. Download `autonex-frontend-v2.zip` (the file I provided)
2. Extract it on your computer
3. Rename extracted folder from `autonex-frontend` → `frontend`

**Move to Repository:**
```bash
# Move the 'frontend' folder into autonex-resource-planning-tool/
# Final structure:
# autonex-resource-planning-tool/
#   ├── backend/
#   └── frontend/  ← Your renamed folder goes here
```

---

### 3️⃣ Check Backend API Endpoint (2 minutes)

**Find the actual endpoint path:**

```bash
cd backend
# Look for the route definition
cat app/routes/projects.py  # or app/main.py
```

**You're looking for something like:**
```python
@app.post("/projects")  # ← This is the path
# OR
@app.post("/api/projects")  # ← This would be the path
```

**Write down:** Is it `/projects` or `/api/projects`?

---

### 4️⃣ Update Frontend Configuration (3 minutes)

**Open:** `frontend/src/api/config.js`

**Scenario A - Backend uses `/projects`:**
```javascript
export const API_BASE_URL = 'http://localhost:8000';
// No change needed to ENDPOINTS (they already use /projects)
```

**Scenario B - Backend uses `/api/projects`:**
```javascript
export const API_BASE_URL = 'http://localhost:8000/api';
// No change needed to ENDPOINTS (they use /projects which becomes /api/projects)
```

---

### 5️⃣ Check Backend Field Names (5 minutes)

**Open:** `backend/app/models/project.py` (or wherever the model is)

**Look for the Project model:**
```python
class Project(BaseModel):
    name: str
    client: str
    project_type: str  # ← Note this exact field name
    total_tasks: int
    # ... etc
```

**Compare with frontend field names:**
- Frontend uses `type` → Backend might use `project_type`
- Frontend uses `sla_deadline` → Backend might use `deadline`

**If mismatch found, fix it in one place:**

**Option A - Fix in Backend (Recommended if you control it):**
```python
# Make backend match frontend
class Project(BaseModel):
    type: str  # Changed from project_type
```

**Option B - Fix in Frontend:**

Open `frontend/src/pages/ProjectCreate.jsx`

Find the `handleSubmit` function and add transformation:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Transform data to match backend
  const projectData = {
    name: formData.name,
    client: formData.client,
    project_type: formData.type,  // ← Transform 'type' to 'project_type'
    total_tasks: parseInt(formData.total_tasks),
    sla_deadline: formData.sla_deadline,
    required_expertise: formData.required_expertise,
    estimated_time_per_task: parseFloat(formData.estimated_time_per_task),
    weekly_target: parseInt(formData.weekly_target),
    start_date: formData.start_date,
    end_date: formData.end_date
  };

  await createProject(projectData);
};
```

---

### 6️⃣ Add CORS to Backend (5 minutes)

**Open:** `backend/app/main.py`

**Add this code** (near the top, after imports):

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware - PUT THIS BEFORE ROUTES
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... rest of your code
```

**Save the file.**

---

### 7️⃣ Install and Run Everything (5 minutes)

**Terminal 1 - Backend:**
```bash
cd backend

# Activate virtual environment
# Windows Git Bash:
source venv/Scripts/activate
# Windows CMD:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies (if not done)
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload
```

**Expected:** Should say "Uvicorn running on http://127.0.0.1:8000"

**Keep this terminal open!**

---

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # First time only
npm run dev
```

**Expected:** Should say "Local: http://localhost:3000"

**Browser should open automatically.**

---

### 8️⃣ Test Integration (3 minutes)

1. **Open browser:** http://localhost:3000
2. **Click:** "Create Project" in navigation
3. **Fill form:**
   - Name: "Test Project"
   - Client: "Tesla"
   - Type: PoC
   - Total Tasks: 100
   - Start Date: 2025-02-01
   - End Date: 2025-03-01
   - Required Expertise: Check "robotics"
   - Time per Task: 1.5
   - Weekly Target: 50

4. **Click:** "Create Project & Allocate Manpower"

5. **Success looks like:**
   - ✅ Loading indicator appears briefly
   - ✅ Redirect to allocation page OR success message
   - ✅ No red errors in browser console (press F12)
   - ✅ Backend terminal shows: `POST /projects 200 OK`

---

### 9️⃣ Push Your Work (2 minutes)

**Only after everything works!**

```bash
cd autonex-resource-planning-tool  # repo root

git add frontend/
git commit -m "Frontend: Integrated React app for Project Creation"
git push origin frontend-project-creation
```

---

## 🚨 Common Issues & Quick Fixes

### ❌ CORS Error in Browser

**Error:** "blocked by CORS policy"

**Fix:** Add CORS middleware to backend (Step 6 above)

---

### ❌ 404 Not Found

**Error:** `POST http://localhost:8000/projects 404`

**Fix:** 
1. Check backend route path (Step 3)
2. Update frontend config.js (Step 4)

---

### ❌ 422 Validation Error

**Error:** `POST http://localhost:8000/projects 422`

**Fix:** Field name mismatch! Do Step 5 carefully.

**Debug:**
1. Open browser console (F12)
2. Go to Network tab
3. Find the POST request to /projects
4. Click it → Preview tab
5. See which field is complained about
6. Fix that field name

---

### ❌ Connection Refused

**Error:** `Failed to fetch` or `ERR_CONNECTION_REFUSED`

**Fix:** Backend not running! Check Terminal 1.

---

### ❌ Process is not defined

**Error:** Console shows "process is not defined"

**Fix:** Already fixed in `vite.config.js` - just restart frontend:
```bash
# Stop frontend (Ctrl+C)
npm run dev -- --force
```

---

## ✅ Final Checklist

Mark each as you complete:

- [ ] Repository cloned
- [ ] Frontend integrated into repo
- [ ] Backend API endpoint identified
- [ ] Frontend API config updated
- [ ] Backend field names checked
- [ ] Field name mismatches fixed
- [ ] CORS added to backend
- [ ] Backend dependencies installed
- [ ] Backend server running (port 8000)
- [ ] Frontend dependencies installed
- [ ] Frontend server running (port 3000)
- [ ] Test project created successfully
- [ ] No errors in browser console
- [ ] Backend shows 200 OK response
- [ ] Changes pushed to GitHub

---

## 📞 Getting Help

### Still stuck? Check these in order:

1. **Backend running?**
   ```bash
   curl http://localhost:8000/projects
   # Should NOT say "Connection refused"
   ```

2. **Frontend running?**
   - Browser at http://localhost:3000 should show app

3. **API contract mismatch?**
   - Open browser console (F12)
   - Check Network tab for actual error message

4. **Git issues?**
   ```bash
   git status  # Shows what branch you're on
   git branch  # Lists all branches
   ```

---

## 🎯 Time Estimate

- **If everything goes smoothly:** 30 minutes
- **With troubleshooting:** 1 hour
- **First time doing this:** 1.5 hours

---

**Good luck! You've got this! 🚀**
