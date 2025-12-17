# Troubleshooting Decision Tree

## 🔍 Start Here: What's Your Error?

---

## ❌ Error Category 1: CORS Errors

**Symptoms:**
- Browser console shows: "blocked by CORS policy"
- Network tab shows request status: `(failed) net::ERR_FAILED`

**Solution Path:**

```
1. Is CORS middleware added to backend?
   NO → Go to backend/app/main.py
        Add CORS middleware (see MANUAL_STEPS.md Step 6)
        Restart backend server
   YES → Continue to 2

2. Is frontend URL correct in CORS config?
   Check: allow_origins=["http://localhost:3000"]
   NO → Fix the URL
        Restart backend
   YES → Continue to 3

3. Clear browser cache
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or try incognito/private window
   
Still broken? → Check backend console for actual port number
```

---

## ❌ Error Category 2: 404 Not Found

**Symptoms:**
- Console shows: `POST http://localhost:8000/projects 404`
- Backend terminal shows: `GET /projects 404`

**Solution Path:**

```
1. What endpoint does backend actually use?
   
   Check: backend/app/routes/projects.py or app/main.py
   
   Found: @app.post("/api/projects")
   → Fix: frontend/src/api/config.js
         export const API_BASE_URL = 'http://localhost:8000/api';
   
   Found: @app.post("/projects")
   → Fix: frontend/src/api/config.js
         export const API_BASE_URL = 'http://localhost:8000';

2. Restart frontend server
   Ctrl+C in frontend terminal
   npm run dev

3. Test again
```

---

## ❌ Error Category 3: 422 Validation Error

**Symptoms:**
- Console shows: `POST http://localhost:8000/projects 422`
- Response shows field errors

**Solution Path:**

```
1. Open browser console → Network tab
   Click the failed request
   Click "Preview" or "Response" tab
   
   Example error:
   {
     "detail": [
       {
         "loc": ["body", "project_type"],
         "msg": "field required"
       }
     ]
   }

2. Identify the problematic field
   In example above: "project_type"

3. Check what frontend sends
   Frontend field name: "type"
   Backend expects: "project_type"
   → MISMATCH!

4. Fix the mismatch

   Option A - Change Backend (if you control it):
   class Project(BaseModel):
       type: str  # Change from project_type

   Option B - Transform in Frontend:
   In ProjectCreate.jsx, before API call:
   
   const apiData = {
     ...formData,
     project_type: formData.type  // Transform
   };
   delete apiData.type;  // Remove old field
   await createProject(apiData);

5. Restart affected server and test
```

---

## ❌ Error Category 4: Connection Refused

**Symptoms:**
- Console shows: `Failed to fetch` or `ERR_CONNECTION_REFUSED`
- Can't reach http://localhost:8000

**Solution Path:**

```
1. Is backend server running?
   
   Check Terminal 1 (backend terminal)
   Should see: "Uvicorn running on http://127.0.0.1:8000"
   
   NO → Start it:
        cd backend
        source venv/Scripts/activate  # Windows Git Bash
        uvicorn app.main:app --reload
   
   YES → Continue to 2

2. Is backend on correct port?
   
   Backend might be on: 8000, 8080, 5000
   Check backend terminal output
   
   Update frontend/src/api/config.js:
   export const API_BASE_URL = 'http://localhost:CORRECT_PORT';

3. Firewall blocking?
   
   Windows: Turn off Windows Defender Firewall temporarily
   Mac: System Preferences → Security → Firewall → Off
   
   Test again
   Turn firewall back on after confirming

4. Try 127.0.0.1 instead of localhost
   
   export const API_BASE_URL = 'http://127.0.0.1:8000';
```

---

## ❌ Error Category 5: Process is not defined

**Symptoms:**
- Console shows: "Uncaught ReferenceError: process is not defined"
- App won't load

**Solution Path:**

```
1. Check vite.config.js has:
   
   define: {
     'process.env': {},
     global: {}
   }
   
   NO → Add it and restart
   YES → Continue to 2

2. Clear Vite cache
   
   cd frontend
   rm -rf node_modules/.vite
   npm run dev -- --force

3. Still broken?
   
   Nuclear option:
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
```

---

## ❌ Error Category 6: Module Not Found

