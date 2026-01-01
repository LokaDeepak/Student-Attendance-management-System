document.addEventListener("DOMContentLoaded", () => {
  // Load user info from session
  try {
    const user = JSON.parse(sessionStorage.getItem("currentUser") || "null");
    if (user) {
      const nameEl = document.getElementById("accountName");
      const emailEl = document.getElementById("accountEmail");
      const avatarEl = document.getElementById("accountAvatar");
      if (nameEl) nameEl.textContent = user.username || "Student";
      if (emailEl) emailEl.textContent = user.email || "student@gn.edu";
      if (avatarEl) {
        const initials = (user.username || "ST")
          .split(" ")
          .map((s) => s[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
        avatarEl.textContent = initials;
      }
    }
  } catch (err) {
    console.warn("Could not read session user", err);
  }

  // Navigation
  const navBtns = document.querySelectorAll(".nav-btn");
  const views = document.querySelectorAll(".view");
  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      navBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const view = btn.dataset.view;
      views.forEach((v) => (v.style.display = v.id === "view-" + view ? "" : "none"));
    });
  });

  // ============ DUMMY DATA FOR TESTING ============
  const studentInfo = {
    id: "ST001",
    name: "Rahul Sharma",
    email: "rahul.sharma@gn.edu",
    phone: "+91 9876543210",
    department: "BCA",
    year: "2",
    section: "A"
  };

  const subjects = [
    {
      code: "DS",
      name: "Data Structures",
      faculty: "Dr. Priya Mehta",
      present: 14,
      absent: 2,
      total: 16,
      percentage: 87.5
    },
    {
      code: "ALGO",
      name: "Algorithms",
      faculty: "Prof. Amit Kumar",
      present: 13,
      absent: 1,
      total: 14,
      percentage: 92.9
    },
    {
      code: "DBMS",
      name: "Database Management",
      faculty: "Dr. Sneha Patel",
      present: 11,
      absent: 3,
      total: 14,
      percentage: 78.6
    },
    {
      code: "OS",
      name: "Operating Systems",
      faculty: "Prof. Vikram Singh",
      present: 12,
      absent: 2,
      total: 14,
      percentage: 85.7
    },
    {
      code: "CN",
      name: "Computer Networks",
      faculty: "Dr. Anita Reddy",
      present: 10,
      absent: 4,
      total: 14,
      percentage: 71.4
    },
    {
      code: "SE",
      name: "Software Engineering",
      faculty: "Prof. Rajesh Gupta",
      present: 8,
      absent: 0,
      total: 8,
      percentage: 100
    }
  ];

  const announcements = [
    {
      title: "Mid-Term Exams Schedule",
      message: "Mid-term examinations will be conducted from December 15-20, 2024. Please check the detailed timetable on the notice board.",
      date: "2024-11-01",
      from: "Examination Department"
    },
    {
      title: "Holiday Notice",
      message: "College will remain closed on November 5th due to festival celebrations. Classes will resume on November 6th.",
      date: "2024-10-30",
      from: "Administration"
    },
    {
      title: "Workshop on AI/ML",
      message: "A two-day workshop on Artificial Intelligence and Machine Learning will be held on November 10-11. Interested students can register at the department office.",
      date: "2024-10-28",
      from: "BCA Department"
    },
    {
      title: "Library Hours Extended",
      message: "Library will now be open till 8 PM on weekdays to facilitate exam preparation.",
      date: "2024-10-25",
      from: "Library"
    }
  ];

  const attendanceHistory = [
    { date: "2024-11-01", subject: "DS", subjectName: "Data Structures", faculty: "Dr. Priya Mehta", status: "present" },
    { date: "2024-11-01", subject: "ALGO", subjectName: "Algorithms", faculty: "Prof. Amit Kumar", status: "present" },
    { date: "2024-10-31", subject: "DBMS", subjectName: "Database Management", faculty: "Dr. Sneha Patel", status: "absent" },
    { date: "2024-10-31", subject: "OS", subjectName: "Operating Systems", faculty: "Prof. Vikram Singh", status: "present" },
    { date: "2024-10-30", subject: "CN", subjectName: "Computer Networks", faculty: "Dr. Anita Reddy", status: "absent" },
    { date: "2024-10-30", subject: "SE", subjectName: "Software Engineering", faculty: "Prof. Rajesh Gupta", status: "present" },
    { date: "2024-10-29", subject: "DS", subjectName: "Data Structures", faculty: "Dr. Priya Mehta", status: "present" },
    { date: "2024-10-29", subject: "ALGO", subjectName: "Algorithms", faculty: "Prof. Amit Kumar", status: "present" },
    { date: "2024-10-28", subject: "DBMS", subjectName: "Database Management", faculty: "Dr. Sneha Patel", status: "present" },
    { date: "2024-10-28", subject: "OS", subjectName: "Operating Systems", faculty: "Prof. Vikram Singh", status: "present" },
    { date: "2024-10-25", subject: "CN", subjectName: "Computer Networks", faculty: "Dr. Anita Reddy", status: "absent" },
    { date: "2024-10-25", subject: "SE", subjectName: "Software Engineering", faculty: "Prof. Rajesh Gupta", status: "present" },
    { date: "2024-10-24", subject: "DS", subjectName: "Data Structures", faculty: "Dr. Priya Mehta", status: "present" },
    { date: "2024-10-24", subject: "ALGO", subjectName: "Algorithms", faculty: "Prof. Amit Kumar", status: "present" },
    { date: "2024-10-23", subject: "DBMS", subjectName: "Database Management", faculty: "Dr. Sneha Patel", status: "absent" },
    { date: "2024-10-23", subject: "OS", subjectName: "Operating Systems", faculty: "Prof. Vikram Singh", status: "present" }
  ];

  const myRequests = [
    { date: "2024-10-28", type: "Leave", subject: "Sick Leave", status: "Approved" },
    { date: "2024-10-15", type: "Attendance", subject: "Attendance correction for Oct 10", status: "Pending" },
    { date: "2024-10-05", type: "Technical", subject: "Portal login issue", status: "Resolved" }
  ];

  // Helper functions
  function escapeHtml(s) {
    return String(s || "").replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function getAttendanceBadge(percentage) {
    if (percentage >= 85) return 'good';
    if (percentage >= 75) return 'average';
    return 'poor';
  }

  function getProgressClass(percentage) {
    if (percentage >= 85) return '';
    if (percentage >= 75) return 'warning';
    return 'danger';
  }

  // ============ DASHBOARD VIEW ============
  function renderDashboard() {
    // Calculate overall stats
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalClasses = 0;

    subjects.forEach(sub => {
      totalPresent += sub.present;
      totalAbsent += sub.absent;
      totalClasses += sub.total;
    });

    const overallPercentage = ((totalPresent / totalClasses) * 100).toFixed(1);

    // Update stats
    document.getElementById("overallAttendance").textContent = overallPercentage + "%";
    document.getElementById("classesPresent").textContent = totalPresent;
    document.getElementById("classesAbsent").textContent = totalAbsent;
    document.getElementById("totalSubjects").textContent = subjects.length;

    const progressFill = document.getElementById("overallProgress");
    progressFill.style.width = overallPercentage + "%";
    progressFill.className = "progress-fill " + getProgressClass(parseFloat(overallPercentage));

    // Render subject table
    const tbody = document.querySelector("#dashboardSubjectsTable tbody");
    tbody.innerHTML = "";
    subjects.forEach(sub => {
      const tr = document.createElement("tr");
      const badgeClass = getAttendanceBadge(sub.percentage);
      tr.innerHTML = `
        <td>${escapeHtml(sub.name)}</td>
        <td>${escapeHtml(sub.code)}</td>
        <td>${sub.present}</td>
        <td>${sub.absent}</td>
        <td>${sub.percentage.toFixed(1)}%</td>
        <td><span class="attendance-badge ${badgeClass}">${sub.percentage.toFixed(1)}%</span></td>
      `;
      tbody.appendChild(tr);
    });

    // Render recent announcements
    const annContainer = document.getElementById("recentAnnouncements");
    annContainer.innerHTML = "";
    announcements.slice(0, 3).forEach(ann => {
      const card = document.createElement("div");
      card.className = "announcement-card";
      card.innerHTML = `
        <div class="announcement-header">
          <div class="announcement-title">${escapeHtml(ann.title)}</div>
          <div class="announcement-date">${ann.date}</div>
        </div>
        <div class="announcement-body">${escapeHtml(ann.message)}</div>
      `;
      annContainer.appendChild(card);
    });
  }

  renderDashboard();

  // ============ MY SUBJECTS VIEW ============
  function renderSubjects() {
    const container = document.getElementById("subjectsGrid");
    container.innerHTML = "";

    subjects.forEach(sub => {
      const card = document.createElement("div");
      card.className = "subject-card";
      const badgeClass = getAttendanceBadge(sub.percentage);
      
      card.innerHTML = `
        <div class="subject-header">
          <div>
            <div class="subject-name">${escapeHtml(sub.name)}</div>
            <div class="subject-code">${escapeHtml(sub.code)}</div>
          </div>
          <div class="attendance-badge ${badgeClass}">${sub.percentage.toFixed(1)}%</div>
        </div>
        <div class="subject-info">
          <div style="margin-bottom:8px;"><strong>Faculty:</strong> ${escapeHtml(sub.faculty)}</div>
          <div><strong>Attendance:</strong> ${sub.present}/${sub.total} classes</div>
          <div class="progress-bar">
            <div class="progress-fill ${getProgressClass(sub.percentage)}" style="width: ${sub.percentage}%"></div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  renderSubjects();

  // ============ ATTENDANCE HISTORY VIEW ============
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  function renderCalendar() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    
    document.getElementById("calendarTitle").textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const grid = document.getElementById("calendarGrid");
    grid.innerHTML = "";

    // Add day headers
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    days.forEach(day => {
      const cell = document.createElement("div");
      cell.className = "calendar-day header";
      cell.textContent = day;
      grid.appendChild(cell);
    });

    // Get first day and total days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const cell = document.createElement("div");
      cell.className = "calendar-day";
      grid.appendChild(cell);
    }

    // Days of month
    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement("div");
      cell.className = "calendar-day";
      
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Check attendance for this date
      const dayAttendance = attendanceHistory.filter(a => a.date === dateStr);
      if (dayAttendance.length > 0) {
        const allPresent = dayAttendance.every(a => a.status === "present");
        const allAbsent = dayAttendance.every(a => a.status === "absent");
        
        if (allPresent) {
          cell.classList.add("present");
        } else if (allAbsent) {
          cell.classList.add("absent");
        } else {
          cell.classList.add("present"); // Mixed - show as present
        }
      }

      // Mark today
      if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
        cell.classList.add("today");
      }

      cell.textContent = day;
      grid.appendChild(cell);
    }
  }

  function renderAttendanceHistory() {
    const tbody = document.querySelector("#attendanceHistoryTable tbody");
    tbody.innerHTML = "";

    // Sort by date descending
    const sorted = [...attendanceHistory].sort((a, b) => new Date(b.date) - new Date(a.date));

    sorted.forEach(record => {
      const tr = document.createElement("tr");
      const statusBadge = record.status === "present" 
        ? '<span class="attendance-badge good">Present</span>'
        : '<span class="attendance-badge poor">Absent</span>';
      
      tr.innerHTML = `
        <td>${record.date}</td>
        <td>${escapeHtml(record.subjectName)} (${escapeHtml(record.subject)})</td>
        <td>${escapeHtml(record.faculty)}</td>
        <td>${statusBadge}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderCalendar();
  renderAttendanceHistory();

  // Calendar navigation
  document.getElementById("prevMonth").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  document.getElementById("nextMonth").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  // Filter functionality
  document.getElementById("applyFilter").addEventListener("click", () => {
    const selectedSubject = document.getElementById("filterSubject").value;
    const selectedMonth = document.getElementById("filterMonth").value;
    
    // This would filter the attendance history
    // For now, just show an alert
    alert(`Filtering by: Subject=${selectedSubject}, Month=${selectedMonth}`);
    // TODO: Implement actual filtering logic
  });

  // ============ ANNOUNCEMENTS VIEW ============
  function renderAnnouncements() {
    const container = document.getElementById("announcementsList");
    container.innerHTML = "";

    announcements.forEach(ann => {
      const card = document.createElement("div");
      card.className = "announcement-card";
      card.innerHTML = `
        <div class="announcement-header">
          <div class="announcement-title">${escapeHtml(ann.title)}</div>
          <div class="announcement-date">${ann.date}</div>
        </div>
        <div class="announcement-body">${escapeHtml(ann.message)}</div>
        <div style="margin-top:8px; font-size:12px; color:rgba(255,255,255,0.6);">
          <strong>From:</strong> ${escapeHtml(ann.from)}
        </div>
      `;
      container.appendChild(card);
    });
  }

  renderAnnouncements();

  // ============ SUBMIT REQUEST VIEW ============
  // Show/hide date range based on request type
  document.getElementById("requestType").addEventListener("change", (e) => {
    const dateRow = document.getElementById("dateRangeRow");
    if (e.target.value === "leave") {
      dateRow.style.display = "";
    } else {
      dateRow.style.display = "none";
    }
  });

  document.getElementById("requestForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const type = document.getElementById("requestType").value;
    const subject = document.getElementById("requestSubject").value.trim();
    const description = document.getElementById("requestDescription").value.trim();
    
    if (!type || !subject || !description) {
      alert("Please fill all required fields");
      return;
    }

    // TODO: API call to submit request
    // fetch('/api/requests', { method: 'POST', body: JSON.stringify({type, subject, description}) })
    
    alert("Request submitted successfully! You will be notified once it's reviewed.");
    e.target.reset();
    
    // Add to my requests (mock)
    const today = new Date().toISOString().split('T')[0];
    myRequests.unshift({
      date: today,
      type: type.charAt(0).toUpperCase() + type.slice(1),
      subject: subject,
      status: "Pending"
    });
    renderMyRequests();
  });

  function renderMyRequests() {
    const tbody = document.querySelector("#myRequestsTable tbody");
    tbody.innerHTML = "";

    myRequests.forEach(req => {
      const tr = document.createElement("tr");
      let statusClass = "average";
      if (req.status === "Approved" || req.status === "Resolved") statusClass = "good";
      if (req.status === "Rejected") statusClass = "poor";
      
      tr.innerHTML = `
        <td>${req.date}</td>
        <td>${escapeHtml(req.type)}</td>
        <td>${escapeHtml(req.subject)}</td>
        <td><span class="attendance-badge ${statusClass}">${req.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderMyRequests();

  // ============ PROFILE VIEW ============
  document.getElementById("updateProfile").addEventListener("click", () => {
    const email = document.getElementById("profileEmail").value.trim();
    const phone = document.getElementById("profilePhone").value.trim();
    
    // TODO: API call to update profile
    // fetch('/api/profile', { method: 'PUT', body: JSON.stringify({email, phone}) })
    
    alert("Profile updated successfully!");
  });

  document.getElementById("changePasswordForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const current = document.getElementById("currentPass").value;
    const newPass = document.getElementById("newPass").value;
    const confirm = document.getElementById("confirmPass").value;
    
    if (newPass !== confirm) {
      alert("New passwords don't match!");
      return;
    }

    if (newPass.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    // TODO: API call to change password
    // fetch('/api/password', { method: 'PUT', body: JSON.stringify({current, newPass}) })
    
    alert("Password changed successfully!");
    e.target.reset();
  });

  document.getElementById("saveNotifications").addEventListener("click", () => {
    const emailNotif = document.getElementById("emailNotif").checked;
    const attendanceAlerts = document.getElementById("attendanceAlerts").checked;
    const announcementNotif = document.getElementById("announcementNotif").checked;
    
    // TODO: API call to save preferences
    // fetch('/api/preferences', { method: 'PUT', body: JSON.stringify({emailNotif, attendanceAlerts, announcementNotif}) })
    
    alert("Notification preferences saved!");
  });
});