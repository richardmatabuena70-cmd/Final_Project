<<<<<<< HEAD
# Math Quiz Application - Database Setup Guide

## What I've Set Up

✅ **Node.js Backend Server** (server.js) - Handles authentication & quiz data  
✅ **MySQL Database** (database.sql) - Stores users & quiz scores  
✅ **API Client** (js/api.js) - Connects frontend to backend  
✅ **Updated Login/Register** - Now uses the database  

---

## Setup Instructions

### Step 1: Install MySQL
Download and install MySQL from: https://www.mysql.com/downloads/

During setup, create a root user with password (or leave blank if you prefer)

### Step 2: Create the Database
Open MySQL Command Line or MySQL Workbench and run the SQL commands from `database.sql`:

```bash
mysql -u root
```

Then paste the contents of `database.sql` and press Enter.

### Step 3: Install Node.js Dependencies
In your project folder, open PowerShell and run:

```bash
npm install
```

### Step 4: Configure Database Credentials
Edit the `.env` file and update:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=math_quiz
```

### Step 5: Start the Server
Run in PowerShell:

```bash
npm start
```

You should see: `Server running on http://localhost:5000`

### Step 6: Open Your App
Visit: `http://localhost:5000`

---

## Available API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/register` | Create new account |
| POST | `/api/login` | Login user |
| GET | `/api/quizzes` | Get all quizzes |
| POST | `/api/save-score` | Save quiz score |
| GET | `/api/scores/:userId` | Get user's scores |

---

## How It Works

1. **User registers** → Password hashed & stored in `users` table
2. **User logs in** → Server verifies & returns JWT token
3. **Token stored** → Saved in localStorage for future requests
4. **Quiz completed** → Score saved in `quiz_scores` table

---

## Next Steps (Optional)

- Add more quiz questions to the `quizzes` table
- Customize the frontend to display data from the database
- Add leaderboard or user profiles
- Set up HTTPS for production

---

## Troubleshooting

**"Connection refused"?**
- Make sure MySQL is running
- Check your DB credentials in `.env`

**"Port 5000 already in use"?**
- Change PORT in `.env` to another number (e.g., 5001)

**"CORS error"?**
- Make sure you're accessing via `http://localhost:5000`, not `file://`
=======
# Math Quiz Application - Database Setup Guide

## What I've Set Up

✅ **Node.js Backend Server** (server.js) - Handles authentication & quiz data  
✅ **MySQL Database** (database.sql) - Stores users & quiz scores  
✅ **API Client** (js/api.js) - Connects frontend to backend  
✅ **Updated Login/Register** - Now uses the database  

---

## Setup Instructions

### Step 1: Install MySQL
Download and install MySQL from: https://www.mysql.com/downloads/

During setup, create a root user with password (or leave blank if you prefer)

### Step 2: Create the Database
Open MySQL Command Line or MySQL Workbench and run the SQL commands from `database.sql`:

```bash
mysql -u root
```

Then paste the contents of `database.sql` and press Enter.

### Step 3: Install Node.js Dependencies
In your project folder, open PowerShell and run:

```bash
npm install
```

### Step 4: Configure Database Credentials
Edit the `.env` file and update:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=math_quiz
```

### Step 5: Start the Server
Run in PowerShell:

```bash
npm start
```

You should see: `Server running on http://localhost:5000`

### Step 6: Open Your App
Visit: `http://localhost:5000`

---

## Available API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/register` | Create new account |
| POST | `/api/login` | Login user |
| GET | `/api/quizzes` | Get all quizzes |
| POST | `/api/save-score` | Save quiz score |
| GET | `/api/scores/:userId` | Get user's scores |

---

## How It Works

1. **User registers** → Password hashed & stored in `users` table
2. **User logs in** → Server verifies & returns JWT token
3. **Token stored** → Saved in localStorage for future requests
4. **Quiz completed** → Score saved in `quiz_scores` table

---

## Next Steps (Optional)

- Add more quiz questions to the `quizzes` table
- Customize the frontend to display data from the database
- Add leaderboard or user profiles
- Set up HTTPS for production

---

## Troubleshooting

**"Connection refused"?**
- Make sure MySQL is running
- Check your DB credentials in `.env`

**"Port 5000 already in use"?**
- Change PORT in `.env` to another number (e.g., 5001)

**"CORS error"?**
- Make sure you're accessing via `http://localhost:5000`, not `file://`
>>>>>>> a10d6143e0bfcf74ae470e4c478d2b3c2d1e4d5f
