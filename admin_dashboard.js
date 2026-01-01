document.addEventListener("DOMContentLoaded", () => {
  // Load user info from session
  try {
    const user = JSON.parse(sessionStorage.getItem("currentUser") || "null");
    if (user) {
      const nameEl = document.getElementById("accountName");
      const emailEl = document.getElementById("accountEmail");
      const avatarEl = document.getElementById("accountAvatar");
      if (nameEl) nameEl.textContent = user.username || "Admin";
      if (emailEl) emailEl.textContent = user.email || "admin@gn.edu";
      if (avatarEl) {
        const initials = (user.username || "AD")
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

  // In-memory data storage (replace with API calls)
  let classes = [
    { name: "Computer Science", year: "2", section: "A", subject: "Data Structures" }
  ];
  let students = [
    { id: "ST001", name: "Rahul Sharma", year: "2", section: "A" },
    { id: "ST002", name: "Priya Patel", year: "2", section: "A" },
    { id: "ST003", name: "Amit Kumar", year: "2", section: "A" },
    { id: "ST004", name: "Sneha Reddy", year: "2", section: "A" },
    { id: "ST005", name: "Vikram Singh", year: "2", section: "A" }
  ];
  let announcements = [
    { title: "Welcome to Semester", msg: "Welcome back students! New semester begins next week.", target: "all" }
  ];
  let attendanceRecords = [];

  // Helper functions
  function escapeHtml(s) {
    return String(s || "").replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function showConfirm(message, onConfirm) {
    const root = document.getElementById("modalRoot");
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `<h3>Confirm</h3><p style="margin-bottom:12px;">${escapeHtml(message)}</p><div style="display:flex;gap:10px;justify-content:flex-end;"><button class="btn ghost" id="cancelBtn">Cancel</button><button class="btn primary" id="confirmBtn">Confirm</button></div>`;
    backdrop.appendChild(modal);
    root.appendChild(backdrop);
    backdrop.addEventListener("click", (ev) => {
      if (ev.target === backdrop) close();
    });
    document.getElementById("cancelBtn").addEventListener("click", close);
    document.getElementById("confirmBtn").addEventListener("click", () => {
      onConfirm();
      close();
    });
    function close() {
      if (root.contains(backdrop)) root.removeChild(backdrop);
    }
  }

  // Set today's date as default
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('attendanceDate').value = today;

  // ============ ADD CLASS SECTION ============
  function renderClasses() {
    const tb = document.querySelector("#classesTable tbody");
    tb.innerHTML = "";
    classes.forEach((c, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${escapeHtml(c.name)}</td><td>${c.year ? c.year + 'nd Year' : ''}</td><td>${escapeHtml(c.section || "")}</td><td>${escapeHtml(c.subject || "")}</td><td><button class="btn ghost" data-idx="${idx}">Remove</button></td>`;
      tb.appendChild(tr);
    });
  }

  document.getElementById("addClassForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("className").value.trim();
    const year = document.getElementById("classYear").value;
    const section = document.getElementById("classSection").value.trim();
    const subject = document.getElementById("classSubject").value.trim();
    
    if (!name || !year || !section) {
      alert("Please fill all required fields");
      return;
    }

    classes.push({ name, year, section, subject });
    renderClasses();
    e.target.reset();
    alert("Class added successfully!");
    
    // TODO: API call to backend
    // fetch('/api/classes', { method: 'POST', body: JSON.stringify({name, year, section, subject}) })
  });

  document.getElementById("resetAddClass").addEventListener("click", () => {
    document.getElementById("addClassForm").reset();
  });

  document.querySelector("#classesTable tbody").addEventListener("click", (e) => {
    if (e.target.matches("button")) {
      const idx = Number(e.target.dataset.idx);
      showConfirm(`Remove class "${classes[idx]?.name}"?`, () => {
        classes.splice(idx, 1);
        renderClasses();
        // TODO: API call to delete
        // fetch(`/api/classes/${classId}`, { method: 'DELETE' })
      });
    }
  });

  renderClasses();

  // ============ VIEW REPORT SECTION ============
  document.getElementById("reportType").addEventListener("change", (e) => {
    const type = e.target.value;
    document.getElementById("classReportSection").style.display = type === "class" ? "" : "none";
    document.getElementById("studentReportSection").style.display = type === "student" ? "" : "none";
    document.getElementById("subjectReportSection").style.display = type === "subject" ? "" : "none";
  });

  // Class Report
  document.getElementById("generateClassReport").addEventListener("click", () => {
    const year = document.getElementById("classReportYear").value;
    const section = document.getElementById("classReportSection").value;
    
    if (!year || !section) {
      alert("Please select year and section");
      return;
    }

    // Mock data - replace with API call
    // fetch(`/api/reports/class?year=${year}&section=${section}`)
    const mockData = {
      avgAttendance: 85,
      totalStudents: 45,
      totalClasses: 60,
      records: [
        { date: "2024-10-15", present: 40, absent: 5, percentage: 88.9 },
        { date: "2024-10-16", present: 42, absent: 3, percentage: 93.3 },
        { date: "2024-10-17", present: 38, absent: 7, percentage: 84.4 }
      ]
    };

    document.getElementById("classAvgAttendance").textContent = mockData.avgAttendance + "%";
    document.getElementById("classTotalStudents").textContent = mockData.totalStudents;
    document.getElementById("classTotalClasses").textContent = mockData.totalClasses;

    const tbody = document.querySelector("#classReportTable tbody");
    tbody.innerHTML = "";
    mockData.records.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${r.date}</td><td>${r.present}</td><td>${r.absent}</td><td>${r.percentage.toFixed(1)}%</td>`;
      tbody.appendChild(tr);
    });

    document.getElementById("classReportResult").style.display = "";
  });

  // Student Report
  document.getElementById("generateStudentReport").addEventListener("click", () => {
    const name = document.getElementById("studentReportName").value.trim();
    const year = document.getElementById("studentReportYear").value;
    const section = document.getElementById("studentReportSection").value;
    
    if (!name || !year || !section) {
      alert("Please fill all fields");
      return;
    }

    // Mock data - replace with API call
    // fetch(`/api/reports/student?name=${name}&year=${year}&section=${section}`)
    const mockData = {
      attendance: 87.5,
      present: 35,
      absent: 5
    };

    document.getElementById("studentAttendance").textContent = mockData.attendance + "%";
    document.getElementById("studentPresent").textContent = mockData.present;
    document.getElementById("studentAbsent").textContent = mockData.absent;
    document.getElementById("studentReportResult").style.display = "";
  });

  // Subject Report
  document.getElementById("generateSubjectReport").addEventListener("click", () => {
    const subject = document.getElementById("subjectReportSubject").value;
    const year = document.getElementById("subjectReportYear").value;
    
    if (!subject || !year) {
      alert("Please select subject and year");
      return;
    }

    // Mock data - replace with API call
    // fetch(`/api/reports/subject?subject=${subject}&year=${year}`)
    const mockData = {
      avgAttendance: 82,
      totalClasses: 45
    };

    document.getElementById("subjectAvgAttendance").textContent = mockData.avgAttendance + "%";
    document.getElementById("subjectTotalClasses").textContent = mockData.totalClasses;
    document.getElementById("subjectReportResult").style.display = "";
  });

  // ============ TAKE ATTENDANCE SECTION ============
  let currentAttendance = {};

  document.getElementById("loadStudents").addEventListener("click", () => {
    const year = document.getElementById("attendanceYear").value;
    const section = document.getElementById("attendanceSection").value;
    const date = document.getElementById("attendanceDate").value;
    const subject = document.getElementById("attendanceSubject").value;
    
    if (!year || !section || !date || !subject) {
      alert("Please fill all fields");
      return;
    }

    // Filter students by year and section
    const filteredStudents = students.filter(s => s.year === year && s.section === section);
    
    if (filteredStudents.length === 0) {
      alert("No students found for this class");
      return;
    }

    // TODO: API call to fetch students
    // fetch(`/api/students?year=${year}&section=${section}`)

    currentAttendance = {};
    const listEl = document.getElementById("attendanceList");
    listEl.innerHTML = "";

    filteredStudents.forEach(student => {
      currentAttendance[student.id] = null; // null = not marked
      
      const row = document.createElement("div");
      row.className = "student-row";
      row.innerHTML = `
        <div class="student-info">
          <div class="student-name">${escapeHtml(student.name)}</div>
          <div class="student-id">ID: ${escapeHtml(student.id)}</div>
        </div>
        <div class="attendance-controls">
          <button class="attendance-btn" data-id="${student.id}" data-status="present">Present</button>
          <button class="attendance-btn" data-id="${student.id}" data-status="absent">Absent</button>
        </div>
      `;
      listEl.appendChild(row);
    });

    document.getElementById("attendanceListContainer").style.display = "";
  });

  // Handle attendance button clicks
  document.getElementById("attendanceList").addEventListener("click", (e) => {
    if (e.target.matches(".attendance-btn")) {
      const studentId = e.target.dataset.id;
      const status = e.target.dataset.status;
      
      // Remove selection from both buttons for this student
      const buttons = document.querySelectorAll(`[data-id="${studentId}"]`);
      buttons.forEach(btn => {
        btn.classList.remove("selected-present", "selected-absent");
      });
      
      // Add selection to clicked button
      if (status === "present") {
        e.target.classList.add("selected-present");
        currentAttendance[studentId] = true;
      } else {
        e.target.classList.add("selected-absent");
        currentAttendance[studentId] = false;
      }
    }
  });

  // Mark all present
  document.getElementById("markAllPresent").addEventListener("click", () => {
    const buttons = document.querySelectorAll('.attendance-btn[data-status="present"]');
    buttons.forEach(btn => {
      const studentId = btn.dataset.id;
      currentAttendance[studentId] = true;
      
      // Update UI
      document.querySelectorAll(`[data-id="${studentId}"]`).forEach(b => {
        b.classList.remove("selected-present", "selected-absent");
      });
      btn.classList.add("selected-present");
    });
  });

  // Mark all absent
  document.getElementById("markAllAbsent").addEventListener("click", () => {
    const buttons = document.querySelectorAll('.attendance-btn[data-status="absent"]');
    buttons.forEach(btn => {
      const studentId = btn.dataset.id;
      currentAttendance[studentId] = false;
      
      // Update UI
      document.querySelectorAll(`[data-id="${studentId}"]`).forEach(b => {
        b.classList.remove("selected-present", "selected-absent");
      });
      btn.classList.add("selected-absent");
    });
  });

  // Submit attendance
  document.getElementById("submitAttendance").addEventListener("click", () => {
    const unmarked = Object.values(currentAttendance).filter(v => v === null).length;
    
    if (unmarked > 0) {
      if (!confirm(`${unmarked} students are not marked. Continue anyway?`)) {
        return;
      }
    }

    const year = document.getElementById("attendanceYear").value;
    const section = document.getElementById("attendanceSection").value;
    const date = document.getElementById("attendanceDate").value;
    const subject = document.getElementById("attendanceSubject").value;

    const attendanceData = {
      year,
      section,
      date,
      subject,
      attendance: currentAttendance
    };

    // TODO: API call to submit attendance
    // fetch('/api/attendance', { method: 'POST', body: JSON.stringify(attendanceData) })
    
    console.log("Submitting attendance:", attendanceData);
    alert("Attendance submitted successfully!");
    
    // Reset form
    document.getElementById("attendanceListContainer").style.display = "none";
    document.getElementById("attendanceYear").value = "";
    document.getElementById("attendanceSection").value = "";
    document.getElementById("attendanceSubject").value = "";
    currentAttendance = {};
  });

  // Cancel attendance
  document.getElementById("cancelAttendance").addEventListener("click", () => {
    showConfirm("Are you sure you want to cancel? All unmarked attendance will be lost.", () => {
      document.getElementById("attendanceListContainer").style.display = "none";
      currentAttendance = {};
    });
  });

  // ============ ANNOUNCEMENTS SECTION ============
  function renderAnnouncements() {
    const el = document.getElementById("annList");
    el.innerHTML = "";
    announcements.forEach((a) => {
      const d = document.createElement("div");
      d.className = "card";
      d.innerHTML = `<strong>${escapeHtml(a.title)}</strong><p style="margin-top:6px;color:rgba(255,255,255,0.85);">${escapeHtml(a.msg)}</p><small style="color:rgba(255,255,255,0.6);">Target: ${a.target}</small>`;
      el.appendChild(d);
    });
  }

  document.getElementById("announcementForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("announcementTitle").value.trim();
    const msg = document.getElementById("announcementMessage").value.trim();
    const target = document.getElementById("announcementTarget").value;
    
    if (!title || !msg) {
      alert("Please add title and message");
      return;
    }
    
    announcements.unshift({ title, msg, target });
    renderAnnouncements();
    e.target.reset();
    alert("Announcement published successfully!");
    
    // TODO: API call
    // fetch('/api/announcements', { method: 'POST', body: JSON.stringify({title, msg, target}) })
  });

  renderAnnouncements();

  // ============ SETTINGS SECTION ============
  document.getElementById("profileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("settingsName").value.trim();
    const email = document.getElementById("settingsEmail").value.trim();
    const phone = document.getElementById("settingsPhone").value.trim();
    const dept = document.getElementById("settingsDepartment").value.trim();
    
    // TODO: API call to update profile
    // fetch('/api/profile', { method: 'PUT', body: JSON.stringify({name, email, phone, dept}) })
    
    alert("Profile updated successfully!");
  });

  document.getElementById("passwordForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const current = document.getElementById("currentPassword").value;
    const newPass = document.getElementById("newPassword").value;
    const confirm = document.getElementById("confirmPassword").value;
    
    if (!current || !newPass || !confirm) {
      alert("Please fill all password fields");
      return;
    }
    
    if (newPass !== confirm) {
      alert("New passwords don't match");
      return;
    }
    
    if (newPass.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    
    // TODO: API call to update password
    // fetch('/api/password', { method: 'PUT', body: JSON.stringify({current, newPass}) })
    
    alert("Password updated successfully!");
    e.target.reset();
  });

  document.getElementById("savePreferences").addEventListener("click", () => {
    const defaultView = document.getElementById("defaultView").value;
    const emailNotif = document.getElementById("emailNotif").value;
    
    // TODO: API call to save preferences
    // fetch('/api/preferences', { method: 'PUT', body: JSON.stringify({defaultView, emailNotif}) })
    
    alert("Preferences saved successfully!");
  });
});