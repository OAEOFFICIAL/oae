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

    // 7. Admission Tracker Logic
    const trackerState = JSON.parse(localStorage.getItem('oae_tracker_state')) || {
        step1: { checked: false, jambScore: '' },
        step2: { checked: false, putmeStatus: '' },
        step3: { checked: false, examDate: '' },
        step4: { checked: false },
        step5: { checked: false, capsStatus: 'not_admitted' }
    };

    const saveTrackerState = () => {
        localStorage.setItem('oae_tracker_state', JSON.stringify(trackerState));
    };

    const updateTrackerUI = () => {
        // Step 1
        const s1Check = document.getElementById('step1-check');
        if(s1Check) {
            s1Check.checked = trackerState.step1.checked;
            if(trackerState.step1.jambScore) document.getElementById('tracker-jamb-score').value = trackerState.step1.jambScore;
        }

        // Step 2
        const s2Check = document.getElementById('step2-check');
        if(s2Check) {
            s2Check.checked = trackerState.step2.checked;
            if(trackerState.step2.putmeStatus) document.getElementById('tracker-putme-status').value = trackerState.step2.putmeStatus;
        }

        // Step 3
        const s3Check = document.getElementById('step3-check');
        if(s3Check) {
            s3Check.checked = trackerState.step3.checked;
            if(trackerState.step3.examDate) document.getElementById('tracker-exam-date').value = trackerState.step3.examDate;
        }

        // Step 4
        const s4Check = document.getElementById('step4-check');
        if(s4Check) {
            s4Check.checked = trackerState.step4.checked;
        }

        // Step 5
        const s5Check = document.getElementById('step5-check');
        if(s5Check) {
            s5Check.checked = trackerState.step5.checked;
            if(trackerState.step5.capsStatus) document.getElementById('tracker-caps-status').value = trackerState.step5.capsStatus;
        }

        // Update classes for visual timeline
        let firstUncheckedFound = false;
        for (let i = 1; i <= 5; i++) {
            const stepEl = document.querySelector(`.timeline-step[data-step="${i}"]`);
            if(!stepEl) continue;
            const isChecked = trackerState[`step${i}`].checked;
            
            stepEl.classList.remove('completed', 'active-step');
            
            if (isChecked) {
                stepEl.classList.add('completed');
            } else if (!firstUncheckedFound) {
                stepEl.classList.add('active-step');
                firstUncheckedFound = true;
            }
        }
    };

    // Event Listeners for Tracker
    for (let i = 1; i <= 5; i++) {
        const checkbox = document.getElementById(`step${i}-check`);
        if(checkbox) {
            checkbox.addEventListener('change', (e) => {
                trackerState[`step${i}`].checked = e.target.checked;
                saveTrackerState();
                updateTrackerUI();
            });
        }
    }

    // Step 1 Specific Save
    const saveJambBtn = document.getElementById('save-jamb-btn');
    if(saveJambBtn) {
        saveJambBtn.addEventListener('click', () => {
            const score = document.getElementById('tracker-jamb-score').value;
            if(score) {
                trackerState.step1.jambScore = score;
                trackerState.step1.checked = true; // Auto check if they save score
                saveTrackerState();
                updateTrackerUI();
            }
        });
    }

    // Step 2 Select
    const trackerPutmeStatus = document.getElementById('tracker-putme-status');
    if(trackerPutmeStatus) {
        trackerPutmeStatus.addEventListener('change', (e) => {
            trackerState.step2.putmeStatus = e.target.value;
            if(e.target.value === 'registered') trackerState.step2.checked = true;
            saveTrackerState();
            updateTrackerUI();
        });
    }

    // Step 3 Date
    const trackerExamDate = document.getElementById('tracker-exam-date');
    if(trackerExamDate) {
        trackerExamDate.addEventListener('change', (e) => {
            trackerState.step3.examDate = e.target.value;
            if(e.target.value) trackerState.step3.checked = true;
            saveTrackerState();
            updateTrackerUI();
        });
    }

    // Step 5 Caps
    const trackerCapsStatus = document.getElementById('tracker-caps-status');
    if(trackerCapsStatus) {
        trackerCapsStatus.addEventListener('change', (e) => {
            trackerState.step5.capsStatus = e.target.value;
            if(e.target.value === 'admitted') trackerState.step5.checked = true;
            saveTrackerState();
            updateTrackerUI();
        });
    }

    // Initialize Tracker UI
    updateTrackerUI();
});
