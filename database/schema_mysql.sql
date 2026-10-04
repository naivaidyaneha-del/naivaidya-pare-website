-- MySQL Database Schema for Naivaidya Pare Website
CREATE DATABASE IF NOT EXISTS naivaidya_db;
USE naivaidya_db;

-- Table: registrations (Stores form submissions)
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: skills (Stores dynamic tech stack)
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(50) NOT NULL,
    icon_url VARCHAR(255),
    category VARCHAR(50) DEFAULT 'General'
);

-- Insert Sample Initial Skills
INSERT INTO skills (skill_name, icon_url, category) VALUES
('HTML', 'https://cdn-icons-png.flaticon.com/512/732/732212.png', 'Frontend'),
('CSS', 'https://cdn-icons-png.flaticon.com/512/732/732190.png', 'Frontend'),
('JavaScript', 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png', 'Frontend'),
('Python', 'https://cdn-icons-png.flaticon.com/512/5968/5968350.png', 'Backend'),
('Java', 'https://cdn-icons-png.flaticon.com/512/226/226777.png', 'Backend'),
('PHP', 'https://cdn-icons-png.flaticon.com/512/919/919828.png', 'Backend'),
('MySQL', 'https://cdn-icons-png.flaticon.com/512/919/919836.png', 'Database'),
('MongoDB', 'https://cdn-icons-png.flaticon.com/512/5968/5968313.png', 'Database')
ON DUPLICATE KEY UPDATE skill_name=VALUES(skill_name);
