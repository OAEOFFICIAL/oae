import re

filepath = r"c:\Users\USER\Documents\OAE\Assets\js\quiz-config.js"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the old function block to find
# We can find it by looking for "function setupStep4() {" and matching till "showWizardStep(4);\n    }"
start_marker = "    // Step 4: SSS Subjects Preview & Start\n    function setupStep4() {"
# If not found, let's look for CRLF version
if start_marker not in content:
    start_marker = "    // Step 4: SSS Subjects Preview & Start\r\n    function setupStep4() {"

start_index = content.find(start_marker)
if start_index == -1:
    print("Error: Could not find setupStep4 start marker!")
    exit(1)

# Find the end of the function. It ends with:
#       showWizardStep(4);
#     }
# Let's search for showWizardStep(4);
end_marker = "showWizardStep(4);\n    }"
if end_marker not in content:
    end_marker = "showWizardStep(4);\r\n    }"

end_index = content.find(end_marker, start_index)
if end_index == -1:
    print("Error: Could not find setupStep4 end marker!")
    exit(1)

end_index += len(end_marker)

# Replace the block with the new implementation
new_setupStep4 = """    // Step 4: SSS Subjects Selection & Start
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
          { id: 'biology', name: 'Biology', icon: 'fa-dna' }
        ],
        arts: [
          { id: 'english', name: 'English', icon: 'fa-pen-fancy' },
          { id: 'literature', name: 'Literature', icon: 'fa-feather-alt' },
          { id: 'government', name: 'Government', icon: 'fa-landmark' },
          { id: 'crs', name: 'CRS', icon: 'fa-cross' }
        ],
        commercial: [
          { id: 'english', name: 'English', icon: 'fa-pen-fancy' },
          { id: 'mathematics', name: 'Mathematics', icon: 'fa-calculator' },
          { id: 'economics', name: 'Economics', icon: 'fa-chart-line' },
          { id: 'accounting', name: 'Accounting', icon: 'fa-file-invoice-dollar' }
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
    }"""

# Convert line endings of new implementation to match content's line ending
if '\r\n' in content:
    new_setupStep4 = new_setupStep4.replace('\n', '\r\n')
else:
    new_setupStep4 = new_setupStep4.replace('\r\n', '\n')

content = content[:start_index] + new_setupStep4 + content[end_index:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated setupStep4 in quiz-config.js!")
