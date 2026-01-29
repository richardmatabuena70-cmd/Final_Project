-- Create Database
CREATE DATABASE IF NOT EXISTS math_quiz;
USE math_quiz;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  total_questions INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Scores Table
CREATE TABLE IF NOT EXISTS quiz_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  quiz_id INT NOT NULL,
  score INT NOT NULL,
  total_questions INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

-- Sample Quizzes
INSERT INTO quizzes (title, description, total_questions) VALUES
('Basic Math', 'Test your basic arithmetic skills', 10),
('Algebra', 'Challenge your algebra knowledge', 15),
('Geometry', 'Explore geometric concepts', 12);