**Symptoms:**
- Console shows: "Cannot find module './api/config'"
- Import errors

**Solution Path:**

```
1. Check file exists
   
   ls frontend/src/api/config.js
   
   NO → File missing! Re-extract frontend
   YES → Continue to 2

2. Check import path
   
   In error, find the import line:
   import { API_BASE_URL } from './api/config';
   
   Correct relative path?
   - From src/pages/: '../api/config'
   - From src/: './api/config'

3. Case sensitivity
   
   File is: config.js
   Import says: Config.js
   → Fix capitalization

4. Restart dev server
   
   Ctrl+C
   npm run dev
```

---

## ❌ Error Category 7: Git Push Failed

**Symptoms:**
- `git push` shows: "failed to push"
- Permission denied

**Solution Path:**

```
1. Are you on the right branch?
   
   git branch
   Should show: * frontend-project-creation
   
   NO → git checkout frontend-project-creation
   YES → Continue to 2

2. Branch exists on remote?
   
   First push needs:
   git push -u origin frontend-project-creation
   
   After that:
   git push

3. Authentication issue?
   
   Using HTTPS?
   → Set up Personal Access Token
     GitHub → Settings → Developer Settings → PAT
     Use PAT as password when prompted
   
   Using SSH?
   → Set up SSH key
     ssh-keygen
     Add ~/.ssh/id_rsa.pub to GitHub

4. Permission denied?
   
   You might not have write access
   → Ask repo owner to add you as collaborator
```

---

## ❌ Error Category 8: Data Not Showing

**Symptoms:**
- Project created successfully
- But doesn't appear in project list
- Backend shows 200 OK

**Solution Path:**

```
1. Was state updated?
   
   Check useProjects hook:
   After createProject(), does it update local state?
   
   Should have:
   setProjects(prev => [...prev, newProject]);

2. Did API return the created project?
   
   Network tab → Check response
   Should return full project object with ID
   
   NO → Backend needs to return created project
   YES → Continue to 3

3. Refresh the page
   
   F5 or Cmd+R
   Does project appear now?
   
   YES → Frontend state issue
   NO → Database issue

4. Check backend database
   
   Does project exist in database?
   
   SQLite: sqlite3 database.db "SELECT * FROM projects;"
   PostgreSQL: psql -d dbname -c "SELECT * FROM projects;"
   
   NO → Backend not saving
   YES → Backend not returning correctly
```

---

## ✅ Success Verification Checklist

Everything should be:

```
1. Backend Terminal:
   ✅ Shows: "Uvicorn running on http://127.0.0.1:8000"
   ✅ No red error messages
   ✅ When you submit: Shows "POST /projects 200 OK"

2. Frontend Terminal:
   ✅ Shows: "Local: http://localhost:3000"
   ✅ No red error messages
   ✅ No warnings about CORS

3. Browser (http://localhost:3000):
   ✅ App loads without errors
   ✅ Can navigate to "Create Project"
   ✅ Form appears correctly
   ✅ All fields are editable

4. Browser Console (F12):
   ✅ No red errors
   ✅ Network tab shows POST to /projects with 200 status
   ✅ Response contains created project data

5. After Submission:
   ✅ Loading indicator appears
   ✅ Success message or redirect
   ✅ Project appears in projects list
```

---

## 🆘 Still Stuck?

### Nuclear Options (Last Resort)

**Option 1: Complete Backend Reset**
```bash
cd backend
rm -rf venv
python -m venv venv
source venv/Scripts/activate  # Windows Git Bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Option 2: Complete Frontend Reset**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Option 3: Start Over**
```bash
cd ..
rm -rf autonex-resource-planning-tool
# Re-do all steps from MANUAL_STEPS.md
```

---

## 📝 Debug Information Gathering

When asking for help, provide:

```bash
# 1. Backend info
cd backend
python --version
pip list | grep fastapi
cat app/main.py  # Show route definition

# 2. Frontend info
cd frontend
node --version
npm --version
cat src/api/config.js  # Show API config

# 3. Error message
# Full error from browser console

# 4. Network request
# Screenshot of Network tab showing the failed request

# 5. Backend response
# Response body from the failed request
```

---

**Remember:** Most integration issues are field name mismatches or CORS!
