filepath = r"c:\Users\USER\Documents\OAE\Assets\js\quiz-config.js"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update initManualPersonalizationForm setup for SSS
old_setup = """      } else if (level === 'sss') {
        deptGroup.style.display = 'block';
        examGroup.style.display = 'block';
        
        const exams = levelExams.sss;
        exams.forEach(exam => {
          const opt = document.createElement('option');
          opt.value = exam.id;
          opt.textContent = exam.name;
          examSelect.appendChild(opt);
        });

        courseGroup.style.display = 'block';"""

new_setup = """      } else if (level === 'sss') {
        deptGroup.style.display = 'block';
        examGroup.style.display = 'block';
        
        const exams = levelExams.sss;
        exams.forEach(exam => {
          const opt = document.createElement('option');
          opt.value = exam.id;
          opt.textContent = exam.name;
          examSelect.appendChild(opt);
        });"""

if old_setup not in content:
    old_setup = old_setup.replace('\n', '\r\n')
    new_setup = new_setup.replace('\n', '\r\n')

if old_setup in content:
    content = content.replace(old_setup, new_setup, 1)
    print("[OK] Removed courseGroup display for SSS in form")
else:
    print("[FAIL] Could not find SSS form setup block")

# 2. Update validateForm for SSS
old_val = """      } else if (level === 'sss') {
        const hasDept = deptSelect.value;
        const hasExam = examSelect.value;
        const hasCourse = courseInput.value && coursesList.map(c => c.toLowerCase()).includes(courseInput.value.trim().toLowerCase());
        submitBtn.disabled = !(hasDept && hasExam && hasCourse);"""

new_val = """      } else if (level === 'sss') {
        const hasDept = deptSelect.value;
        const hasExam = examSelect.value;
        submitBtn.disabled = !(hasDept && hasExam);"""

if old_val not in content:
    old_val = old_val.replace('\n', '\r\n')
    new_val = new_val.replace('\n', '\r\n')

if old_val in content:
    content = content.replace(old_val, new_val, 1)
    print("[OK] Updated validateForm for SSS")
else:
    print("[FAIL] Could not find SSS validateForm block")

# 3. Update submit handler for SSS
old_sub = """      } else if (level === 'sss') {
        const examId = examSelect.value;
        const course = courseInput.value.trim();
        applyExamSetup(examId);
        selectCourse(course, true);"""

new_sub = """      } else if (level === 'sss') {
        const examId = examSelect.value;
        const dept = deptSelect.value;
        applyExamSetup(examId);
        applyDepartmentSetup(dept);"""

if old_sub not in content:
    old_sub = old_sub.replace('\n', '\r\n')
    new_sub = new_sub.replace('\n', '\r\n')

if old_sub in content:
    content = content.replace(old_sub, new_sub, 1)
    print("[OK] Updated submit handler for SSS")
else:
    print("[FAIL] Could not find SSS submit handler block")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Finished form modifications!")
