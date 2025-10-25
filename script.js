let currentView = 'main';

function showRoleModal() {
    const modal = document.getElementById('roleModal');
    modal.classList.add('active');
    showMainRoles();
}

function closeRoleModal() {
    const modal = document.getElementById('roleModal');
    modal.classList.remove('active');
    currentView = 'main';
}

function showMainRoles() {
    currentView = 'main';
    const modalContent = document.querySelector('.modal-content-custom');
    modalContent.innerHTML = `
        <button class="modal-close" onclick="closeRoleModal()">&times;</button>
        <h2 class="modal-title">Select Your Role</h2>
        
        <div class="role-option" onclick="showAdminOptions()">
            <h3>👨‍💼 Admin</h3>
            <p>Manage institution and users</p>
        </div>

        <div class="role-option" onclick="loginAs('student')">
            <h3>👨‍🎓 Student</h3>
            <p>Access courses and materials</p>
        </div>
    `;
}

function showAdminOptions() {
    currentView = 'admin';
    const modalContent = document.querySelector('.modal-content-custom');
    modalContent.innerHTML = `
        <button class="modal-close" onclick="closeRoleModal()">&times;</button>
        <button class="back-button" onclick="showMainRoles()">
            <span>←</span> Back
        </button>
        <h2 class="modal-title">Select Admin Type</h2>
        
        <div class="role-option" onclick="loginAs('master-admin')">
            <h3>👑 Master Admin</h3>
            <p>Full system control and management</p>
        </div>

        <div class="role-option" onclick="loginAs('admin')">
            <h3>👨‍💼 Admin</h3>
            <p>Institution management</p>
        </div>
    `;
}

function loginAs(role) {
    switch(role) {
        case 'master-admin':
            window.location.href = 'login.html?role=master-admin';
            break;
        case 'admin':
            window.location.href = 'login.html?role=admin';
            break;
        case 'student':
            window.location.href = 'login.html?role=student';
            break;
        default:
            alert(`Redirecting to ${role} login page...`);
    }
    closeRoleModal();
}

document.getElementById('roleModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeRoleModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeRoleModal();
    }
});