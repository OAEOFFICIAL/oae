import re

# 1. Update quiz-config.js
config_path = r"c:\Users\USER\Documents\OAE\Assets\js\quiz-config.js"

with open(config_path, 'r', encoding='utf-8') as f:
    config_content = f.read()

# Replace subjects array
old_subjects = """  const subjects = [
    { id: 'english', name: 'English', cap: 60, marks: 100 },
    { id: 'mathematics', name: 'Mathematics', cap: 40, marks: 100 },
    { id: 'physics', name: 'Physics', cap: 40, marks: 100 },
    { id: 'chemistry', name: 'Chemistry', cap: 40, marks: 100 },
    { id: 'biology', name: 'Biology', cap: 40, marks: 100 },
    { id: 'economics', name: 'Economics', cap: 40, marks: 100 },
    { id: 'accounting', name: 'Accounting', cap: 40, marks: 100 },
    { id: 'government', name: 'Government', cap: 40, marks: 100 },
    { id: 'literature', name: 'Literature', cap: 40, marks: 100 },
    { id: 'crs', name: 'CRS', cap: 40, marks: 100 }
  ];"""

new_subjects = """  const subjects = [
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
  ];"""

# Normalize CRLF/LF
if old_subjects not in config_content:
    old_subjects = old_subjects.replace('\n', '\r\n')
    new_subjects = new_subjects.replace('\n', '\r\n')

if old_subjects in config_content:
    config_content = config_content.replace(old_subjects, new_subjects, 1)
    print("Updated config subjects list!")
else:
    print("Could not find config subjects list!")

# Replace coursesByDept
old_courses = """  const coursesByDept = {
    science: [
      "Computer Science", "Medicine", "Pharmacy", "Nursing", "Mechanical Engineering",
      "Civil Engineering", "Electrical Engineering", "Chemical Engineering",
      "Biochemistry", "Microbiology", "Dentistry", "Geology", "Mathematics",
      "Physics", "Chemistry", "Biology", "Agricultural Science"
    ],
    arts: [
      "Law", "Mass Communication", "Political Science", "History", "English",
      "Theatre Arts", "Philosophy", "Linguistics", "International Relations"
    ],
    commercial: [
      "Accounting", "Business Administration", "Economics", "Finance",
      "Banking and Finance", "Marketing", "Public Administration"
    ]
  };"""

new_courses = """  const coursesByDept = {
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
  };"""

if old_courses not in config_content:
    old_courses = old_courses.replace('\n', '\r\n')
    new_courses = new_courses.replace('\n', '\r\n')

if old_courses in config_content:
    config_content = config_content.replace(old_courses, new_courses, 1)
    print("Updated config coursesByDept!")
else:
    print("Could not find config coursesByDept!")

# Replace depts list in setupStep2()
old_depts = """        const depts = [
          { id: 'science', name: 'Science', desc: 'Physics, Chemistry, Biology, Mathematics', icon: 'fa-flask' },
          { id: 'arts', name: 'Arts', desc: 'Literature, Government, CRS, History', icon: 'fa-book' },
          { id: 'commercial', name: 'Commercial', desc: 'Economics, Commerce, Accounting, Mathematics', icon: 'fa-briefcase' }
        ];"""

new_depts = """        const depts = [
          { id: 'science', name: 'Science', desc: 'Physics, Chemistry, Biology, Mathematics, Further Maths...', icon: 'fa-flask' },
          { id: 'arts', name: 'Arts & Humanities', desc: 'Literature, Government, CRS/IRS, History, Languages...', icon: 'fa-book' },
          { id: 'commercial', name: 'Commercial & Business', desc: 'Economics, Accounts, Commerce, Government...', icon: 'fa-briefcase' },
          { id: 'social', name: 'Social Sciences', desc: 'Geography, Economics, Government, Mathematics...', icon: 'fa-users' },
          { id: 'vocational', name: 'Vocational & Technical', desc: 'Home Economics, Agricultural Science, PHE...', icon: 'fa-tools' }
        ];"""

if old_depts not in config_content:
    old_depts = old_depts.replace('\n', '\r\n')
    new_depts = new_depts.replace('\n', '\r\n')

if old_depts in config_content:
    config_content = config_content.replace(old_depts, new_depts, 1)
    print("Updated config SSS depts list in step 2!")
else:
    print("Could not find config SSS depts list!")

# Replace deptSubjectNames in setupStep4()
old_subject_names = """      // Department subjects mapping with icons
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
      };"""

new_subject_names = """      // Department subjects mapping with icons
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
      };"""

if old_subject_names not in config_content:
    old_subject_names = old_subject_names.replace('\n', '\r\n')
    new_subject_names = new_subject_names.replace('\n', '\r\n')

if old_subject_names in config_content:
    config_content = config_content.replace(old_subject_names, new_subject_names, 1)
    print("Updated config deptSubjectNames mapping!")
else:
    print("Could not find config deptSubjectNames mapping!")

