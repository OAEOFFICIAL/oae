// dashboard.js - Handles Authentication logic and LocalStorage metrics

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Check
    const userDataStr = localStorage.getItem('oae_user');
    if (!userDataStr) {
        // Not logged in! Redirect instantly.
        window.location.href = 'login.htm';
        return;
    }

    // 2. Parse User
    const user = JSON.parse(userDataStr);
    
    // UI Elements
    const dashEmail = document.getElementById('dashEmail');
    const dashAvatar = document.getElementById('dashAvatar');
    const dashGreeting = document.getElementById('dashGreeting');
    const logoutBtn = document.getElementById('logoutBtn');

    // Populate User Details
    dashEmail.innerText = user.email;
    
    const realName = user.name || user.email.split('@')[0];
    const firstLetter = realName.charAt(0).toUpperCase();
    dashAvatar.innerText = firstLetter;
    
    dashGreeting.innerText = `Welcome back, ${realName}!`;
    
    const dashNameDisplay = document.getElementById('dashNameDisplay');
    if (dashNameDisplay) dashNameDisplay.innerText = realName;

    // Profile Editing Logic
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileForm = document.getElementById('editProfileForm');
    const editNameInput = document.getElementById('editNameInput');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const cancelProfileBtn = document.getElementById('cancelProfileBtn');

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            editProfileForm.style.display = 'block';
            editProfileBtn.style.display = 'none';
            editNameInput.value = realName;
        });

        cancelProfileBtn.addEventListener('click', () => {
            editProfileForm.style.display = 'none';
            editProfileBtn.style.display = 'inline-block';
        });

        saveProfileBtn.addEventListener('click', () => {
            const newName = editNameInput.value.trim();
            if (newName) {
                // Update active session
                user.name = newName;
                localStorage.setItem('oae_user', JSON.stringify(user));
                
                // Update database
                const existingUsers = localStorage.getItem('oae_registered_users');
                if (existingUsers) {
                    let dbUsers = JSON.parse(existingUsers);
                    let dbUser = dbUsers.find(u => u.email === user.email);
                    if (dbUser) {
                        dbUser.name = newName;
                        localStorage.setItem('oae_registered_users', JSON.stringify(dbUsers));
                    }
                }
                
                // Refresh UI
                dashNameDisplay.innerText = newName;
                dashAvatar.innerText = newName.charAt(0).toUpperCase();
                dashGreeting.innerText = `Welcome back, ${newName}!`;
                
                editProfileForm.style.display = 'none';
                editProfileBtn.style.display = 'inline-block';
            }
        });
    }

    // 3. Logout Logic
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('oae_user');
        window.location.href = 'login.htm';
    });

    // 4. Target School Logic
    const schoolSelect = document.getElementById('targetSchoolSelect');
    
    // Load existing preference
    const savedTarget = localStorage.getItem('oae_target_school');
    if (savedTarget) {
        schoolSelect.value = savedTarget;
    }

    // Save on change
    schoolSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val) {
            localStorage.setItem('oae_target_school', val);
            // Optionally show a mini toast notification here
        } else {
            localStorage.removeItem('oae_target_school');
        }
    });

    // 5. Load Aggregate Score
    const aggregateDataStr = localStorage.getItem('oae_saved_aggregate');
    if (aggregateDataStr) {
        const aggData = JSON.parse(aggregateDataStr);
        document.getElementById('savedAggregateVal').innerText = aggData.score;
        document.getElementById('savedAggregateSchool').innerText = `Target: ${aggData.school}`;
        document.getElementById('savedAggregateVal').style.color = '#0f172a';
    }

    // 6. Navbar fix (since we're on the dashboard, force it to look logged in)
    const navBtn = document.getElementById('navDashBtn');
    if(navBtn) navBtn.style.display = 'none'; // Hide Join btn on the dashboard itself
});
