<<<<<<< HEAD
# 🚀 Quick Setup Guide

## Your Code Status:
✅ **Unchanged**: quiz.js, dashboard.js, all CSS files  
✅ **Updated**: script.js (login/register only)  
✅ **New Files**: server.js, api.js, database.sql, package.json  

---

## Step-by-Step Setup (Copy & Paste)

### **Step 1: Install MySQL** (5 minutes)
👉 Download: https://www.mysql.com/downloads/  
Choose "MySQL Community Server"

### **Step 2: Create Database**
Open PowerShell in your project folder and run:
```bash
mysql -u root -p < database.sql
```
(Press Enter if no password, or type your password)

### **Step 3: Install Node.js** (if not installed)
Download: https://nodejs.org (LTS version)

### **Step 4: Install Dependencies**
In PowerShell, run:
```bash
npm install
```

### **Step 5: Update .env File**
Edit `.env` and set your MySQL password:
```
DB_PASSWORD=your_mysql_password_here
```

### **Step 6: Start the Server**
```bash
npm start
```

You should see: ✅ `Server running on http://localhost:5000`

### **Step 7: Open Your App**
Visit: **http://localhost:5000**
(NOT file://)

---

## What's Working Now:

| Feature | Status |
|---------|--------|
| Register | ✅ Saves to database |
| Login | ✅ Uses database auth |
| Quiz Play | ✅ Works (local storage + database) |
| Save Scores | ✅ Saves to database |
| Dashboard | ✅ Can load from database |

---

## Troubleshooting

**Error: "Connection refused"**
→ MySQL not running. Start MySQL server.

**Error: "Port 5000 already in use"**
→ Change PORT in `.env` (e.g., 5001)

**Still Getting Errors?**
→ Run this to check MySQL:
```bash
mysql -u root -p
```

---

## Next Steps (Optional)
- Add more quizzes to database
- Show leaderboard from all users
- Add user profile page
- Save quiz answers to database (advanced)
=======
# 🚀 Quick Setup Guide

## Your Code Status:
✅ **Unchanged**: quiz.js, dashboard.js, all CSS files  
✅ **Updated**: script.js (login/register only)  
✅ **New Files**: server.js, api.js, database.sql, package.json  

---

## Step-by-Step Setup (Copy & Paste)

### **Step 1: Install MySQL** (5 minutes)
👉 Download: https://www.mysql.com/downloads/  
Choose "MySQL Community Server"

### **Step 2: Create Database**
Open PowerShell in your project folder and run:
```bash
mysql -u root -p < database.sql
```
(Press Enter if no password, or type your password)

### **Step 3: Install Node.js** (if not installed)
Download: https://nodejs.org (LTS version)

### **Step 4: Install Dependencies**
In PowerShell, run:
```bash
npm install
```

### **Step 5: Update .env File**
Edit `.env` and set your MySQL password:
```
DB_PASSWORD=your_mysql_password_here
```

### **Step 6: Start the Server**
```bash
npm start
```

You should see: ✅ `Server running on http://localhost:5000`

### **Step 7: Open Your App**
Visit: **http://localhost:5000**
(NOT file://)

---

## What's Working Now:

| Feature | Status |
|---------|--------|
| Register | ✅ Saves to database |
| Login | ✅ Uses database auth |
| Quiz Play | ✅ Works (local storage + database) |
| Save Scores | ✅ Saves to database |
| Dashboard | ✅ Can load from database |

---

## Troubleshooting

**Error: "Connection refused"**
→ MySQL not running. Start MySQL server.

**Error: "Port 5000 already in use"**
→ Change PORT in `.env` (e.g., 5001)

**Still Getting Errors?**
→ Run this to check MySQL:
```bash
mysql -u root -p
```

---

## Next Steps (Optional)
- Add more quizzes to database
- Show leaderboard from all users
- Add user profile page
- Save quiz answers to database (advanced)
>>>>>>> a10d6143e0bfcf74ae470e4c478d2b3c2d1e4d5f
