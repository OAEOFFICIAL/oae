/**
 * OAE Quiz Configuration Module
 * Handles mode selection, subject choices, filters, and quiz initialization.
 */

const QuizConfig = (function() {
  // Subject definitions
  const subjects = [
    { id: 'english', name: 'English', cap: 60, marks: 100 },
    { id: 'mathematics', name: 'Mathematics', cap: 40, marks: 100 },
    { id: 'physics', name: 'Physics', cap: 40, marks: 100 },
    { id: 'chemistry', name: 'Chemistry', cap: 40, marks: 100 },
    { id: 'biology', name: 'Biology', cap: 40, marks: 100 },
    { id: 'economics', name: 'Economics', cap: 40, marks: 100 },
    { id: 'accounting', name: 'Accounting', cap: 40, marks: 100 },
    { id: 'government', name: 'Government', cap: 40, marks: 100 },
    { id: 'literature', name: 'Literature', cap: 40, marks: 100 },
    { id: 'crs', name: 'CRS', cap: 40, marks: 100 },
    { id: 'geography', name: 'Geography', cap: 40, marks: 100 },
    { id: 'history', name: 'History', cap: 40, marks: 100 },
    { id: 'agricultural-science', name: 'Agricultural Science', cap: 40, marks: 100 },
    { id: 'further-mathematics', name: 'Further Mathematics', cap: 40, marks: 100 },
    { id: 'commerce', name: 'Commerce', cap: 40, marks: 100 },
    { id: 'french', name: 'French', cap: 40, marks: 100 },
    { id: 'yoruba', name: 'Yoruba', cap: 40, marks: 100 },
    { id: 'igbo', name: 'Igbo', cap: 40, marks: 100 },
    { id: 'hausa', name: 'Hausa', cap: 40, marks: 100 },
    { id: 'music', name: 'Music', cap: 40, marks: 100 },
    { id: 'fine-arts', name: 'Fine Arts', cap: 40, marks: 100 },
    { id: 'arabic', name: 'Arabic', cap: 40, marks: 100 },
    { id: 'home-economics', name: 'Home Economics', cap: 40, marks: 100 },
    { id: 'physical-health-education', name: 'Physical & Health Education', cap: 40, marks: 100 },
    { id: 'irs', name: 'IRS', cap: 40, marks: 100 }
  ];

  // State
  let currentMode = 'exam';
  let selectedSubjects = new Set(['english']);
  let loader = null;

  // DOM elements
  let subjectContainer, subjectMessage, timeLimitInput;
  let selectedSubjectsText, questionCountDisplay, startBtn;
  let studyFilters, filterSubject, topicFilter, yearFilter;
  let container;

  // Onboarding wizard data
  const levelExams = {
    primary: [
      { id: 'common-entrance', name: 'Common Entrance', desc: 'National Common Entrance Examination practice.' }
    ],
    jss: [
      { id: 'bece', name: 'BECE (Junior WAEC)', desc: 'Basic Education Certificate Examination practice.' }
    ],
    sss: [
      { id: 'jamb', name: 'JAMB UTME', desc: 'Joint Admissions and Matriculation Board CBT mock tests.' },
      { id: 'waec', name: 'WAEC Practice', desc: 'West African Senior School Certificate Examination.' },
      { id: 'neco', name: 'NECO Practice', desc: 'National Examinations Council preparation.' },
      { id: 'gce', name: 'GCE Practice', desc: 'General Certificate of Education external papers.' }
    ],
    higher_admitted: [
      { id: 'semester-exam', name: 'Semester Exams', desc: 'University/Polytechnic semester prep tests.' }
    ],
    higher_seeking: [
      { id: 'post-utme', name: 'Post-UTME', desc: 'University screening and departmental entrance drills.' },
      { id: 'jupeb', name: 'JUPEB', desc: 'Joint Universities Preliminary Examinations Board prep.' },
      { id: 'ijmb', name: 'IJMB', desc: 'Interim Joint Matriculation Board exams.' },
      { id: 'pre-degree', name: 'Pre-Degree', desc: 'Pre-degree and basic studies entrance tests.' }
    ]
  };

  const coursesByDept = {
    science: [
      "Computer Science", "Medicine", "Pharmacy", "Nursing", "Mechanical Engineering",
      "Civil Engineering", "Electrical Engineering", "Chemical Engineering",
      "Biochemistry", "Microbiology", "Dentistry", "Geology", "Mathematics",
      "Physics", "Chemistry", "Biology", "Agricultural Science"
    ],
    arts: [
      "Law", "Mass Communication", "Political Science", "History", "English",
      "Theatre Arts", "Philosophy", "Linguistics", "International Relations",
      "French", "Yoruba", "Igbo", "Hausa", "Music", "Fine Arts", "Arabic Studies"
    ],
    commercial: [
      "Accounting", "Business Administration", "Economics", "Finance",
      "Banking and Finance", "Marketing", "Public Administration", "Commerce"
    ],
    social: [
      "Geography", "Economics", "Political Science", "Sociology", "Psychology",
      "Demography and Social Statistics"
    ],
    vocational: [
      "Home Economics", "Agricultural Science", "Physical and Health Education",
      "Technical Education", "Vocational Studies"
    ]
  };

  const coursesList = [
    ...coursesByDept.science,
    ...coursesByDept.arts,
    ...coursesByDept.commercial
  ];

  let wizardState = {
    level: '',
    status: '', // 'yes' or 'no' for higher
    dept: '',   // 'science', 'arts', 'commercial' for sss
    exam: '',
    course: '',
    mode: ''    // 'exam', 'quiz', 'study' for SSS mode selection
  };

  function initOnboarding() {
    const wizardEl = document.getElementById('onboarding-wizard');
    if (!wizardEl) return;

    // Step 1: Level Select card click
    document.querySelectorAll('#step-1 .wizard-card').forEach(card => {
      card.addEventListener('click', () => {
        const level = card.dataset.level;
        wizardState.level = level;
        wizardState.status = '';
        wizardState.dept = '';
        wizardState.exam = '';
        wizardState.course = '';
        wizardState.mode = '';

        setupStep2();
      });
    });

    // Step 2: Dynamic actions
    function setupStep2() {
      const step2Title = document.getElementById('step-2-title');
      const step2Subtitle = document.getElementById('step-2-subtitle');
      const step2Grid = document.getElementById('step-2-grid');
      step2Grid.innerHTML = '';

      if (wizardState.level === 'primary' || wizardState.level === 'jss') {
        step2Title.textContent = "Choose Your Examination";
        step2Subtitle.textContent = "Select the exam you are preparing for.";
        
        const exams = levelExams[wizardState.level] || [];
        exams.forEach(exam => {
          const cardHtml = `
            <div class="wizard-card" data-exam="${exam.id}">
              <i class="fas ${getExamIcon(exam.id)}"></i>
              <h4>${exam.name}</h4>
              <p>${exam.desc}</p>
            </div>
          `;
          step2Grid.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Event listener for Primary/JSS exam cards
        step2Grid.querySelectorAll('.wizard-card').forEach(card => {
          card.addEventListener('click', () => {
            const examId = card.dataset.exam;
            applyExamSetup(examId);
            finishOnboarding();
          });
        });

      } else if (wizardState.level === 'sss') {
        step2Title.textContent = "Select Department";
        step2Subtitle.textContent = "Choose your high school department.";

        const depts = [
          { id: 'science', name: 'Science', desc: 'Physics, Chemistry, Biology, Mathematics, Further Maths...', icon: 'fa-flask' },
          { id: 'arts', name: 'Arts & Humanities', desc: 'Literature, Government, CRS/IRS, History, Languages...', icon: 'fa-book' },
          { id: 'commercial', name: 'Commercial & Business', desc: 'Economics, Accounts, Commerce, Government...', icon: 'fa-briefcase' },
          { id: 'social', name: 'Social Sciences', desc: 'Geography, Economics, Government, Mathematics...', icon: 'fa-users' },
          { id: 'vocational', name: 'Vocational & Technical', desc: 'Home Economics, Agricultural Science, PHE...', icon: 'fa-tools' }
        ];

        depts.forEach(dept => {
          const cardHtml = `
            <div class="wizard-card" data-dept="${dept.id}">
              <i class="fas ${dept.icon}"></i>
              <h4>${dept.name}</h4>
              <p>${dept.desc}</p>
            </div>
          `;
          step2Grid.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Event listener for JSS/SSS department card click
        step2Grid.querySelectorAll('.wizard-card').forEach(card => {
          card.addEventListener('click', () => {
            wizardState.dept = card.dataset.dept;
            setupStep3();
          });
        });

      } else if (wizardState.level === 'higher') {
        step2Title.textContent = "Admission Status";
        step2Subtitle.textContent = "Are you currently admitted into a Higher Institution?";

        const statuses = [
          { id: 'yes', name: 'Yes, I am admitted', desc: 'Prepare for Semester Exams and courses.', icon: 'fa-university' },
          { id: 'no', name: 'No, seeking admission', desc: 'Prepare for Post-UTME, JUPEB, IJMB, etc.', icon: 'fa-graduation-cap' }
        ];

        statuses.forEach(status => {
          const cardHtml = `
            <div class="wizard-card" data-status="${status.id}">
              <i class="fas ${status.icon}"></i>
              <h4>${status.name}</h4>
              <p>${status.desc}</p>
            </div>
          `;
          step2Grid.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Event listener for status select
        step2Grid.querySelectorAll('.wizard-card').forEach(card => {
          card.addEventListener('click', () => {
            wizardState.status = card.dataset.status;
            setupStep3();
          });
        });
      }

      showWizardStep(2);
    }

    // Step 3: Dynamic actions
    function setupStep3() {
      const step3Title = document.getElementById('step-3-title');
      const step3Subtitle = document.getElementById('step-3-subtitle');
      const step3Grid = document.getElementById('step-3-grid');
      const autocompleteWrap = document.getElementById('step-3-autocomplete-container');
      
      step3Grid.innerHTML = '';
      step3Grid.style.display = 'none';
      autocompleteWrap.style.display = 'none';

      if (wizardState.level === 'sss') {
        step3Title.textContent = "Choose Your Mode";
        step3Subtitle.textContent = "How would you like to practice today?";
        step3Grid.style.display = 'grid';

        const modeOptions = [
          {
            id: 'exam',
            name: 'Exam Mode',
            desc: 'Simulate real CBT exams like JAMB, WAEC & NECO. Strictly timed with 4 subjects \u2014 English is compulsory. Perfect for final preparation.',
            icon: 'fa-clock'
          },
          {
            id: 'quiz',
            name: 'Quiz Mode',
            desc: 'Practice any combination of your subjects with custom timing. Great for quick drills, targeted revision, and building speed.',
            icon: 'fa-gamepad'
          },
          {
            id: 'study',
            name: 'Study Mode',
            desc: 'Browse questions by topic and year at your own pace. No timer pressure \u2014 learn with full explanations and detailed solutions.',
            icon: 'fa-book-open'
          }
        ];

        modeOptions.forEach(mode => {
          const cardHtml = `
            <div class="wizard-card" data-mode="${mode.id}">
              <i class="fas ${mode.icon}"></i>
              <h4>${mode.name}</h4>
              <p>${mode.desc}</p>
            </div>
          `;
          step3Grid.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Event listeners for SSS mode cards
        step3Grid.querySelectorAll('.wizard-card').forEach(card => {
          card.addEventListener('click', () => {
            wizardState.mode = card.dataset.mode;
            setupStep4();
          });
        });

      } else if (wizardState.level === 'higher' && wizardState.status === 'no') {
        step3Title.textContent = "Choose Admission Program";
        step3Subtitle.textContent = "Select the screening or pre-degree program.";
        step3Grid.style.display = 'grid';

        const exams = levelExams.higher_seeking;
        exams.forEach(exam => {
          const cardHtml = `
            <div class="wizard-card" data-exam="${exam.id}">
              <i class="fas ${getExamIcon(exam.id)}"></i>
              <h4>${exam.name}</h4>
              <p>${exam.desc}</p>
            </div>
          `;
          step3Grid.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Event listener
        step3Grid.querySelectorAll('.wizard-card').forEach(card => {
          card.addEventListener('click', () => {
            const examId = card.dataset.exam;
            applyExamSetup(examId);
            finishOnboarding();
          });
        });

      } else if (wizardState.level === 'higher' && wizardState.status === 'yes') {
        step3Title.textContent = "Search Course / Major";
        step3Subtitle.textContent = "Type and select your Higher Institution Course.";
        autocompleteWrap.style.display = 'block';
        
        // Reset course search input
        document.getElementById('wizard-course-search-input').value = '';
        document.getElementById('wizard-course-autocomplete-list').style.display = 'none';
      }

      showWizardStep(3);
    }

    // Step 4: SSS Subjects Selection & Start
    function setupStep4() {
      const step4Title = document.getElementById('step-4-title');
      const step4Subtitle = document.getElementById('step-4-subtitle');
      const step4Grid = document.getElementById('step-4-grid');
      step4Grid.innerHTML = '';

      // Department subjects mapping with icons
      const deptSubjectNames = {
        science: [
          { id: 'english', name: 'English', icon: 'fa-pen-fancy' },
          { id: 'mathematics', name: 'Mathematics', icon: 'fa-calculator' },
          { id: 'physics', name: 'Physics', icon: 'fa-atom' },
          { id: 'chemistry', name: 'Chemistry', icon: 'fa-flask' },
          { id: 'biology', name: 'Biology', icon: 'fa-dna' },
          { id: 'further-mathematics', name: 'Further Mathematics', icon: 'fa-infinity' },
          { id: 'agricultural-science', name: 'Agricultural Science', icon: 'fa-seedling' },
          { id: 'geography', name: 'Geography', icon: 'fa-globe-africa' }
        ],
        arts: [
          { id: 'english', name: 'English', icon: 'fa-pen-fancy' },
          { id: 'literature', name: 'Literature', icon: 'fa-feather-alt' },
          { id: 'government', name: 'Government', icon: 'fa-landmark' },
          { id: 'crs', name: 'CRS', icon: 'fa-cross' },
          { id: 'irs', name: 'IRS', icon: 'fa-star-and-crescent' },
          { id: 'history', name: 'History', icon: 'fa-monument' },
          { id: 'french', name: 'French', icon: 'fa-language' },
          { id: 'yoruba', name: 'Yoruba', icon: 'fa-globe' },
          { id: 'igbo', name: 'Igbo', icon: 'fa-globe' },
          { id: 'hausa', name: 'Hausa', icon: 'fa-globe' },
          { id: 'music', name: 'Music', icon: 'fa-music' },
          { id: 'fine-arts', name: 'Fine Arts', icon: 'fa-palette' },
          { id: 'arabic', name: 'Arabic', icon: 'fa-book-open-reader' }
        ],
        commercial: [
          { id: 'english', name: 'English', icon: 'fa-pen-fancy' },
          { id: 'mathematics', name: 'Mathematics', icon: 'fa-calculator' },
          { id: 'economics', name: 'Economics', icon: 'fa-chart-line' },
          { id: 'accounting', name: 'Accounting', icon: 'fa-file-invoice-dollar' },
          { id: 'commerce', name: 'Commerce', icon: 'fa-store' },
          { id: 'government', name: 'Government', icon: 'fa-landmark' }
        ],
        social: [
          { id: 'english', name: 'English', icon: 'fa-pen-fancy' },
          { id: 'mathematics', name: 'Mathematics', icon: 'fa-calculator' },
          { id: 'economics', name: 'Economics', icon: 'fa-chart-line' },
          { id: 'geography', name: 'Geography', icon: 'fa-globe-africa' },
          { id: 'government', name: 'Government', icon: 'fa-landmark' }
        ],
        vocational: [
          { id: 'english', name: 'English', icon: 'fa-pen-fancy' },
          { id: 'mathematics', name: 'Mathematics', icon: 'fa-calculator' },
          { id: 'agricultural-science', name: 'Agricultural Science', icon: 'fa-seedling' },
          { id: 'home-economics', name: 'Home Economics', icon: 'fa-home' },
          { id: 'physical-health-education', name: 'P.H.E.', icon: 'fa-running' }
        ]
      };

      const deptLabel = wizardState.dept.charAt(0).toUpperCase() + wizardState.dept.slice(1);
      const modeLabel = wizardState.mode === 'exam' ? 'Exam Simulation' : wizardState.mode === 'quiz' ? 'Quiz Practice' : 'Study Session';

      step4Title.textContent = `Select ${deptLabel} Subjects`;

      const subjs = deptSubjectNames[wizardState.dept] || [];
      const localSelected = new Set();
      
      // By default, select all subjects in the department (except if in exam mode and it exceeds 4, select first 4)
      if (wizardState.mode === 'exam') {
        subjs.forEach((subj, idx) => {
          if (subj.id === 'english' || localSelected.size < 4) {
            localSelected.add(subj.id);
          }
        });
      } else {
        subjs.forEach(subj => localSelected.add(subj.id));
      }

      // Add status message container below grid later
      const statusMsgId = 'step-4-status-msg';

      function renderCards() {
        step4Grid.innerHTML = '';
        subjs.forEach(subj => {
          const isSelected = localSelected.has(subj.id);
          const isCompulsory = (wizardState.mode === 'exam' && subj.id === 'english');
          
          let badgeHtml = '';
          if (isCompulsory) {
            badgeHtml = `<span style="font-size: 0.75rem; background: var(--green); color: white; padding: 2px 8px; border-radius: 12px; margin-top: 4px; font-weight: bold;">Compulsory</span>`;
          } else if (isSelected) {
            badgeHtml = `<span style="font-size: 0.75rem; background: rgba(10,138,47,0.1); color: var(--green); padding: 2px 8px; border-radius: 12px; margin-top: 4px; font-weight: bold;"><i class="fas fa-check"></i> Selected</span>`;
          } else {
            badgeHtml = `<span style="font-size: 0.75rem; background: rgba(0,0,0,0.05); color: var(--muted); padding: 2px 8px; border-radius: 12px; margin-top: 4px;">Tap to select</span>`;
          }

          const card = document.createElement('div');
          card.className = `wizard-card${isSelected ? ' selected' : ''}${isCompulsory ? ' compulsory' : ''}`;
          if (isCompulsory) {
            card.style.cursor = 'default';
          }
          
          card.innerHTML = `
            <i class="fas ${subj.icon}"></i>
            <h4>${subj.name}</h4>
            ${badgeHtml}
          `;

          if (!isCompulsory) {
            card.addEventListener('click', () => {
              if (localSelected.has(subj.id)) {
                localSelected.delete(subj.id);
              } else {
                if (wizardState.mode === 'exam' && localSelected.size >= 4) {
                  alert('Exam mode allows exactly 4 subjects. Deselect one first.');
                  return;
                }
                localSelected.add(subj.id);
              }
              renderCards();
              updateStatus();
            });
          }

          step4Grid.appendChild(card);
        });

        // Add status text and Let's Go button
        const containerDiv = document.createElement('div');
        containerDiv.style.gridColumn = '1 / -1';
        containerDiv.style.textAlign = 'center';
        containerDiv.style.marginTop = '24px';
        containerDiv.style.display = 'flex';
        containerDiv.style.flexDirection = 'column';
        containerDiv.style.alignItems = 'center';
        containerDiv.style.gap = '16px';

        const statusMsg = document.createElement('p');
        statusMsg.id = statusMsgId;
        statusMsg.style.fontWeight = '600';
        statusMsg.style.fontSize = '1.05rem';
        statusMsg.style.margin = '0';
        containerDiv.appendChild(statusMsg);

        const startBtn = document.createElement('button');
        startBtn.className = 'btn-primary';
        startBtn.id = 'wizard-start-btn';
        startBtn.style.padding = '18px 60px';
        startBtn.style.fontSize = '1.2rem';
        startBtn.style.borderRadius = '20px';
        startBtn.innerHTML = `<i class="fas fa-rocket"></i> Let's Go!`;
        containerDiv.appendChild(startBtn);

        step4Grid.appendChild(containerDiv);

        startBtn.addEventListener('click', () => {
          // Verify constraints before proceeding
          if (wizardState.mode === 'exam' && localSelected.size !== 4) {
            alert('Please select exactly 4 subjects (including English) for Exam Mode.');
            return;
          }
          if (localSelected.size === 0) {
            alert('Please select at least 1 subject.');
            return;
          }

          // Apply selected subjects
          selectedSubjects.clear();
          localSelected.forEach(id => selectedSubjects.add(id));

          // Set mode and update UI
          currentMode = wizardState.mode;
          document.querySelectorAll('.mode-card').forEach(card => {
            card.classList.toggle('active', card.dataset.mode === currentMode);
          });
          
          updateUIForMode();
          finishOnboarding();
        });

        updateStatus();
      }

      function updateStatus() {
        const statusMsg = document.getElementById(statusMsgId);
        const startBtn = document.getElementById('wizard-start-btn');
        if (!statusMsg || !startBtn) return;

        if (wizardState.mode === 'exam') {
          const count = localSelected.size;
          statusMsg.textContent = `Exam Mode requires English + exactly 3 other subjects. Selected: ${count} of 4.`;
          if (count === 4) {
            statusMsg.style.color = 'var(--green)';
            startBtn.disabled = false;
            startBtn.style.opacity = '1';
            startBtn.style.cursor = 'pointer';
          } else {
            statusMsg.style.color = '#e53935'; // Premium Red
            startBtn.disabled = true;
            startBtn.style.opacity = '0.5';
            startBtn.style.cursor = 'not-allowed';
          }
        } else {
          const count = localSelected.size;
          statusMsg.textContent = `Practice the subjects you intend to study. Selected: ${count} subject${count !== 1 ? 's' : ''}.`;
          if (count > 0) {
            statusMsg.style.color = 'var(--green)';
            startBtn.disabled = false;
            startBtn.style.opacity = '1';
            startBtn.style.cursor = 'pointer';
          } else {
            statusMsg.style.color = '#e53935';
            startBtn.disabled = true;
            startBtn.style.opacity = '0.5';
            startBtn.style.cursor = 'not-allowed';
          }
        }
      }

      step4Subtitle.textContent = `Choose the subjects you intend to write or practice.`;
      renderCards();
      showWizardStep(4);
    }

    // Back buttons
    document.getElementById('wizard-back-2').addEventListener('click', () => showWizardStep(1));
    document.getElementById('wizard-back-3').addEventListener('click', () => showWizardStep(2));
    document.getElementById('wizard-back-4').addEventListener('click', () => showWizardStep(3));

    // Skip buttons
    document.querySelectorAll('.wizard-skip').forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle manual personalization form
        document.getElementById('onboarding-wizard').style.display = 'none';
        document.getElementById('manual-personalization-form').style.display = 'block';
      });
    });

    // Initialize Autocomplete course search for wizard
    initWizardCourseAutocomplete();
  }

  function getExamIcon(examId) {
    switch (examId) {
      case 'common-entrance': return 'fa-child';
      case 'bece': return 'fa-school';
      case 'jamb': return 'fa-laptop-code';
      case 'waec': return 'fa-certificate';
      case 'neco': return 'fa-award';
      case 'gce': return 'fa-file-alt';
      case 'post-utme': return 'fa-university';
      case 'jupeb': return 'fa-book-reader';
      case 'ijmb': return 'fa-user-graduate';
      case 'pre-degree': return 'fa-clipboard-list';
      case 'semester-exam': return 'fa-book-open';
      default: return 'fa-graduation-cap';
    }
  }

  function showWizardStep(stepNum) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
    
    // Show active step
    document.getElementById(`step-${stepNum}`).classList.add('active');
    
    // Dynamic progress bar steps
    const progress4 = document.getElementById('progress-step-4');
    let maxSteps = 3;
    if (wizardState.level === 'sss') {
      maxSteps = 4;
      if (progress4) progress4.style.display = 'flex';
    } else if (wizardState.level === 'primary' || wizardState.level === 'jss') {
      maxSteps = 2;
      if (progress4) progress4.style.display = 'none';
    } else {
      maxSteps = 3;
      if (progress4) progress4.style.display = 'none';
    }

    document.querySelectorAll('.progress-step').forEach(step => {
      const stepVal = parseInt(step.dataset.step);
      step.classList.toggle('active', stepVal === stepNum);
      step.classList.toggle('completed', stepVal < stepNum);
      
      if (stepVal > maxSteps) {
        step.style.display = 'none';
      } else if (stepVal !== 4) {
        step.style.display = 'flex';
      }
    });

    const progressPercent = ((stepNum - 1) / (maxSteps - 1)) * 100;
    document.getElementById('wizard-progress-bar').style.width = `${progressPercent}%`;
  }

  function finishOnboarding() {
    document.getElementById('onboarding-wizard').style.display = 'none';
    document.querySelector('.quiz-wrap').style.display = 'block';
    // Automatically start the quiz after onboarding
    startQuiz();
  }

  function initWizardCourseAutocomplete() {
    const input = document.getElementById('wizard-course-search-input');
    const list = document.getElementById('wizard-course-autocomplete-list');
    if (!input || !list) return;

    input.addEventListener('input', () => {
      const val = input.value.trim().toLowerCase();
      list.innerHTML = '';
      if (!val) {
        list.style.display = 'none';
        return;
      }

      const matches = coursesList.filter(c => c.toLowerCase().includes(val));
      if (matches.length === 0) {
        list.style.display = 'none';
        return;
      }

      matches.forEach(match => {
        const li = document.createElement('li');
        li.className = 'autocomplete-item';
        li.textContent = match;
        li.addEventListener('click', () => {
          input.value = match;
          list.style.display = 'none';
          
          applyExamSetup('semester-exam'); // Higher admitted prep setup
          selectCourse(match);
        });
        list.appendChild(li);
      });
      list.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#step-3-autocomplete-container')) {
        list.style.display = 'none';
      }
    });
  }

  function selectCourse(courseName, keepConfigOpen = false) {
    wizardState.course = courseName;
    
    const scienceCourses = coursesByDept.science.map(c => c.toLowerCase());
    const artCourses = coursesByDept.arts.map(c => c.toLowerCase());
    
    const lowerCourse = courseName.toLowerCase();
    selectedSubjects.clear();
    
    if (scienceCourses.includes(lowerCourse)) {
      selectedSubjects.add('english');
      selectedSubjects.add('mathematics');
      selectedSubjects.add('physics');
      selectedSubjects.add('chemistry');
      selectedSubjects.add('biology');
      currentMode = 'quiz';
    } else if (artCourses.includes(lowerCourse)) {
      selectedSubjects.add('english');
      selectedSubjects.add('literature');
      selectedSubjects.add('government');
      selectedSubjects.add('crs');
      currentMode = 'quiz';
    } else {
      // Commercial courses
      selectedSubjects.add('english');
      selectedSubjects.add('mathematics');
      selectedSubjects.add('economics');
      selectedSubjects.add('accounting');
      currentMode = 'quiz';
    }
    
    // Select correct mode card styling
    document.querySelectorAll('.mode-card').forEach(card => {
      card.classList.toggle('active', card.dataset.mode === currentMode);
    });
    
    updateUIForMode();
    if (!keepConfigOpen) {
      finishOnboarding();
    }
  }

  function applyDepartmentSetup(dept) {
    selectedSubjects.clear();
    if (dept === 'science') {
      selectedSubjects.add('english');
      selectedSubjects.add('mathematics');
      selectedSubjects.add('physics');
      selectedSubjects.add('chemistry');
      selectedSubjects.add('biology');
      currentMode = 'exam';
    } else if (dept === 'arts') {
      selectedSubjects.add('english');
      selectedSubjects.add('literature');
      selectedSubjects.add('government');
      selectedSubjects.add('crs');
      currentMode = 'exam';
    } else if (dept === 'commercial') {
      selectedSubjects.add('english');
      selectedSubjects.add('mathematics');
      selectedSubjects.add('economics');
      selectedSubjects.add('accounting');
      currentMode = 'exam';
    } else if (dept === 'social') {
      selectedSubjects.add('english');
      selectedSubjects.add('mathematics');
      selectedSubjects.add('economics');
      selectedSubjects.add('geography');
      currentMode = 'exam';
    } else if (dept === 'vocational') {
      selectedSubjects.add('english');
      selectedSubjects.add('mathematics');
      selectedSubjects.add('agricultural-science');
      selectedSubjects.add('home-economics');
      currentMode = 'exam';
    }

    // Select correct mode card styling
    document.querySelectorAll('.mode-card').forEach(card => {
      card.classList.toggle('active', card.dataset.mode === currentMode);
    });
    
    updateUIForMode();
  }

  function applyExamSetup(examId) {
    selectedSubjects.clear();
    const lowerExam = examId.toLowerCase();
    if (lowerExam === 'jamb') {
      currentMode = 'exam';
      selectedSubjects.add('english');
      selectedSubjects.add('mathematics');
      selectedSubjects.add('physics');
      selectedSubjects.add('chemistry');
    } else if (lowerExam === 'waec' || lowerExam === 'neco' || lowerExam === 'gce') {
      currentMode = 'exam';
      selectedSubjects.add('english');
      selectedSubjects.add('mathematics');
      selectedSubjects.add('biology');
      selectedSubjects.add('chemistry');
    } else if (lowerExam === 'post-utme' || lowerExam === 'jupeb' || lowerExam === 'ijmb' || lowerExam === 'pre-degree') {
      // Seeking admission higher program defaults
      currentMode = 'quiz';
      selectedSubjects.add('english');
      selectedSubjects.add('mathematics');
    } else {
      currentMode = 'quiz';
      selectedSubjects.add('english');
      selectedSubjects.add('mathematics');
    }

    // Select correct mode card styling
    document.querySelectorAll('.mode-card').forEach(card => {
      card.classList.toggle('active', card.dataset.mode === currentMode);
    });
    
    updateUIForMode();
  }

  function initManualPersonalizationForm() {
    const formContainer = document.getElementById('manual-personalization-form');
    if (!formContainer) return;

    const levelSelect = document.getElementById('form-level-select');
    const statusGroup = document.getElementById('form-status-group');
    const statusSelect = document.getElementById('form-status-select');
    const deptGroup = document.getElementById('form-dept-group');
    const deptSelect = document.getElementById('form-dept-select');
    const examGroup = document.getElementById('form-exam-group');
    const examSelect = document.getElementById('form-exam-select');
    const courseGroup = document.getElementById('form-course-group');
    const courseInput = document.getElementById('form-course-input');
    const courseList = document.getElementById('form-course-autocomplete-list');
    const submitBtn = document.getElementById('form-submit-btn');

    // Reset everything
    function resetFormState() {
      statusGroup.style.display = 'none';
      statusSelect.value = '';
      deptGroup.style.display = 'none';
      deptSelect.value = '';
      examGroup.style.display = 'none';
      examSelect.innerHTML = '<option value="">Select Exam</option>';
      courseGroup.style.display = 'none';
      courseInput.value = '';
      courseList.style.display = 'none';
      submitBtn.disabled = true;
    }

    levelSelect.addEventListener('change', () => {
      const level = levelSelect.value;
      resetFormState();
      if (!level) return;

      if (level === 'primary' || level === 'jss') {
        examGroup.style.display = 'block';
        const exams = levelExams[level] || [];
        exams.forEach(exam => {
          const opt = document.createElement('option');
          opt.value = exam.id;
          opt.textContent = exam.name;
          examSelect.appendChild(opt);
        });
      } else if (level === 'sss') {
        deptGroup.style.display = 'block';
        examGroup.style.display = 'block';
        
        const exams = levelExams.sss;
        exams.forEach(exam => {
          const opt = document.createElement('option');
          opt.value = exam.id;
          opt.textContent = exam.name;
          examSelect.appendChild(opt);
        });
      } else if (level === 'higher') {
        statusGroup.style.display = 'block';
      }
      validateForm();
    });

    statusSelect.addEventListener('change', () => {
      const status = statusSelect.value;
      examGroup.style.display = 'none';
      examSelect.innerHTML = '<option value="">Select Exam</option>';
      courseGroup.style.display = 'none';
      courseInput.value = '';
      courseList.style.display = 'none';

      if (status === 'yes') {
        courseGroup.style.display = 'block';
      } else if (status === 'no') {
        examGroup.style.display = 'block';
        const exams = levelExams.higher_seeking;
        exams.forEach(exam => {
          const opt = document.createElement('option');
          opt.value = exam.id;
          opt.textContent = exam.name;
          examSelect.appendChild(opt);
        });
      }
      validateForm();
    });

    deptSelect.addEventListener('change', () => {
      courseInput.value = '';
      courseList.style.display = 'none';
      validateForm();
    });

    examSelect.addEventListener('change', validateForm);

    courseInput.addEventListener('input', () => {
      const val = courseInput.value.trim().toLowerCase();
      courseList.innerHTML = '';
      if (!val) {
        courseList.style.display = 'none';
        validateForm();
        return;
      }

      let listSource = coursesList;
      if (levelSelect.value === 'sss' && deptSelect.value) {
        listSource = coursesByDept[deptSelect.value] || [];
      }

      const matches = listSource.filter(c => c.toLowerCase().includes(val));
      if (matches.length === 0) {
        courseList.style.display = 'none';
        validateForm();
        return;
      }

      matches.forEach(match => {
        const li = document.createElement('li');
        li.className = 'autocomplete-item';
        li.textContent = match;
        li.addEventListener('click', () => {
          courseInput.value = match;
          courseList.style.display = 'none';
          validateForm();
        });
        courseList.appendChild(li);
      });
      courseList.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#manual-personalization-form .autocomplete-container')) {
        courseList.style.display = 'none';
      }
    });

    function validateForm() {
      const level = levelSelect.value;
      if (!level) {
        submitBtn.disabled = true;
        return;
      }

      if (level === 'primary' || level === 'jss') {
        submitBtn.disabled = !examSelect.value;
      } else if (level === 'sss') {
        const hasDept = deptSelect.value;
        const hasExam = examSelect.value;
        submitBtn.disabled = !(hasDept && hasExam);
      } else if (level === 'higher') {
        const status = statusSelect.value;
        if (!status) {
          submitBtn.disabled = true;
        } else if (status === 'yes') {
          const hasCourse = courseInput.value && coursesList.map(c => c.toLowerCase()).includes(courseInput.value.trim().toLowerCase());
          submitBtn.disabled = !hasCourse;
        } else if (status === 'no') {
          submitBtn.disabled = !examSelect.value;
        }
      }
    }

    submitBtn.addEventListener('click', () => {
      const level = levelSelect.value;
      if (level === 'primary' || level === 'jss') {
        applyExamSetup(examSelect.value);
      } else if (level === 'sss') {
        const examId = examSelect.value;
        const dept = deptSelect.value;
        applyExamSetup(examId);
        applyDepartmentSetup(dept);
      } else if (level === 'higher') {
        const status = statusSelect.value;
        if (status === 'yes') {
          applyExamSetup('semester-exam');
          selectCourse(courseInput.value.trim(), true);
        } else {
          applyExamSetup(examSelect.value);
        }
      }
      formContainer.style.display = 'none';
      document.querySelector('.quiz-wrap').style.display = 'block';
    });

    document.getElementById('form-back-to-wizard').addEventListener('click', () => {
      formContainer.style.display = 'none';
      document.getElementById('onboarding-wizard').style.display = 'block';
      showWizardStep(1);
    });
  }

  // Initialize the module
  function init() {
    loader = new QuizDataLoader();
    
    // Get DOM references
    subjectContainer = document.getElementById('subject-container');
    subjectMessage = document.getElementById('subject-message');
    timeLimitInput = document.getElementById('time-limit');
    selectedSubjectsText = document.getElementById('selected-subjects-text');
    questionCountDisplay = document.getElementById('question-count-display');
    startBtn = document.getElementById('start-quiz-btn');
    container = document.getElementById('quiz-container');
    studyFilters = document.getElementById('study-filters');
    filterSubject = document.getElementById('filter-subject');
    topicFilter = document.getElementById('topic-filter');
    yearFilter = document.getElementById('year-filter');

    // Attach event listeners
    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => switchMode(card.dataset.mode));
    });

    filterSubject.addEventListener('change', () => {
      loadFiltersForSubject(filterSubject.value);
    });

    startBtn.addEventListener('click', startQuiz);

    // Initialize manual form
    initManualPersonalizationForm();

    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const subjectParam = urlParams.get('subject');
    const topicParam = urlParams.get('topic');
    const yearParam = urlParams.get('year');
    const modeParam = urlParams.get('mode');
    const examParam = urlParams.get('exam');

    let showWizard = true;
    if (subjectParam || topicParam || yearParam || modeParam || examParam) {
      showWizard = false;
    }

    if (showWizard && document.getElementById('onboarding-wizard')) {
      document.getElementById('onboarding-wizard').style.display = 'block';
      document.getElementById('manual-personalization-form').style.display = 'none';
      document.querySelector('.quiz-wrap').style.display = 'none';
      initOnboarding();
    } else {
      if (document.getElementById('onboarding-wizard')) {
        document.getElementById('onboarding-wizard').style.display = 'none';
      }
      if (document.getElementById('manual-personalization-form')) {
        document.getElementById('manual-personalization-form').style.display = 'none';
      }
      document.querySelector('.quiz-wrap').style.display = 'block';

      // Process parameter redirection
      if (examParam) {
        applyExamSetup(examParam);
      } else if (subjectParam) {
        const matchedSubject = subjects.find(s => s.id.toLowerCase() === subjectParam.toLowerCase() || s.name.toLowerCase() === subjectParam.toLowerCase());
        if (matchedSubject) {
          selectedSubjects.clear();
          selectedSubjects.add(matchedSubject.id);
          
          if (modeParam && ['exam', 'quiz', 'study'].includes(modeParam.toLowerCase())) {
            currentMode = modeParam.toLowerCase();
          } else if (topicParam || yearParam) {
            currentMode = 'study';
          } else {
            currentMode = 'quiz';
          }
        }
      }
    }

    // Initial render
    updateUIForMode();

    // Ensure correct mode card has active styling
    document.querySelectorAll('.mode-card').forEach(card => {
      card.classList.toggle('active', card.dataset.mode === currentMode);
    });

    if (subjectParam && currentMode === 'study') {
      filterSubject.value = subjectParam;
      loadFiltersForSubject(subjectParam, topicParam, yearParam);
    }

    // Check for saved session
    checkSavedSession();
  }

  function checkSavedSession() {
    try {
      const saved = localStorage.getItem('oae_quiz_state');
      if (saved) {
        if (confirm('You have an unfinished quiz session. Would you like to resume?')) {
          resumeSession();
        } else {
          localStorage.removeItem('oae_quiz_state');
        }
      }
    } catch (e) { console.warn(e); }
  }

  function resumeSession() {
    container.innerHTML = `<div style="text-align:center;padding:40px;"><i class="fas fa-spinner fa-spin"></i> Resuming your quiz...</div>`;
    
    setTimeout(() => {
      try {
        const engine = SimpleQuizEngine.loadState();
        if (!engine) throw new Error("Could not restore saved state.");

        window.QuizConfig = window.QuizConfig || {};
        window.QuizConfig.subjects = subjects;
        window.QuizConfig.currentMode = engine.config.mode;
        window.QuizConfig.showExplanations = engine.config.showExplanations || false;

        engine.startTimer();
        
        // Hide config UI for immersive mode
        const nav = document.querySelector('.quiz-navbar');
        const footer = document.querySelector('footer');
        const header = document.querySelector('.quiz-header');
        const cards = document.querySelectorAll('.config-card');
        const summary = document.querySelector('.summary-bar');
        
        if (nav) nav.style.display = 'none';
        if (footer) footer.style.display = 'none';
        if (header) header.style.display = 'none';
        if (summary) summary.style.display = 'none';
        cards.forEach(c => c.style.display = 'none');
        window.scrollTo(0, 0);

        if (typeof QuizRenderer !== 'undefined') {
          QuizRenderer.render(engine, container, {
            mode: engine.config.mode,
            showExplanations: window.QuizConfig.showExplanations
          });
        }
      } catch (e) {
        console.error(e);
        container.innerHTML = `<div style="color:red;padding:20px;"><i class="fas fa-exclamation-triangle"></i> Error resuming quiz: ${e.message}</div>`;
      }
    }, 500);
  }

  function switchMode(mode) {
    currentMode = mode;
    
    // Update active card styling
    document.querySelectorAll('.mode-card').forEach(card => {
      card.classList.toggle('active', card.dataset.mode === mode);
    });

    if (mode === 'exam') {
      selectedSubjects.add('english');
    }

    updateUIForMode();
  }

  function updateUIForMode() {
    if (currentMode === 'exam') {
      timeLimitInput.value = 105;
      timeLimitInput.disabled = true;
      subjectMessage.textContent = 'English is required. Select exactly 3 more subjects.';
      studyFilters.style.display = 'none';
    } else if (currentMode === 'quiz') {
      timeLimitInput.disabled = false;
      timeLimitInput.value = 30;
      subjectMessage.textContent = 'Select any combination of subjects.';
      studyFilters.style.display = 'none';
    } else {
      timeLimitInput.disabled = false;
      timeLimitInput.value = 30;
      subjectMessage.textContent = 'Select subjects and optionally filter by topic/year.';
      studyFilters.style.display = 'block';
      updateFilterSubjectDropdown();
    }
    
    renderSubjects();
    updateSummary();
  }

  function updateFilterSubjectDropdown() {
    filterSubject.innerHTML = '<option value="">Select subject first</option>';
    Array.from(selectedSubjects).forEach(subjId => {
      const subj = subjects.find(s => s.id === subjId);
      filterSubject.add(new Option(subj.name, subjId));
    });
  }

  async function loadFiltersForSubject(subjId, targetTopic = '', targetYear = '') {
    if (!subjId) {
      topicFilter.disabled = true;
      yearFilter.disabled = true;
      topicFilter.innerHTML = '<option value="">All Topics</option>';
      yearFilter.innerHTML = '<option value="">All Years</option>';
      return;
    }

    topicFilter.disabled = false;
    yearFilter.disabled = false;

    try {
      const raw = await loader.loadSubject(subjId);
      let questions = Array.isArray(raw) ? raw : (raw.questions || []);

      // Extract categories from topics (split by " - ")
      const topics = new Set();
      questions.forEach(q => {
        if (q.topic) {
          const category = q.topic.split(' - ')[0].trim();
          topics.add(category);
        }
      });

      topicFilter.innerHTML = '<option value="">All Topics</option>';
      Array.from(topics).sort().forEach(t => topicFilter.add(new Option(t, t)));

      const years = [...new Set(questions.map(q => q.year).filter(y => y))];
      yearFilter.innerHTML = '<option value="">All Years</option>';
      years.sort((a, b) => b - a).forEach(y => yearFilter.add(new Option(y, y)));

      if (targetTopic) {
        const matchedOpt = Array.from(topicFilter.options).find(opt => opt.value.toLowerCase() === targetTopic.toLowerCase() || opt.value.toLowerCase().startsWith(targetTopic.toLowerCase()));
        if (matchedOpt) {
          topicFilter.value = matchedOpt.value;
        }
      }
      if (targetYear) {
        const matchedYrOpt = Array.from(yearFilter.options).find(opt => opt.value == targetYear);
        if (matchedYrOpt) {
          yearFilter.value = matchedYrOpt.value;
        }
      }
    } catch (e) {
      console.warn('Could not load filters', e);
    }
  }

  function renderSubjects() {
    subjectContainer.innerHTML = '';
    const selectedArray = Array.from(selectedSubjects);

    subjects.forEach(subj => {
      const isEnglishExam = (currentMode === 'exam' && subj.id === 'english');
      const isDisabled = (currentMode === 'exam' && !isEnglishExam && selectedArray.length >= 4 && !selectedSubjects.has(subj.id));

      const card = document.createElement('div');
      card.className = 'subject-card' + (selectedSubjects.has(subj.id) ? ' selected' : '') + (isDisabled ? ' disabled' : '');
      card.innerHTML = `<i class="fas fa-book"></i> ${subj.name} (${subj.cap} Qs)`;

      card.addEventListener('click', () => {
        if (isDisabled) return;
        if (isEnglishExam) return;

        if (selectedSubjects.has(subj.id)) {
          selectedSubjects.delete(subj.id);
        } else {
          if (currentMode === 'exam' && selectedSubjects.size >= 4) {
            alert('Exam mode allows maximum 4 subjects.');
            return;
          }
          selectedSubjects.add(subj.id);
        }

        renderSubjects();
        updateSummary();
        if (currentMode === 'study') {
          updateFilterSubjectDropdown();
        }
      });

      subjectContainer.appendChild(card);
    });
  }

  function updateSummary() {
    const selectedArray = Array.from(selectedSubjects);
    let totalQ = 0;
    selectedArray.forEach(id => {
      const subj = subjects.find(s => s.id === id);
      if (subj) totalQ += subj.cap;
    });

    const names = selectedArray.map(id => subjects.find(s => s.id === id).name).join(', ');
    selectedSubjectsText.textContent = names || 'None';
    questionCountDisplay.textContent = `${totalQ} questions`;
  }

  async function startQuiz() {
    const selected = Array.from(selectedSubjects);
    if (selected.length === 0) return alert('Select at least one subject.');
    if (currentMode === 'exam' && selected.length !== 4) {
      return alert('Exam mode requires exactly 4 subjects (English + 3 others).');
    }

    container.innerHTML = `<div style="text-align:center;padding:40px;"><i class="fas fa-spinner fa-spin"></i> Loading questions...</div>`;

    const timeLimit = parseInt(timeLimitInput.value);
    const shuffle = document.getElementById('shuffle-options').checked;
    const showExplanations = document.getElementById('show-explanations').checked;

    try {
      const questionsBySubject = {};

      for (const subjId of selected) {
        const raw = await loader.loadSubject(subjId);
        const cap = subjects.find(s => s.id === subjId).cap;

        let questions = Array.isArray(raw) ? raw : (raw.questions || []);

        // Apply study mode filters
        if (currentMode === 'study') {
          const filterSubj = filterSubject.value;
          const filterTopic = topicFilter.value;
          const filterYear = yearFilter.value;

          if (filterSubj && filterSubj === subjId) {
            if (filterTopic) {
              questions = questions.filter(q => q.topic && q.topic.startsWith(filterTopic));
            }
            if (filterYear) {
              questions = questions.filter(q => q.year == filterYear);
            }
          }
        }

        // Ensure valid questions
        questions = questions.filter(q => q.options && Array.isArray(q.options));

        // Cap questions
        while (questions.length > cap) {
          const idx = Math.floor(Math.random() * questions.length);
          questions.splice(idx, 1);
        }

        // Shuffle options if requested
        questions = questions.map((q, i) => {
          const opts = [...q.options];
          const correct = opts[q.answer];
          if (shuffle) {
            for (let j = opts.length - 1; j > 0; j--) {
              const k = Math.floor(Math.random() * (j + 1));
              [opts[j], opts[k]] = [opts[k], opts[j]];
            }
          }
          return {
            ...q,
            options: opts,
            answer: opts.indexOf(correct),
            questionNumber: i + 1,
            subject: subjId
          };
        });

        questionsBySubject[subjId] = questions;
      }

      // Create engine and start
      const engine = new SimpleQuizEngine({
        mode: currentMode,
        timeLimit: timeLimit
      });
      engine.questionsBySubject = questionsBySubject;
      engine.currentSubject = Object.keys(questionsBySubject)[0];

      // Store subjects metadata globally for scoring
      window.QuizConfig = window.QuizConfig || {};
      window.QuizConfig.subjects = subjects;
      window.QuizConfig.currentMode = currentMode;
      window.QuizConfig.showExplanations = showExplanations;

      // Start timer and render
      engine.startTimer();

      // Enhance CBT Experience: Enter Distraction-Free Fullscreen Mode
      try {
        const nav = document.querySelector('.quiz-navbar');
        const footer = document.querySelector('footer');
        const header = document.querySelector('.quiz-header');
        const cards = document.querySelectorAll('.config-card');
        const summary = document.querySelector('.summary-bar');
        
        if (nav) nav.style.display = 'none';
        if (footer) footer.style.display = 'none';
        if (header) header.style.display = 'none';
        if (summary) summary.style.display = 'none';
        cards.forEach(c => c.style.display = 'none');
        
        window.scrollTo(0, 0);

        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(err => console.log('Fullscreen API: ' + err.message));
        }
      } catch (e) { console.warn('Could not enter fullscreen mode', e); }
      
      // Use renderer (defined in quiz-render.js)
      if (typeof QuizRenderer !== 'undefined') {
        QuizRenderer.render(engine, container, {
          mode: currentMode,
          showExplanations: showExplanations
        });
      } else {
        throw new Error('QuizRenderer module not loaded');
      }

    } catch (e) {
      console.error(e);
      container.innerHTML = `<div style="color:red;padding:20px;"><i class="fas fa-exclamation-triangle"></i> Error: ${e.message}</div>`;
    }
  }

  // Public API
  return {
    init,
    subjects,
    getCurrentMode: () => currentMode,
    getSelectedSubjects: () => Array.from(selectedSubjects)
  };
})();