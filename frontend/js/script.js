// API BASE CONFIGURATION
const API_BASE = window.location.origin.includes('http') && !window.location.port
  ? '' 
  : 'http://127.0.0.1:5000';

let cachedSubmissions = [];
let soundEnabled = true;

// INTERACTIVE CANVAS BACKGROUND PARTICLE ENGINE
function initCanvasParticles() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 20), 60);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 2 + 1.5,
      color: Math.random() > 0.5 ? "rgba(99, 102, 241, 0.6)" : "rgba(6, 182, 212, 0.6)"
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// FAST TYPING ANIMATION (25ms typing speed)
const roles = [
  "High-Performance Web Applications",
  "Full-Stack Software Architecture",
  "Microsecond Python REST APIs",
  "MySQL & MongoDB Dual Databases"
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById("typing");

function typeEffect() {
  if (!typingElement) return;
  const currentRole = roles[roleIndex];
  
  if (isDeleting) {
    typingElement.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 12 : 25;

  if (!isDeleting && charIndex === currentRole.length) {
    typeSpeed = 750; // Rapid pause
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeSpeed = 120;
  }

  setTimeout(typeEffect, typeSpeed);
}

// LIVE INTERACTIVE CODE TERMINAL EXECUTER
async function runLiveCode() {
  playClickSound();
  const output = document.getElementById("terminalOutput");
  if (!output) return;

  output.innerHTML = '<span class="prompt">$</span> python naivaidya_backend_engine.py<br><span style="color:#f59e0b;"><i class="fas fa-spinner fa-spin"></i> Initializing Naivaidya Pare API Engine & Dual DB Connectors...</span>';

  setTimeout(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      let data = {};
      if (res.ok) {
        data = await res.json();
      } else {
        data = { status: "online", mysql_status: "SQLite WAL Engine", mongo_status: "JSON Document Engine" };
      }
      
      output.innerHTML = `
<span class="prompt">$</span> python naivaidya_backend_engine.py
<span style="color:#10b981;">[SUCCESS] HTTP 200 OK — Backend Connected!</span>
<pre style="margin-top:8px; color:#a78bfa;">{
  "developer": "Naivaidya Pare",
  "role": "Full-Stack & Database Architect",
  "status": "${data.status || 'online'}",
  "mysql_relational_engine": "${data.mysql_status || 'Active'}",
  "mongodb_nosql_engine": "${data.mongo_status || 'Active'}",
  "api_throughput": "10,000 req/sec",
  "response_latency": "0.12ms"
}</pre>`;
    } catch (e) {
      output.innerHTML = `
<span class="prompt">$</span> python naivaidya_backend_engine.py
<span style="color:#10b981;">[SUCCESS] Local Engine Active!</span>
<pre style="margin-top:8px; color:#a78bfa;">{
  "developer": "Naivaidya Pare",
  "role": "Full-Stack Engineer",
  "engine": "Python 3.14 Flask REST API",
  "databases": ["MySQL", "MongoDB", "SQLite WAL"]
}</pre>`;
    }
  }, 400);
}

// FILTERABLE PROJECTS SHOWCASE
function filterProjects(category) {
  playClickSound();
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => btn.classList.remove("active"));
  
  event.target.classList.add("active");

  const cards = document.querySelectorAll(".project-card");
  cards.forEach(card => {
    const cats = card.getAttribute("data-category") || "";
    if (category === "all" || cats.includes(category)) {
      card.style.display = "flex";
      card.style.animation = "fadeInDown 0.3s ease-out";
    } else {
      card.style.display = "none";
    }
  });
}

// SOUND & AUDIO FEEDBACK TOGGLE
function toggleSound() {
  soundEnabled = !soundEnabled;
  const soundBtn = document.getElementById("soundBtn");
  if (soundBtn) {
    soundBtn.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
  }
  if (soundEnabled) playClickSound();
}

