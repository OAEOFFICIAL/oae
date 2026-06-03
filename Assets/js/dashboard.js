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

    // ── Dark Mode Toggle ──────────────────────────────────────
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeLabel = document.getElementById('darkModeLabel');
    const darkModeIcon = darkModeToggle ? darkModeToggle.querySelector('i') : null;

    // Restore saved preference
    if (localStorage.getItem('oae_dark_mode') === 'true') {
        document.body.classList.add('dark-mode');
        if (darkModeLabel) darkModeLabel.textContent = 'Light Mode';
        if (darkModeIcon) { darkModeIcon.classList.remove('fa-moon'); darkModeIcon.classList.add('fa-sun'); }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('oae_dark_mode', isDark);
            if (darkModeLabel) darkModeLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
            if (darkModeIcon) {
                darkModeIcon.classList.toggle('fa-moon', !isDark);
                darkModeIcon.classList.toggle('fa-sun', isDark);
            }
        });
    }

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

    // 8. Dynamic Dashboard Statistics & Charts Logic
    const initDashboardHistory = () => {
        const history = JSON.parse(localStorage.getItem('oae_quiz_history')) || [];
        
        // Element bindings
        const totalQuizzesVal = document.getElementById('totalQuizzesVal');
        const averageScoreVal = document.getElementById('averageScoreVal');
        const highScoreVal = document.getElementById('highScoreVal');
        const streakVal = document.getElementById('streakVal');
        const chartsSectionWrapper = document.getElementById('chartsSectionWrapper');
        const historyTableBody = document.getElementById('historyTableBody');
        
        if (!totalQuizzesVal || !averageScoreVal || !highScoreVal || !streakVal || !historyTableBody) return;
        
        const count = history.length;
        totalQuizzesVal.innerText = count;
        
        if (count === 0) {
            averageScoreVal.innerText = '0%';
            highScoreVal.innerText = '0%';
            streakVal.innerHTML = '0 Days <i class="fas fa-fire" style="color:#f59e0b; margin-left:5px;"></i>';
            if (chartsSectionWrapper) chartsSectionWrapper.style.display = 'none';
            
            const loadDemoBtn = document.getElementById('loadDemoBtn');
            if (loadDemoBtn) {
                loadDemoBtn.addEventListener('click', () => {
                    const mockHistory = [
                      {
                        id: "quiz_1",
                        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                        mode: "quiz",
                        percentage: 58.5,
                        totalCorrect: 23,
                        totalQuestions: 40,
                        totalMarks: 230,
                        maxMarks: 400,
                        subjects: [
                          { id: "math", name: "Mathematics", correct: 7, total: 10, marks: 70, totalMarks: 100 },
                          { id: "english", name: "English Language", correct: 6, total: 10, marks: 60, totalMarks: 100 },
                          { id: "physics", name: "Physics", correct: 5, total: 10, marks: 50, totalMarks: 100 },
                          { id: "chem", name: "Chemistry", correct: 5, total: 10, marks: 50, totalMarks: 100 }
                        ]
                      },
                      {
                        id: "quiz_2",
                        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                        mode: "exam",
                        percentage: 67.5,
                        totalCorrect: 27,
                        totalQuestions: 40,
                        totalMarks: 270,
                        maxMarks: 400,
                        subjects: [
                          { id: "math", name: "Mathematics", correct: 8, total: 10, marks: 80, totalMarks: 100 },
                          { id: "english", name: "English Language", correct: 7, total: 10, marks: 70, totalMarks: 100 },
                          { id: "physics", name: "Physics", correct: 6, total: 10, marks: 60, totalMarks: 100 },
                          { id: "chem", name: "Chemistry", correct: 6, total: 10, marks: 60, totalMarks: 100 }
                        ]
                      },
                      {
                        id: "quiz_3",
                        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                        mode: "quiz",
                        percentage: 75.0,
                        totalCorrect: 30,
                        totalQuestions: 40,
                        totalMarks: 300,
                        maxMarks: 400,
                        subjects: [
                          { id: "math", name: "Mathematics", correct: 9, total: 10, marks: 90, totalMarks: 100 },
                          { id: "english", name: "English Language", correct: 8, total: 10, marks: 80, totalMarks: 100 },
                          { id: "physics", name: "Physics", correct: 7, total: 10, marks: 70, totalMarks: 100 },
                          { id: "chem", name: "Chemistry", correct: 6, total: 10, marks: 60, totalMarks: 100 }
                        ]
                      },
                      {
                        id: "quiz_4",
                        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                        mode: "study",
                        percentage: 82.5,
                        totalCorrect: 33,
                        totalQuestions: 40,
                        totalMarks: 330,
                        maxMarks: 400,
                        subjects: [
                          { id: "math", name: "Mathematics", correct: 9, total: 10, marks: 90, totalMarks: 100 },
                          { id: "english", name: "English Language", correct: 9, total: 10, marks: 90, totalMarks: 100 },
                          { id: "physics", name: "Physics", correct: 8, total: 10, marks: 80, totalMarks: 100 },
                          { id: "chem", name: "Chemistry", correct: 7, total: 10, marks: 70, totalMarks: 100 }
                        ]
                      },
                      {
                        id: "quiz_5",
                        timestamp: new Date().toISOString(),
                        mode: "exam",
                        percentage: 87.5,
                        totalCorrect: 35,
                        totalQuestions: 40,
                        totalMarks: 350,
                        maxMarks: 400,
                        subjects: [
                          { id: "math", name: "Mathematics", correct: 10, total: 10, marks: 100, totalMarks: 100 },
                          { id: "english", name: "English Language", correct: 9, total: 10, marks: 90, totalMarks: 100 },
                          { id: "physics", name: "Physics", correct: 8, total: 10, marks: 80, totalMarks: 100 },
                          { id: "chem", name: "Chemistry", correct: 8, total: 10, marks: 80, totalMarks: 100 }
                        ]
                      }
                    ];
                    localStorage.setItem('oae_quiz_history', JSON.stringify(mockHistory));
                    window.location.reload();
                });
            }
            return;
        }
        
        // Show charts section if history exists
        if (chartsSectionWrapper) chartsSectionWrapper.style.display = 'grid';
        
        // Compute Statistics
        let sumPct = 0;
        let highest = 0;
        let highestRaw = '';
        
        history.forEach(run => {
            sumPct += run.percentage;
            if (run.percentage > highest) {
                highest = run.percentage;
                highestRaw = `${run.totalCorrect}/${run.totalQuestions} (${run.percentage.toFixed(1)}%)`;
            }
        });
        
        const avg = sumPct / count;
        averageScoreVal.innerText = `${avg.toFixed(1)}%`;
        highScoreVal.innerText = highestRaw || `${highest.toFixed(1)}%`;
        
        // Learning Streak Calculation
        const calculateStreak = (attempts) => {
            if (attempts.length === 0) return 0;
            
            // Get unique dates from timestamps (local date format)
            const dates = attempts.map(a => {
                const date = new Date(a.timestamp);
                return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            });
            const uniqueDates = [...new Set(dates)].sort().reverse(); // Decending
            
            const todayStr = (() => {
                const now = new Date();
                return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
            })();
            const yesterdayStr = (() => {
                const yest = new Date();
                yest.setDate(yest.getDate() - 1);
                return `${yest.getFullYear()}-${(yest.getMonth() + 1).toString().padStart(2, '0')}-${yest.getDate().toString().padStart(2, '0')}`;
            })();
            
            // If the last activity wasn't today or yesterday, streak is broken
            if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
                return 0;
            }
            
            let streak = 1;
            for (let i = 0; i < uniqueDates.length - 1; i++) {
                const d1 = new Date(uniqueDates[i]);
                const d2 = new Date(uniqueDates[i + 1]);
                const diffTime = Math.abs(d1 - d2);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    streak++;
                } else if (diffDays > 1) {
                    break;
                }
            }
            return streak;
        };
        
        const currentStreak = calculateStreak(history);
        streakVal.innerHTML = `${currentStreak} Day${currentStreak !== 1 ? 's' : ''} <i class="fas fa-fire" style="color:#f59e0b; margin-left:5px;"></i>`;
        
        // Populate History Table
        historyTableBody.innerHTML = '';
        
        // Sort history by date descending
        const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const displayHistory = sortedHistory.slice(0, 8); // Last 8 attempts
        
        displayHistory.forEach(run => {
            const tr = document.createElement('tr');
            
            // Format Timestamp
            const d = new Date(run.timestamp);
            const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
            
            // Format Subject Breakdown list
            const subList = run.subjects.map(s => {
                const color = s.correct / s.total >= 0.7 ? '#10b981' : s.correct / s.total >= 0.5 ? '#f59e0b' : '#ef4444';
                return `<span class="subj-pill" style="border:1px solid ${color}; color:${color}; padding:2px 6px; border-radius:12px; font-size:0.75rem; display:inline-block; margin:2px; font-weight:600;">${s.name}: ${s.correct}/${s.total}</span>`;
            }).join(' ');
            
            tr.innerHTML = `
                <td style="font-weight: 600; color: #334155;">${dateStr}</td>
                <td><span class="mode-pill ${run.mode}" style="padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; background: #f1f5f9; color: #475569;">${run.mode.toUpperCase()}</span></td>
                <td style="font-weight: bold;">${run.totalMarks}/${run.maxMarks}</td>
                <td>
                    <div style="font-weight: bold; color: ${run.percentage >= 70 ? '#10b981' : run.percentage >= 50 ? '#f59e0b' : '#ef4444'}">${run.percentage.toFixed(1)}%</div>
                </td>
                <td><div style="max-width: 400px; display: flex; flex-wrap: wrap;">${subList}</div></td>
            `;
            historyTableBody.appendChild(tr);
        });
        
        // --- RENDER CHART.JS GRAPHS ---
        
        // Chart 1: Subject average performance
        const subjectScoresMap = {};
        const subjectCountsMap = {};
        
        history.forEach(run => {
            run.subjects.forEach(sub => {
                const pct = (sub.correct / sub.total) * 100;
                if (!subjectScoresMap[sub.name]) {
                    subjectScoresMap[sub.name] = 0;
                    subjectCountsMap[sub.name] = 0;
                }
                subjectScoresMap[sub.name] += pct;
                subjectCountsMap[sub.name]++;
            });
        });
        
        const labels1 = Object.keys(subjectScoresMap);
        const data1 = labels1.map(lbl => subjectScoresMap[lbl] / subjectCountsMap[lbl]);
        
        const ctxBar = document.getElementById('subjectBarChart').getContext('2d');
        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: labels1,
                datasets: [{
                    label: 'Average Score (%)',
                    data: data1,
                    backgroundColor: 'rgba(16, 185, 129, 0.65)',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 1.5,
                    borderRadius: 6,
                    hoverBackgroundColor: 'rgba(16, 185, 129, 0.85)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        ticks: { callback: value => value + '%' }
                    }
                }
            }
        });
        
        // Chart 2: Academic Progress line chart (in chronological order)
        const chronoHistory = [...history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const labels2 = chronoHistory.map((run, idx) => `Attempt ${idx + 1}`);
        const data2 = chronoHistory.map(run => run.percentage);
        
        const ctxLine = document.getElementById('progressLineChart').getContext('2d');
        new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: labels2,
                datasets: [{
                    label: 'Mock Score (%)',
                    data: data2,
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: 'rgb(99, 102, 241)',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        ticks: { callback: value => value + '%' }
                    }
                }
            }
        });
    };
    
    // Run history stats init
    initDashboardHistory();
});
