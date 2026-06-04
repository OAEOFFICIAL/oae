// post-utme-prep.js

const schoolDatabase = {
    unilag: {
        name: "University of Lagos (UNILAG)",
        logo: "UL",
        logoImg: "/Assets/images/logos/unilag_logo.png",
        type: "Strict CBT Aptitude Test",
        questions: "40",
        time: "30 Minutes",
        subjects: "Mathematics, Use of English, General Paper",
        cutoff: "Varies (Min 200 JAMB, highly competitive)",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "UNILAG tests Mathematics and General Paper for ALL candidates regardless of the course you applied for. Speed is your absolute biggest advantage here.",
        requiresFaculty: false
    },
    oau: {
        name: "Obafemi Awolowo University (OAU)",
        logo: "OA",
        type: "Subject-Specific CBT",
        questions: "40",
        time: "40 Minutes",
        subjects: "Aptitude + 3 JAMB Subjects",
        cutoff: "200 JAMB baseline",
        calculator: "Basic On-Screen Only",
        negativeMarking: "No",
        tip: "OAU focuses heavily on the subjects you wrote in JAMB plus a tough aptitude/current affairs section. Accuracy is key.",
        requiresFaculty: true
    },
    ui: {
        name: "University of Ibadan (UI)",
        logo: "UI",
        type: "Advanced Subject CBT",
        questions: "100",
        time: "90 Minutes",
        subjects: "Your 4 JAMB Subjects",
        cutoff: "200 JAMB baseline (Highly course dependent)",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "UI's Post-UTME is notoriously difficult and mirrors advanced JAMB questions. You must study beyond the basic syllabus.",
        requiresFaculty: true
    },
    unilorin: {
        name: "University of Ilorin (UNILORIN)",
        logo: "UN",
        type: "General CBT Test",
        questions: "50",
        time: "30 Minutes",
        subjects: "English, Maths, General Knowledge",
        cutoff: "Varies (180 - 220 based on course)",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "UNILORIN does not usually test your specific JAMB subjects. Focus entirely on speed in English, basic Math, and current affairs.",
        requiresFaculty: false
    },
    unn: {
        name: "University of Nigeria, Nsukka (UNN)",
        logo: "UNN",
        type: "Subject-Specific CBT",
        questions: "60",
        time: "60 Minutes",
        subjects: "Your 4 JAMB Subjects",
        cutoff: "200 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "UNN sets exactly 15 questions per subject for the 4 subjects you wrote in JAMB. Their questions often involve deep logical reasoning.",
        requiresFaculty: true
    },
    abu: {
        name: "Ahmadu Bello University (ABU)",
        logo: "ABU",
        type: "General & Subject CBT",
        questions: "50",
        time: "60 Minutes",
        subjects: "English, Maths, Current Affairs, Core Subjects",
        cutoff: "180 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "ABU blends core JAMB subjects with general knowledge and current affairs. Stay updated on national history and current events.",
        requiresFaculty: true
    },
    uniben: {
        name: "University of Benin (UNIBEN)",
        logo: "UB",
        type: "Subject-Specific CBT",
        questions: "100",
        time: "60 Minutes",
        subjects: "English, General Knowledge + 2 Subjects",
        cutoff: "200 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "UNIBEN is famous for speed testing. You have very limited time (60 mins for 100 questions). Practice skipping difficult questions instantly.",
        requiresFaculty: true
    },
    funaab: {
        name: "Federal Univ. of Agriculture (FUNAAB)",
        logo: "FA",
        type: "Science-Specific CBT",
        questions: "60",
        time: "45 Minutes",
        subjects: "English, Maths, Biology/Agric, Physics, Chem",
        cutoff: "180 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "Since it's a specialized agricultural university, science subjects are compulsory. Expect questions covering O'level practicals.",
        requiresFaculty: false
    },
    futa: {
        name: "Federal Univ. of Technology (FUTA)",
        logo: "FT",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "30 Minutes",
        subjects: "English + 3 JAMB Subjects",
        cutoff: "180 JAMB baseline",
        calculator: "Basic On-Screen",
        negativeMarking: "No",
        tip: "FUTA tests exactly what you wrote in JAMB but with a strong emphasis on computational and theoretical accuracy. Time is extremely tight.",
        requiresFaculty: true
    },
    lasu: {
        name: "Lagos State University (LASU)",
        logo: "LS",
        type: "General CBT Test",
        questions: "50",
        time: "30 Minutes",
        subjects: "English, Maths, General Paper",
        cutoff: "195 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "LASU often uses an online screening format or a standard CBT. Focus on Use of English and basic Mathematics irrespective of your course.",
        requiresFaculty: false
    },
    uniport: {
        name: "University of Port Harcourt (UNIPORT)",
        logo: "UP",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "30 Minutes",
        subjects: "Math, English + 2 Core Subjects",
        cutoff: "180 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "UNIPORT emphasizes speed and accuracy. Make sure you revise past questions thoroughly as they frequently repeat them.",
        requiresFaculty: true
    },
    buk: {
        name: "Bayero University Kano (BUK)",
        logo: "BK",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "40 Minutes",
        subjects: "Your 4 JAMB Subjects",
        cutoff: "180 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "BUK screening is usually a CBT test of the same subjects you wrote in JAMB.",
        requiresFaculty: true
    },
    uniuyo: {
        name: "University of Uyo (UNIUYO)",
        logo: "UU",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "30 Minutes",
        subjects: "Your 4 JAMB Subjects",
        cutoff: "180 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "UNIUYO focuses on core JAMB subjects. Time management is crucial as questions can be wordy.",
        requiresFaculty: true
    },
    unical: {
        name: "University of Calabar (UNICAL)",
        logo: "UC",
        type: "General & Subject CBT",
        questions: "40",
        time: "30 Minutes",
        subjects: "English, Maths, Core Subjects",
        cutoff: "160 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "UNICAL often includes basic English and Math regardless of your chosen course, alongside your core subjects.",
        requiresFaculty: true
    },
    futo: {
        name: "Federal Univ. of Technology, Owerri (FUTO)",
        logo: "FO",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "30 Minutes",
        subjects: "English + 3 JAMB Subjects",
        cutoff: "160 JAMB baseline",
        calculator: "Basic On-Screen",
        negativeMarking: "No",
        tip: "FUTO tests are notoriously calculation-heavy. Master your Physics and Math formulas.",
        requiresFaculty: true
    },
    oou: {
        name: "Olabisi Onabanjo University (OOU)",
        logo: "OO",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "30 Minutes",
        subjects: "English + 3 JAMB Subjects",
        cutoff: "160 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "OOU questions are straightforward but speed is heavily tested.",
        requiresFaculty: true
    },
    aaua: {
        name: "Adekunle Ajasin University (AAUA)",
        logo: "AA",
        type: "General & Subject CBT",
        questions: "50",
        time: "40 Minutes",
        subjects: "English, General Knowledge, Core Subjects",
        cutoff: "160 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "AAUA includes a few current affairs and general knowledge questions. Don't ignore them.",
        requiresFaculty: true
    },
    eksu: {
        name: "Ekiti State University (EKSU)",
        logo: "EK",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "40 Minutes",
        subjects: "Your 4 JAMB Subjects",
        cutoff: "160 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "EKSU mostly recycles JAMB and WAEC past questions. Thorough revision of past questions is highly advised.",
        requiresFaculty: true
    },
    delsu: {
        name: "Delta State University (DELSU)",
        logo: "DS",
        type: "Aptitude Test",
        questions: "50",
        time: "30 Minutes",
        subjects: "Aptitude, English, Core Subjects",
        cutoff: "170 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "DELSU includes quantitative and verbal reasoning alongside core subjects.",
        requiresFaculty: true
    },
    rsu: {
        name: "Rivers State University (RSU)",
        logo: "RS",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "30 Minutes",
        subjects: "Your 4 JAMB Subjects",
        cutoff: "180 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "RSU focuses strictly on your JAMB subject combination.",
        requiresFaculty: true
    },
    uniabuja: {
        name: "University of Abuja (UNIABUJA)",
        logo: "UA",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "45 Minutes",
        subjects: "Your 4 JAMB Subjects",
        cutoff: "180 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "UNIABUJA questions cover a wide range of the syllabus. Ensure you have read broadly.",
        requiresFaculty: true
    },
    ndu: {
        name: "Niger Delta University (NDU)",
        logo: "ND",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "30 Minutes",
        subjects: "Your 4 JAMB Subjects",
        cutoff: "160 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "NDU CBT is fast-paced. Practice answering questions under 40 seconds each.",
        requiresFaculty: true
    },
    uniosun: {
        name: "Osun State University (UNIOSUN)",
        logo: "UO",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "30 Minutes",
        subjects: "Your 4 JAMB Subjects",
        cutoff: "160 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "UNIOSUN usually repeats questions from standard O'level past questions.",
        requiresFaculty: true
    },
    unizik: {
        name: "Nnamdi Azikiwe University (UNIZIK)",
        logo: "UZ",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "30 Minutes",
        subjects: "English, Maths, General Knowledge",
        cutoff: "200 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "UNIZIK sometimes tests general aptitude. Be prepared for logical reasoning questions.",
        requiresFaculty: false
    },
    mouau: {
        name: "Michael Okpara Univ. of Agriculture (MOUAU)",
        logo: "MO",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "30 Minutes",
        subjects: "Your 4 JAMB Subjects",
        cutoff: "160 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "Focus on science core subjects as MOUAU is heavily science-oriented.",
        requiresFaculty: true
    },
    kasu: {
        name: "Kaduna State University (KASU)",
        logo: "KS",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "40 Minutes",
        subjects: "Your 4 JAMB Subjects",
        cutoff: "170 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "KASU screening focuses heavily on theoretical knowledge.",
        requiresFaculty: true
    },
    lautech: {
        name: "Ladoke Akintola Univ. of Technology (LAUTECH)",
        logo: "LA",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "30 Minutes",
        subjects: "English + 3 JAMB Subjects",
        cutoff: "170 JAMB baseline",
        calculator: "Basic On-Screen",
        negativeMarking: "No",
        tip: "LAUTECH questions are very calculation intensive for science students.",
        requiresFaculty: true
    },
    tasued: {
        name: "Tai Solarin Univ. of Education (TASUED)",
        logo: "TS",
        type: "Subject & Aptitude CBT",
        questions: "50",
        time: "30 Minutes",
        subjects: "English, Aptitude, Core Subjects",
        cutoff: "170 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "TASUED tests teaching aptitude and general English heavily.",
        requiresFaculty: true
    },
    ksu: {
        name: "Prince Abubakar Audu University (KSU)",
        logo: "KS",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "40 Minutes",
        subjects: "Your 4 JAMB Subjects",
        cutoff: "160 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "KSU focuses on deep syllabus questions.",
        requiresFaculty: true
    },
    unimaid: {
        name: "University of Maiduguri (UNIMAID)",
        logo: "UM",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "40 Minutes",
        subjects: "Your 4 JAMB Subjects",
        cutoff: "160 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "UNIMAID tests strictly your JAMB combination.",
        requiresFaculty: true
    },
    unijos: {
        name: "University of Jos (UNIJOS)",
        logo: "UJ",
        type: "General Aptitude Test",
        questions: "50",
        time: "40 Minutes",
        subjects: "English, Current Affairs, Logic",
        cutoff: "180 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "UNIJOS screening is often heavily tilted towards aptitude and current affairs.",
        requiresFaculty: false
    },
    futminna: {
        name: "Federal Univ. of Technology, Minna (FUTMINNA)",
        logo: "FM",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "30 Minutes",
        subjects: "English + 3 JAMB Subjects",
        cutoff: "165 JAMB baseline",
        calculator: "Basic On-Screen",
        negativeMarking: "No",
        tip: "FUTMINNA expects high proficiency in basic engineering/science mathematics.",
        requiresFaculty: true
    },
    atbu: {
        name: "Abubakar Tafawa Balewa Univ. (ATBU)",
        logo: "AT",
        type: "Subject-Specific CBT",
        questions: "50",
        time: "40 Minutes",
        subjects: "English + 3 JAMB Subjects",
        cutoff: "160 JAMB baseline",
        calculator: "Not Allowed",
        negativeMarking: "No",
        tip: "ATBU focuses on core sciences. Re-read your SS2 and SS3 notes thoroughly.",
        requiresFaculty: true
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const schoolSelect = document.getElementById('schoolSelect');
    if (!schoolSelect) return; // Only run this logic on the prep page
    
    const facultySelect = document.getElementById('facultySelect');
    const courseGroup = document.getElementById('courseGroup');
    const startBtn = document.getElementById('startExamBtn');
    
    // UI Elements
    const emptyConfig = document.getElementById('emptyConfig');
    const activeConfig = document.getElementById('activeConfig');
    
    const cfgLogo = document.getElementById('cfgLogo');
    const cfgName = document.getElementById('cfgName');
    const cfgType = document.getElementById('cfgType');
    const cfgQuestions = document.getElementById('cfgQuestions');
    const cfgTime = document.getElementById('cfgTime');
    const cfgSubjects = document.getElementById('cfgSubjects');
    const cfgCutoff = document.getElementById('cfgCutoff');
    const cfgCalculator = document.getElementById('cfgCalculator');
    const cfgNegative = document.getElementById('cfgNegative');
    const cfgTip = document.getElementById('cfgTip');

    function updateConfig() {
        const schoolKey = schoolSelect.value;
        
        if (!schoolKey) {
            emptyConfig.style.display = 'block';
            activeConfig.style.display = 'none';
            courseGroup.style.display = 'none';
            startBtn.disabled = true;
            return;
        }

        const data = schoolDatabase[schoolKey];
        
        // Update UI
        emptyConfig.style.display = 'none';
        activeConfig.style.display = 'block';
        
        if(cfgLogo) {
            if (data.logoImg) {
                cfgLogo.innerHTML = `<img src="${data.logoImg}" alt="${data.name} logo">`;
                cfgLogo.style.background = 'transparent';
                cfgLogo.style.boxShadow = 'none';
            } else {
                cfgLogo.innerHTML = data.logo;
                cfgLogo.style.background = '';
                cfgLogo.style.boxShadow = '';
            }
        }
        if(cfgName) cfgName.innerText = data.name;
        if(cfgType) cfgType.innerText = data.type;
        if(cfgQuestions) cfgQuestions.innerText = data.questions;
        if(cfgTime) cfgTime.innerText = data.time;
        if(cfgSubjects) cfgSubjects.innerText = data.subjects;
        if(cfgCutoff) cfgCutoff.innerText = data.cutoff || 'Varies';
        if(cfgCalculator) cfgCalculator.innerText = data.calculator || 'Not Allowed';
        if(cfgNegative) cfgNegative.innerText = data.negativeMarking || 'No';
        if(cfgTip) cfgTip.innerText = data.tip;

        // Handle Faculty selection logic
        if (data.requiresFaculty) {
            courseGroup.style.display = 'block';
            startBtn.disabled = !facultySelect.value;
        } else {
            courseGroup.style.display = 'none';
            startBtn.disabled = false;
        }
    }

    schoolSelect.addEventListener('change', () => {
        facultySelect.value = ""; // Reset faculty
        updateConfig();
    });

    facultySelect.addEventListener('change', updateConfig);

    startBtn.addEventListener('click', () => {
        const schoolKey = schoolSelect.value;
        const faculty = facultySelect.value;
        
        startBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Generating Mock...';
        
        setTimeout(() => {
            window.location.href = `/Quizzes/post-utme-arena.htm?school=${schoolKey}&faculty=${faculty}`;
        }, 1500);
    });
});