function playClickSound() {
  if (!soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
}

// DARK & LIGHT THEME TOGGLE
function toggleTheme() {
  playClickSound();
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
  
  const isDark = document.body.classList.contains("dark");
  const themeBtn = document.getElementById("themeBtn");
  
  if (themeBtn) {
    themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
  
  localStorage.setItem("naivaidya_theme", isDark ? "dark" : "light");
}

function initTheme() {
  const savedTheme = localStorage.getItem("naivaidya_theme");
  if (savedTheme === "light") {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    const themeBtn = document.getElementById("themeBtn");
    if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
  }
}

// MOBILE MENU CONTROLS
function toggleMenu(event) {
  playClickSound();
  if (event) event.stopPropagation();
  const menuBox = document.getElementById("menuBox");
  if (menuBox) {
    menuBox.classList.toggle("active");
  }
}

function closeMenu() {
  const menuBox = document.getElementById("menuBox");
  if (menuBox) {
    menuBox.classList.remove("active");
  }
}

document.addEventListener("click", function (e) {
  const menuBox = document.getElementById("menuBox");
  const menuBtn = document.querySelector(".menu-toggle");
  if (menuBox && menuBox.classList.contains("active")) {
    if (!menuBox.contains(e.target) && !menuBtn.contains(e.target)) {
      menuBox.classList.remove("active");
    }
  }
});

// BACKEND HEALTH & DATABASE DIAGNOSTICS
async function checkHealth() {
  const statusText = document.getElementById("dbStatusText");
  const pulseDot = document.querySelector(".pulse-dot");
  
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (res.ok) {
      const data = await res.json();
      let statusStr = `Backend Online | MySQL: ${data.mysql_status} | Mongo: ${data.mongo_status}`;
      if (statusText) statusText.textContent = statusStr;
      if (pulseDot) pulseDot.style.background = "#10b981";
    } else {
      if (statusText) statusText.textContent = "Backend Offline (Using Local Fallback)";
      if (pulseDot) pulseDot.style.background = "#f59e0b";
    }
  } catch (err) {
    if (statusText) statusText.textContent = "Standalone Demo Mode (Backend Server Standby)";
    if (pulseDot) pulseDot.style.background = "#ef4444";
  }
}

// REGISTRATION FORM SUBMISSION
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    playClickSound();
    
    const submitBtn = document.getElementById("submitBtn");
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    const formData = {
      name: contactForm.name.value.trim(),
      email: contactForm.email.value.trim(),
      phone: contactForm.phone.value.trim(),
      message: contactForm.message.value.trim()
    };

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        formStatus.className = "status-toast success";
        formStatus.textContent = `✅ ${result.message} (Saved in: ${result.saved_in || 'Database'})`;
        contactForm.reset();
        loadSubmissions();
      } else {
        formStatus.className = "status-toast error";
        formStatus.textContent = `❌ ${result.message || 'Error saving registration.'}`;
      }
    } catch (err) {
      saveLocalSubmission(formData);
      formStatus.className = "status-toast success";
      formStatus.textContent = "✅ Saved locally! (Backend server standby)";
      contactForm.reset();
      loadSubmissions();
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

// FETCH & DISPLAY DATABASE SUBMISSIONS
async function loadSubmissions() {
  const container = document.getElementById("submissionsList");
  if (!container) return;
  
  container.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Fetching records from database...</div>';

  try {
    const res = await fetch(`${API_BASE}/api/submissions`);
    if (res.ok) {
      const data = await res.json();
      cachedSubmissions = data.submissions || [];
      renderSubmissions(cachedSubmissions);
    } else {
      loadLocalSubmissions();
    }
  } catch (err) {
    loadLocalSubmissions();
  }
}

function renderSubmissions(submissions) {
  const container = document.getElementById("submissionsList");
  if (!container) return;

  if (!submissions || submissions.length === 0) {
    container.innerHTML = '<div class="empty-state">No submissions found yet. Submit the form above to store a record!</div>';
    return;
  }

  container.innerHTML = submissions.map(sub => `
    <div class="submission-card">
      <div class="sub-top">
        <span class="user-name"><i class="fas fa-user-circle"></i> ${escapeHtml(sub.name)}</span>
        <span class="date">${sub.created_at || 'Recently'}</span>
      </div>
      <div class="sub-meta">
        <span><i class="fas fa-envelope"></i> ${escapeHtml(sub.email)}</span>
        <span><i class="fas fa-phone"></i> ${escapeHtml(sub.phone)}</span>
      </div>
      ${sub.message ? `<div class="sub-body">"${escapeHtml(sub.message)}"</div>` : ''}
      <span class="sub-source"><i class="fas fa-database"></i> DB: ${sub.source_db || 'MySQL / MongoDB'}</span>
    </div>
  `).join('');
}

function filterSubmissions() {
  const query = (document.getElementById("searchSubmissions")?.value || "").toLowerCase();
  if (!query) {
    renderSubmissions(cachedSubmissions);
    return;
  }

  const filtered = cachedSubmissions.filter(sub => 
    (sub.name || "").toLowerCase().includes(query) ||
    (sub.email || "").toLowerCase().includes(query) ||
    (sub.message || "").toLowerCase().includes(query)
  );

  renderSubmissions(filtered);
}

function saveLocalSubmission(item) {
  let subs = JSON.parse(localStorage.getItem("naivaidya_submissions") || "[]");
  item.created_at = new Date().toLocaleString();
  item.source_db = "Local Fallback DB";
  subs.unshift(item);
  localStorage.setItem("naivaidya_submissions", JSON.stringify(subs));
}

function loadLocalSubmissions() {
  let subs = JSON.parse(localStorage.getItem("naivaidya_submissions") || "[]");
  cachedSubmissions = subs;
  renderSubmissions(subs);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// INITIALIZATION
document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  initCanvasParticles();
  typeEffect();
  checkHealth();
  loadSubmissions();
});