# Replace applyDepartmentSetup
old_apply_dept = """  function applyDepartmentSetup(dept) {
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
    }"""

new_apply_dept = """  function applyDepartmentSetup(dept) {
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
    }"""

if old_apply_dept not in config_content:
    old_apply_dept = old_apply_dept.replace('\n', '\r\n')
    new_apply_dept = new_apply_dept.replace('\n', '\r\n')

if old_apply_dept in config_content:
    config_content = config_content.replace(old_apply_dept, new_apply_dept, 1)
    print("Updated config applyDepartmentSetup!")
else:
    print("Could not find config applyDepartmentSetup!")

# Write updated config
with open(config_path, 'w', encoding='utf-8') as f:
    f.write(config_content)


# 2. Update quiz-data.js
data_path = r"c:\Users\USER\Documents\OAE\Assets\js\quiz-data.js"

with open(data_path, 'r', encoding='utf-8') as f:
    data_content = f.read()

old_data_subjects = """    this.subjects = [
      { id: 'english', name: 'English', file: 'english.json', questionCap: 60 },
      { id: 'mathematics', name: 'Mathematics', file: 'mathematics.json', questionCap: 40 },
      { id: 'physics', name: 'Physics', file: 'physics.json', questionCap: 40 },
      { id: 'chemistry', name: 'Chemistry', file: 'chemistry.json', questionCap: 40 },
      { id: 'biology', name: 'Biology', file: 'biology.json', questionCap: 40 },
      { id: 'economics', name: 'Economics', file: 'economics.json', questionCap: 40 },
      { id: 'accounting', name: 'Accounting', file: 'accounting.json', questionCap: 40 },
      { id: 'government', name: 'Government', file: 'government.json', questionCap: 40 },
      { id: 'literature', name: 'Literature', file: 'literature.json', questionCap: 40 },
      { id: 'crs', name: 'CRS', file: 'crs.json', questionCap: 40 }
    ];"""

new_data_subjects = """    this.subjects = [
      { id: 'english', name: 'English', file: 'english.json', questionCap: 60 },
      { id: 'mathematics', name: 'Mathematics', file: 'mathematics.json', questionCap: 40 },
      { id: 'physics', name: 'Physics', file: 'physics.json', questionCap: 40 },
      { id: 'chemistry', name: 'Chemistry', file: 'chemistry.json', questionCap: 40 },
      { id: 'biology', name: 'Biology', file: 'biology.json', questionCap: 40 },
      { id: 'economics', name: 'Economics', file: 'economics.json', questionCap: 40 },
      { id: 'accounting', name: 'Accounting', file: 'accounting.json', questionCap: 40 },
      { id: 'government', name: 'Government', file: 'government.json', questionCap: 40 },
      { id: 'literature', name: 'Literature', file: 'literature.json', questionCap: 40 },
      { id: 'crs', name: 'CRS', file: 'crs.json', questionCap: 40 },
      { id: 'geography', name: 'Geography', file: 'geography.json', questionCap: 40 },
      { id: 'history', name: 'History', file: 'history.json', questionCap: 40 },
      { id: 'agricultural-science', name: 'Agricultural Science', file: 'agricultural-science.json', questionCap: 40 },
      { id: 'further-mathematics', name: 'Further Mathematics', file: 'further-mathematics.json', questionCap: 40 },
      { id: 'commerce', name: 'Commerce', file: 'commerce.json', questionCap: 40 },
      { id: 'french', name: 'French', file: 'french.json', questionCap: 40 },
      { id: 'yoruba', name: 'Yoruba', file: 'yoruba.json', questionCap: 40 },
      { id: 'igbo', name: 'Igbo', file: 'igbo.json', questionCap: 40 },
      { id: 'hausa', name: 'Hausa', file: 'hausa.json', questionCap: 40 },
      { id: 'music', name: 'Music', file: 'music.json', questionCap: 40 },
      { id: 'fine-arts', name: 'Fine Arts', file: 'fine-arts.json', questionCap: 40 },
      { id: 'arabic', name: 'Arabic', file: 'arabic.json', questionCap: 40 },
      { id: 'home-economics', name: 'Home Economics', file: 'home-economics.json', questionCap: 40 },
      { id: 'physical-health-education', name: 'Physical & Health Education', file: 'physical-health-education.json', questionCap: 40 },
      { id: 'irs', name: 'IRS', file: 'irs.json', questionCap: 40 }
    ];"""

if old_data_subjects not in data_content:
    old_data_subjects = old_data_subjects.replace('\n', '\r\n')
    new_data_subjects = new_data_subjects.replace('\n', '\r\n')

if old_data_subjects in data_content:
    data_content = data_content.replace(old_data_subjects, new_data_subjects, 1)
    print("Updated quiz-data subjects list!")
else:
    print("Could not find quiz-data subjects list!")

with open(data_path, 'w', encoding='utf-8') as f:
    f.write(data_content)

print("All subject and department expansion completed successfully!")
