document.addEventListener("DOMContentLoaded", () => {
  try {
    const user = JSON.parse(sessionStorage.getItem("currentUser") || "null");
    if (user) {
      const nameEl = document.getElementById("accountName");
      const emailEl = document.getElementById("accountEmail");
      const avatarEl = document.getElementById("accountAvatar");
      if (nameEl) nameEl.textContent = user.username || "Master Admin";
      if (emailEl)
        emailEl.textContent = user.role
          ? `${user.role}@gi.edu`
          : user.email || "master@gi.edu";
      if (avatarEl) {
        const initials = (user.username || "MI")
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

  // Sidebar navi
  const navBtns = document.querySelectorAll(".nav-btn");
  const views = document.querySelectorAll(".view");
  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      navBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const view = btn.dataset.view;
      views.forEach(
        (v) => (v.style.display = v.id === "view-" + view ? "" : "none")
      );
    });
  });

  let admins = readTableToArray("adminsTable", (cells) => ({ name: cells[0].textContent.trim(), email: cells[1].textContent.trim() }));
  let classes = readTableToArray("classesTable", (cells) => ({ name: cells[0].textContent.trim(), code: cells[1].textContent.trim() }));
  let students = readTableToArray("studentsTable", (cells) => ({ name: cells[0].textContent.trim(), id: cells[1].textContent.trim(), cls: cells[2].textContent.trim() }));
  let requests = readTableToArray("requestsTable", (cells) => ({ from: cells[0].textContent.trim(), type: cells[1].textContent.trim(), details: cells[2].textContent.trim() }));
  let announcements = readAnnouncementsFromDom();

  if (!admins.length) admins = [{ name: "Alice Rao", email: "alice@gi.edu" }, { name: "Ravi Kumar", email: "ravi@gi.edu" }];
  if (!classes.length) classes = [{ name: "BCA 2nd Sem", code: "BCA-2" }, { name: "BSc CS 1st", code: "BSC-1" }];
  if (!students.length) students = [{ name: "Tejas King", id: "U123", cls: "BCA 2nd Sem" }];
  if (!requests.length) requests = [{ from: "student@gi.edu", type: "Account Help", details: "Cannot login" }];
  if (!announcements.length) announcements = [{ title: "Welcome", msg: "Welcome back to semester." }];

  // Renderers
  function renderAdmins() {
    const tb = document.querySelector("#adminsTable tbody");
    tb.innerHTML = "";
    admins.forEach((a, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${escapeHtml(a.name)}</td><td>${escapeHtml(a.email)}</td><td><button class="btn ghost" data-idx="${idx}">Remove</button></td>`;
      tb.appendChild(tr);
    });
  }
  function renderClasses() {
    const tb = document.querySelector("#classesTable tbody");
    tb.innerHTML = "";
    classes.forEach((c, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${escapeHtml(c.name)}</td><td>${escapeHtml(c.code || "")}</td><td><button class="btn ghost" data-idx="${idx}">Remove</button></td>`;
      tb.appendChild(tr);
    });
  }
  function renderStudents() {
    const tb = document.querySelector("#studentsTable tbody");
    tb.innerHTML = "";
    students.forEach((s, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.id)}</td><td>${escapeHtml(s.cls || "")}</td><td><button class="btn ghost" data-idx="${idx}">Remove</button></td>`;
      tb.appendChild(tr);
    });
  }
  function renderRequests() {
    const tb = document.querySelector("#requestsTable tbody");
    tb.innerHTML = "";
    requests.forEach((r, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${escapeHtml(r.from)}</td><td>${escapeHtml(r.type)}</td><td>${escapeHtml(r.details)}</td><td><button class="btn primary" data-idx="${idx}">Review</button></td>`;
      tb.appendChild(tr);
    });
  }
  function renderAnnouncements() {
    const el = document.getElementById("annList");
    el.innerHTML = "";
    announcements.forEach((a) => {
      const d = document.createElement("div");
      d.className = "card";
      d.innerHTML = `<strong>${escapeHtml(a.title)}</strong><p style="margin-top:6px;color:rgba(2,38,58,0.85);">${escapeHtml(a.msg)}</p>`;
      el.appendChild(d);
    });
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function readTableToArray(tableId, mapFn) {
    const arr = [];
    const tb = document.querySelector(`#${tableId} tbody`);
    if (!tb) return arr;
    const rows = tb.querySelectorAll("tr");
    rows.forEach((r) => {
      const cells = Array.from(r.children).slice(0, -1);
      if (cells.length) arr.push(mapFn(cells));
    });
    return arr;
  }
  function readAnnouncementsFromDom() {
    const el = document.getElementById("annList");
    if (!el) return [];
    const cards = el.querySelectorAll(".card");
    const arr = [];
    cards.forEach((c) => {
      const title = c.querySelector("strong")?.textContent.trim() || "";
      const msg = c.querySelector("p")?.textContent.trim() || "";
      if (title || msg) arr.push({ title, msg });
    });
    return arr;
  }

  // loading one by one when the page lods
  renderAdmins();
  renderClasses();
  renderStudents();
  renderRequests();
  renderAnnouncements();

  // Add addmin
  document.getElementById("addAdminForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("adminName").value.trim();
    const email = document.getElementById("adminEmail").value.trim();
    const phone = document.getElementById("adminPhone").value.trim();
    // validation
    if (!name || !email) {
      alert("Please fill required fields");
      return;
    }
    admins.push({ name, email, phone });
    renderAdmins();
    e.target.reset();
    alert("Admin added: " + name);
  });

  document
    .getElementById("resetAddAdmin")
    .addEventListener("click", () =>
      document.getElementById("addAdminForm").reset()
    );

  // remove admin
  document
    .querySelector("#adminsTable tbody")
    .addEventListener("click", (e) => {
      if (e.target.matches("button")) {
        const idx = Number(e.target.dataset.idx);
        showConfirm(
          `Are you sure you want to remove admin "${admins[idx]?.name}"?`,
          () => {
            admins.splice(idx, 1);
            renderAdmins();
          }
        );
      }
    });

  // class
  document.getElementById("classForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("className").value.trim();
    const code = document.getElementById("classCode").value.trim();
    if (!name) {
      alert("Enter class name");
      return;
    }
    classes.push({ name, code });
    renderClasses();
    e.target.reset();
    alert("Class added");
  });
  document
    .querySelector("#classesTable tbody")
    .addEventListener("click", (e) => {
      if (e.target.matches("button")) {
        const idx = Number(e.target.dataset.idx);
        showConfirm(`Remove class "${classes[idx]?.name}"?`, () => {
          classes.splice(idx, 1);
          renderClasses();
        });
      }
    });

  // students nashe
  document.getElementById("studentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("studentName").value.trim();
    const id = document.getElementById("studentId").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const cls = document.getElementById("studentClass").value.trim();
    if (!name || !id) {
      alert("Name and UUCMS ID required");
      return;
    }
    students.push({ name, id, cls, email });
    renderStudents();
    e.target.reset();
    alert("Student added");
  });
  document
    .querySelector("#studentsTable tbody")
    .addEventListener("click", (e) => {
      if (e.target.matches("button")) {
        const idx = Number(e.target.dataset.idx);
        showConfirm(
          `Remove student "${students[idx]?.name}" (ID: ${students[idx]?.id})?`,
          () => {
            students.splice(idx, 1);
            renderStudents();
          }
        );
      }
    });

  // requestsss
  document
    .querySelector("#requestsTable tbody")
    .addEventListener("click", (e) => {
      if (e.target.matches("button")) {
        const idx = Number(e.target.dataset.idx);
        alert("Open review for request: " + requests[idx]?.details);
      }
    });

  // announcements doing dung
  document
    .getElementById("announcementForm")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const t = document.getElementById("announcementTitle").value.trim();
      const m = document.getElementById("announcementMessage").value.trim();
      if (!t || !m) {
        alert("Please add title and message");
        return;
      }
      announcements.unshift({ title: t, msg: m });
      renderAnnouncements();
      e.target.reset();
      alert("Announcement published");
    });

  document.getElementById("bulkUploadBtn").addEventListener("click", () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,text/csv';
    input.addEventListener('change', (ev) => {
      const file = ev.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const text = e.target.result;
        // Very simple CSV parser: expects name,id,class in each line
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        let added = 0;
        lines.forEach(line => {
          const parts = line.split(',').map(p => p.trim());
          if (parts.length >= 2) {
            students.push({ name: parts[0], id: parts[1], cls: parts[2] || '' });
            added++;
          }
        });
        if (added) {
          renderStudents();
          alert(`${added} students added from CSV`);
        } else alert('No valid rows found in CSV');
      };
      reader.readAsText(file);
    });
    input.click();
  });

  function showConfirm(message, onConfirm) {
    const root = document.getElementById("modalRoot");
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `<h3>Confirm</h3><p style="margin-bottom:12px;">${escapeHtml(message)}</p><div style="display:flex;gap:10px;justify-content:flex-end;"><button class="btn ghost" id="cancelBtn">Cancel</button><button class="btn primary" id="confirmBtn">Remove</button></div>`;
    backdrop.appendChild(modal);
    root.appendChild(backdrop);
    backdrop.addEventListener("click", (ev) => {
      if (ev.target === backdrop) {
        close();
      }
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
});
