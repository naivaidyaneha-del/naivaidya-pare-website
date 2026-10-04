// MongoDB Initialization Script for Naivaidya Pare Website
use naivaidya_db;

// Create registrations collection
db.createCollection("registrations");

// Create skills collection
db.createCollection("skills");

// Seed initial skill documents
db.skills.insertMany([
  { skill_name: "HTML", category: "Frontend", icon_url: "https://cdn-icons-png.flaticon.com/512/732/732212.png" },
  { skill_name: "CSS", category: "Frontend", icon_url: "https://cdn-icons-png.flaticon.com/512/732/732190.png" },
  { skill_name: "JavaScript", category: "Frontend", icon_url: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png" },
  { skill_name: "Python", category: "Backend", icon_url: "https://cdn-icons-png.flaticon.com/512/5968/5968350.png" },
  { skill_name: "Java", category: "Backend", icon_url: "https://cdn-icons-png.flaticon.com/512/226/226777.png" },
  { skill_name: "PHP", category: "Backend", icon_url: "https://cdn-icons-png.flaticon.com/512/919/919828.png" },
  { skill_name: "MySQL", category: "Database", icon_url: "https://cdn-icons-png.flaticon.com/512/919/919836.png" },
  { skill_name: "MongoDB", category: "Database", icon_url: "https://cdn-icons-png.flaticon.com/512/5968/5968313.png" }
]);

print("Naivaidya Pare MongoDB Database Initialized!");
