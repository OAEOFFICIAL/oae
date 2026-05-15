// career-advisor.js

let currentStep = 1;
let totalSteps = 5; // Default, will change dynamically
let userProfile = {};

// Massive database of courses
const courseDatabase = [
    // --- SCIENCE & TECHNOLOGY ---
    {
        title: "Medicine & Surgery (MBBS)",
        department: "science",
        tags: ["human_body", "saving_lives", "hospital", "high_stress"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Doctor, Surgeon, Medical Consultant",
        competitiveness: "Extremely High",
        desc: "You are drawn to a life of extraordinary challenge and purpose. You want to stand in the room where every decision matters, diagnosing, deciding, and healing. If you choose Medicine, you will spend years mastering every system of the human body — and a lifetime using that mastery to save lives."
    },
    {
        title: "Computer Science / Software Engineering",
        department: "science",
        tags: ["computers", "building_tech", "tech_hub", "flexible"],
        jamb: "English, Math, Physics, Chemistry (or Biology/Agric)",
        olevel: "5 Credits: English, Math, Physics, plus two sciences",
        careers: "Software Developer, Data Scientist, AI Engineer",
        competitiveness: "High",
        desc: "The fastest growing field globally. Perfect for logical thinkers who love technology, coding, and building digital solutions."
    },
    {
        title: "Civil / Mechanical Engineering",
        department: "science",
        tags: ["machines_structures", "building_tech", "field_site", "structured"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, Chem, Further Math/Technical Drawing",
        careers: "Civil Engineer, Project Manager, Mechanical Designer",
        competitiveness: "High",
        desc: "For those who want to physically build the future. Involves heavy mathematics, physics, and practical on-site or design work."
    },
    {
        title: "Pharmacy",
        department: "science",
        tags: ["chemicals_drugs", "saving_lives", "hospital", "structured"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Pharmacist, Clinical Researcher, Pharmacologist",
        competitiveness: "Very High",
        desc: "You are the bridge between the laboratory and the patient. Pharmacy is the chemistry of healing — understanding exactly how a drug works, making sure it is safe, and counselling patients so they get the full benefit of their treatment."
    },
    {
        title: "Nursing & Midwifery Science",
        department: "science",
        tags: ["human_body", "saving_lives", "hospital", "high_stress", "nursing_midwifery", "flexible"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Registered Nurse, Midwife, Healthcare Administrator",
        competitiveness: "High",
        desc: "You are the steady hand and the warm heart of healthcare. Nurses and midwives are the frontline of compassionate care — present at the most critical moments of life, from childbirth to emergency wards, with calm strength and clinical precision."
    },
    {
        title: "Dentistry & Dental Surgery (BDS)",
        department: "science",
        tags: ["human_body", "teeth_smile", "structured", "hospital"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Dentist, Orthodontist, Maxillofacial Surgeon",
        competitiveness: "Extremely High",
        desc: "You are drawn to the art and science of the smile — using your hands and your mind to restore, repair, and create. Dentistry demands both surgical precision and an eye for aesthetics, transforming a patient's confidence with every procedure."
    },
    {
        title: "Veterinary Medicine (DVM)",
        department: "science",
        tags: ["animals", "saving_lives", "hospital", "field_site"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Veterinarian, Animal Surgeon, Wildlife Expert",
        competitiveness: "High",
        desc: "You are a healer who sees no boundary between human and animal life. Veterinary Medicine requires the same depth as human medicine — diagnosis, surgery, and compassion — applied to every creature from a family pet to an endangered wild animal."
    },
    {
        title: "Architecture",
        department: "science",
        tags: ["machines_structures", "building_tech", "tech_hub", "flexible"],
        jamb: "English, Math, Physics, Geography/Fine Art",
        olevel: "5 Credits: English, Math, Physics, plus two others",
        careers: "Architect, Urban Planner, Interior Designer",
        competitiveness: "High",
        desc: "Blends science and art. For creative minds who want to design beautiful, structural buildings and cityscapes."
    },
    {
        title: "Civil & Environmental Engineering",
        department: "science",
        tags: ["machines_structures", "civil_struct", "field_site_eng", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, Chem, Further Math/Technical Drawing",
        careers: "Civil Engineer, Structural Engineer, Environmental Engineer, Construction Manager",
        competitiveness: "High",
        desc: "You are drawn to the big stuff — the roads, bridges, buildings, and water systems that make communities liveable. Your work will stand the test of time and serve generations to come."
    },
    {
        title: "Medical Laboratory Science",
        department: "science",
        tags: ["diagnostics", "discovering_patterns", "lab", "structured"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Lab Scientist, Diagnostic Pathologist",
        competitiveness: "High",
        desc: "You are the detective of the healthcare system. You work behind the scenes — in laboratories, at the microscope, at the scanner — finding the hidden evidence that tells doctors what is truly wrong inside a patient's body."
    },
    {
        title: "Radiography & Medical Imaging",
        department: "science",
        tags: ["diagnostics", "discovering_patterns", "hospital", "structured"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Radiographer, MRI Technologist, Sonographer",
        competitiveness: "High",
        desc: "You are the eye that sees inside the body without cutting it open. Radiography combines advanced technology with clinical knowledge to reveal what the naked eye can never see — tumours, fractures, and hidden disease."
    },
    {
        title: "Public Health & Epidemiology",
        department: "science",
        tags: ["field_site", "public_health", "structured", "discovering_patterns"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Epidemiologist, Health Policy Maker, Public Health Official",
        competitiveness: "Medium",
        desc: "You are not a healer of one person, but of entire communities. Public Health is about stopping disease before it starts — studying patterns, identifying risks, and designing the interventions that keep thousands of people safe."
    },
    {
        title: "Physiotherapy & Rehabilitation",
        department: "science",
        tags: ["physiotherapy", "structured", "hospital", "saving_lives"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Physiotherapist, Occupational Therapist, Sports Rehab Specialist",
        competitiveness: "High",
        desc: "You believe that the human body can heal and rebuild itself, and you want to guide that journey. Physiotherapy is the science of movement and recovery — helping stroke survivors walk again, athletes return to sport, and injured patients reclaim their lives."
    },
    {
        title: "Optometry & Vision Sciences (OD)",
        department: "science",
        tags: ["eyes_vision", "structured", "hospital", "discovering_patterns"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Optometrist, Vision Scientist, Ophthalmic Technologist",
        competitiveness: "High",
        desc: "You are drawn to the window of the soul. Optometry combines precise clinical testing with advanced technology to protect and restore one of our most vital senses. You help people see the world clearly — from reading a textbook to watching their child grow up."
    },
    {
        title: "Audiology & Speech Therapy",
        department: "science",
        tags: ["speech_hearing", "structured", "hospital", "physiotherapy"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Audiologist, Speech-Language Pathologist, Hearing Scientist",
        competitiveness: "Medium",
        desc: "You are drawn to the world of communication — hearing and speaking. You want to help people connect with others when these abilities are lost. You are patient, precise, and you understand that the gift of communication changes lives."
    },
    {
        title: "Health Information & Administration",
        department: "science",
        tags: ["health_admin", "structured", "hospital", "discovering_patterns"],
        jamb: "English, Math, Biology, Physics/Chemistry",
        olevel: "5 Credits: English, Math, Biology, Physics/Chemistry, plus one other subject",
        careers: "Health Information Manager, Hospital Administrator, Health Data Analyst",
        competitiveness: "Medium",
        desc: "You are the backbone of healthcare — organising, managing, and securing the systems that make treatment possible. You may not always be at the bedside, but your work touches every patient that walks through the door."
    },
    {
        title: "Nutrition & Dietetics",
        department: "science",
        tags: ["nutrition", "structured", "field_site", "saving_lives"],
        jamb: "English, Biology, Chemistry, Physics/Agric",
        olevel: "5 Credits: English, Math, Bio, Chem, plus one other",
        careers: "Dietitian, Clinical Nutritionist, Community Nutrition Officer",
        competitiveness: "Medium",
        desc: "You believe that food is the first medicine and that good health starts on the plate. Whether working one-on-one with patients or educating communities, you use nutrition to help people live longer, stronger, healthier lives."
    },
    {
        title: "Biomedical Science & Human Biology",
        department: "science",
        tags: ["biomedical", "lab", "discovering_patterns", "structured"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Biomedical Scientist, Research Scientist, Anatomist, Cell Biologist",
        competitiveness: "Medium",
        desc: "You are fascinated by the hidden world inside the human body — the cells, tissues, and organs that hold the secrets of health and disease. You want to be the person who uncovers those secrets in a lab, supporting doctors and advancing medicine."
    },
    {
        title: "Biochemistry & Molecular Biology",
        department: "science",
        tags: ["biochemistry", "lab", "discovering_patterns", "structured"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Biochemist, Molecular Biologist, Genetic Engineer, Biotechnologist",
        competitiveness: "Medium",
        desc: "You are captivated by the chemistry of life — the invisible dance of molecules that makes every living thing tick. You work at the frontier of science, where new medicines are born and the deepest secrets of the body are revealed through DNA, proteins, and enzymes."
    },
    {
        title: "Microbiology & Immunology",
        department: "science",
        tags: ["microbiology", "lab", "discovering_patterns", "field_site"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Microbiologist, Immunologist, Infectious Disease Scientist, Virologist",
        competitiveness: "Medium",
        desc: "You are fascinated by the invisible world — the tiny organisms that cause great harm and the powerful immune system that defends us. You want to find the germ, fight the outbreak, and understand how our bodies remember past enemies."
    },
    {
        title: "Genetics & Genomic Sciences",
        department: "science",
        tags: ["genetics", "lab", "discovering_patterns", "structured"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Geneticist, Genomic Counsellor, Bioinformatician, Genomic Medicine Specialist",
        competitiveness: "Medium",
        desc: "You are drawn to the very code of life — DNA. You want to read the genome, find the mutation, and help families understand their genetic risks. The future of medicine is in the genes — and you will help write that chapter."
    },
    {
        title: "Pharmacology & Toxicology",
        department: "science",
        tags: ["pharmacology", "lab", "chemicals_drugs", "structured"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Pharmacologist, Toxicologist, Drug Safety Scientist, Clinical Researcher",
        competitiveness: "Medium",
        desc: "You are captivated by the power of chemicals — how the right molecule in the right dose can heal, and how the wrong one can harm. You work at the intersection of chemistry and medicine, where every drug is a story of balance and precision."
    },
    {
        title: "Physiology & Medical Physics",
        department: "science",
        tags: ["physiology", "hospital", "discovering_patterns", "structured"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Clinical Physiologist, Medical Physicist, Radiation Therapist, Cardiology Technician",
        competitiveness: "Medium",
        desc: "You are the bridge between biology and technology — fascinated by how the body functions and using advanced machines to measure, image, and heal. You keep the human body in perfect view, from ECG tracings to radiation therapy."
    },
    {
        title: "Botany & Plant Science",
        department: "science",
        tags: ["nature_environment", "plants", "lab_nature", "research_nature"],
        jamb: "English, Biology, Chemistry, Physics/Agric",
        olevel: "5 Credits: English, Math, Bio, Chem, plus one other",
        careers: "Botanist, Plant Biotechnologist, Ecologist, Conservation Scientist",
        competitiveness: "Low",
        desc: "You are drawn to the quiet, green world of plants — how they live, grow, and sustain life on earth. You want to study them, protect them, and perhaps improve them through genetics or biotechnology. The world of plants is vast, vital, and beautiful."
    },
    {
        title: "Agriculture / Animal Science",
        department: "science",
        tags: ["chemicals_drugs", "discovering_patterns", "field_site", "structured"],
        jamb: "English, Biology/Agric, Chemistry, Physics/Math",
        olevel: "5 Credits: English, Math, Bio/Agric, Chem, Physics",
        careers: "Agricultural Economist, Farm Manager, Researcher",
        competitiveness: "Medium",
        desc: "Focuses on food production, animal husbandry, and agricultural economics. Essential for global food security and rural development."
    },
    {
        title: "Zoology & Animal Biology",
        department: "science",
        tags: ["nature_environment", "wild_animals", "field_nature", "research_nature"],
        jamb: "English, Biology, Chemistry, Physics/Agric",
        olevel: "5 Credits: English, Math, Bio, Chem, plus one other",
        careers: "Zoologist, Wildlife Biologist, Conservation Officer, Entomologist",
        competitiveness: "Low",
        desc: "You are fascinated by the animal kingdom — from the largest mammals to the smallest insects. You want to study animals in the wild, understand their behaviour, and protect their habitats. The world is full of creatures waiting to be understood — and you will be their voice."
    },
    {
        title: "Marine & Aquatic Sciences",
        department: "science",
        tags: ["nature_environment", "earth_rocks", "marine", "field_nature"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Marine Biologist, Oceanographer, Fisheries Scientist, Aquaculture Specialist",
        competitiveness: "Low",
        desc: "You are drawn to the water — the vast oceans, the quiet rivers, and the life within them. You want to explore, understand, and protect the underwater world. The ocean is calling, and you are ready to answer."
    },
    {
        title: "Forensic Science & Criminology",
        department: "science",
        tags: ["nature_environment", "forensic", "lab_nature", "field_nature"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Forensic Scientist, Crime Scene Investigator, Forensic Chemist, Forensic Biologist",
        competitiveness: "Medium",
        desc: "You are a scientific detective — driven by a desire for truth and justice. You want to be the one who finds the hidden clue, runs the critical test, and provides the evidence that solves the case. The courtroom needs your science, and justice depends on your precision."
    },
    {
        title: "Science Laboratory Technology",
        department: "science",
        tags: ["nature_environment", "lab_tech", "lab_nature", "research_nature"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Laboratory Technologist, Analytical Chemist, QC Officer, Lab Manager",
        competitiveness: "Medium",
        desc: "You are the backbone of every laboratory — the one who knows the machines, follows the protocols, and delivers results that can be trusted. Science is only as good as its measurements, and you are the person who makes every measurement count."
    },

    // --- COMMERCIAL & BUSINESS ---
    {
        title: "Accounting",
        department: "commercial",
        tags: ["numbers_math", "managing_money", "office", "structured"],
        jamb: "English, Math, Economics, plus one commercial subject",
        olevel: "5 Credits: English, Math, Economics, Accounting, Commerce",
        careers: "Chattered Accountant, Auditor, Financial Analyst",
        competitiveness: "High",
        desc: "The language of business. Ideal for highly organized individuals who excel at numbers and corporate strategy."
    },
    {
        title: "Business Administration",
        department: "commercial",
        tags: ["leadership", "leading_teams", "office", "flexible"],
        jamb: "English, Math, Economics, plus one commercial/social subject",
        olevel: "5 Credits: English, Math, Economics, plus two others",
        careers: "Business Manager, HR Director, Entrepreneur",
        competitiveness: "High",
        desc: "Prepares you to manage people, resources, and corporate operations in any industry."
    },
    {
        title: "Economics",
        department: "commercial",
        tags: ["market_trends", "managing_money", "government", "structured"],
        jamb: "English, Math, Economics, plus one other subject",
        olevel: "5 Credits: English, Math, Economics, plus two others",
        careers: "Economist, Data Analyst, Policy Advisor",
        competitiveness: "Very High",
        desc: "A powerful degree focusing on market trends, financial analysis, and resource distribution."
    },
    {
        title: "Marketing",
        department: "commercial",
        tags: ["selling_ideas", "leading_teams", "remote_agency", "flexible"],
        jamb: "English, Math, Economics, plus one commercial subject",
        olevel: "5 Credits: English, Math, Economics, Commerce",
        careers: "Marketing Director, Brand Manager",
        competitiveness: "Medium",
        desc: "Perfect for persuasive, creative individuals who understand consumer psychology and sales."
    },
    {
        title: "Banking & Finance",
        department: "commercial",
        tags: ["numbers_math", "managing_money", "office", "structured"],
        jamb: "English, Math, Economics, plus one commercial subject",
        olevel: "5 Credits: English, Math, Economics, Commerce",
        careers: "Bank Manager, Investment Banker",
        competitiveness: "High",
        desc: "Focuses specifically on financial markets, investments, and running massive financial institutions."
    },
    {
        title: "Public Administration",
        department: "commercial",
        tags: ["leadership", "leading_teams", "government", "structured"],
        jamb: "English, Government, Economics, plus one other subject",
        olevel: "5 Credits: English, Math, Government, Economics",
        careers: "Civil Servant, Administrator, Policy Director",
        competitiveness: "Medium",
        desc: "Prepares you for leadership roles within government agencies, NGOs, and public sector organizations."
    },

    // --- ARTS & HUMANITIES ---
    {
        title: "Law (LLB)",
        department: "arts",
        tags: ["justice", "defending_people", "courtroom", "high_stress"],
        jamb: "English, Literature, Government, plus one Arts/Social Science",
        olevel: "5 Credits: English, Math, Literature, Government, plus one Art",
        careers: "Lawyer, Judge, Corporate Counsel",
        competitiveness: "Extremely High",
        desc: "Requires immense reading capability, logical argumentation, and a drive for justice and order."
    },
    {
        title: "Mass Communication",
        department: "arts",
        tags: ["media", "entertaining", "studio", "flexible"],
        jamb: "English, Literature, Government, plus one Art/Social subject",
        olevel: "5 Credits: English, Math, Literature, plus two others",
        careers: "Journalist, Broadcaster, PR Specialist",
        competitiveness: "High",
        desc: "Perfect for outgoing, creative individuals who excel in writing, speaking, and digital media."
    },
    {
        title: "Theatre Arts",
        department: "arts",
        tags: ["performance", "entertaining", "stage", "flexible"],
        jamb: "English, Literature, plus two Arts subjects",
        olevel: "5 Credits: English, Literature, plus three Arts/Social subjects",
        careers: "Actor, Director, Scriptwriter",
        competitiveness: "Medium",
        desc: "For highly expressive individuals who want to impact society through performance and storytelling."
    },
    {
        title: "English & Literature",
        department: "arts",
        tags: ["writing", "defending_people", "office", "structured"],
        jamb: "English, Literature, plus two Arts subjects",
        olevel: "5 Credits: English, Math, Literature, plus two Arts",
        careers: "Author, Editor, Lecturer",
        competitiveness: "Medium",
        desc: "Focuses deeply on written expression, critical analysis, and the power of language."
    },
    {
        title: "Fine & Applied Arts",
        department: "arts",
        tags: ["performance", "entertaining", "studio", "flexible"],
        jamb: "English, Fine Art, plus two Arts subjects",
        olevel: "5 Credits: English, Math, Fine Art, plus two others",
        careers: "Graphic Designer, Artist, Art Director",
        competitiveness: "Medium",
        desc: "For purely creative minds who want to build visual masterpieces, from paintings to digital graphics."
    },
    {
        title: "History & International Studies",
        department: "arts",
        tags: ["writing", "defending_people", "office", "structured"],
        jamb: "English, History, Government, plus one Art",
        olevel: "5 Credits: English, Math, History, Government",
        careers: "Historian, Diplomat, Archivist",
        competitiveness: "Medium",
        desc: "Focuses on understanding the past to predict and manage international future relations."
    },

    // --- SOCIAL SCIENCES ---
    {
        title: "Political Science",
        department: "social",
        tags: ["government", "policy_making", "office", "structured"],
        jamb: "English, Government, plus two Social Sciences",
        olevel: "5 Credits: English, Math, Government, plus two others",
        careers: "Politician, Diplomat, Policy Analyst",
        competitiveness: "High",
        desc: "Focuses on government systems, public policy, and international relations."
    },
    {
        title: "Psychology",
        department: "social",
        tags: ["human_mind", "counseling", "clinic", "high_stress"],
        jamb: "English, Biology, plus two Social Sciences/Arts",
        olevel: "5 Credits: English, Math, Biology, plus two others",
        careers: "Clinical Psychologist, HR Manager, Counselor",
        competitiveness: "Medium",
        desc: "The scientific study of the human mind and behavior. Great for empathetic, analytical thinkers."
    },
    {
        title: "Sociology",
        department: "social",
        tags: ["society", "policy_making", "field", "structured"],
        jamb: "English, Government, plus two Social Sciences",
        olevel: "5 Credits: English, Math, plus three Social/Arts subjects",
        careers: "Social Worker, Researcher, HR Specialist",
        competitiveness: "Medium",
        desc: "Focuses on human society, social problems, and community development."
    },
    {
        title: "International Relations",
        department: "social",
        tags: ["global_affairs", "counseling", "office", "flexible"],
        jamb: "English, Government, plus two Social Sciences",
        olevel: "5 Credits: English, Math, Government, History",
        careers: "Diplomat, Foreign Affairs Officer",
        competitiveness: "High",
        desc: "Study of global politics, international law, and diplomatic relations."
    },
    {
        title: "Criminology & Security Studies",
        department: "social",
        tags: ["human_mind", "policy_making", "field", "high_stress"],
        jamb: "English, Government, Economics, plus one other",
        olevel: "5 Credits: English, Math, Government, plus two others",
        careers: "Intelligence Officer, Criminologist",
        competitiveness: "Medium",
        desc: "Focuses on understanding crime, criminal behavior, and the justice system."
    },
    {
        title: "Geography",
        department: "social",
        tags: ["society", "policy_making", "field", "flexible"],
        jamb: "English, Geography, plus two Social Sciences",
        olevel: "5 Credits: English, Math, Geography, plus two others",
        careers: "Urban Planner, Environmental Consultant",
        competitiveness: "Medium",
        desc: "The study of the earth, environments, and human interactions with the physical world."
    }
];

// Department Specific Questions
const dynamicQuestions = {
    science: [
        {
            title: "What kind of problem naturally pulls your attention and makes you want to fix it?",
            options: [
                { val: "human_body", label: "Someone in pain, sick, or unwell — I want to help them feel better.", icon: "fas fa-user-injured" },
                { val: "machines_structures", label: "A broken device, machine, or structure that needs to be built or repaired.", icon: "fas fa-tools" },
                { val: "computers", label: "A confusing set of data, a slow app, or a network that keeps failing.", icon: "fas fa-laptop-code" },
                { val: "nature_environment", label: "A chemical reaction, an environmental issue, or something in nature out of balance.", icon: "fas fa-leaf" }
            ]
        },
        {
            title: "When you imagine helping a living being who is unwell, what feels most natural to you?",
            options: [
                { val: "saving_lives", label: "Being right there with them — talking to them, examining them, and guiding recovery.", icon: "fas fa-stethoscope" },
                { val: "lab", label: "Working behind the scenes in a lab, running tests to find out what’s wrong.", icon: "fas fa-vial" },
                { val: "field_site", label: "Making sure communities stay healthy, preventing diseases before they even start.", icon: "fas fa-shield-virus" },
                { val: "animals", label: "Working directly with animals — examining, calming, and treating them.", icon: "fas fa-paw" },
                { val: "physiotherapy", label: "Helping them regain movement, speech, or daily abilities after an injury.", icon: "fas fa-walking" },
                { val: "nutrition", label: "Helping them regain strength and energy through the right foods and meal plans.", icon: "fas fa-apple-alt" }
            ]
        },
        {
            title: "Which part of being a healer most excites you?",
            options: [
                { val: "discovering_patterns", label: "Diagnosing mysterious illnesses and creating the entire treatment plan.", icon: "fas fa-search-plus" },
                { val: "high_stress", label: "Performing procedures with my hands — surgery, stitching, or delicate operations.", icon: "fas fa-hands" },
                { val: "hospital", label: "Building long-term relationships with patients and being their first point of care.", icon: "fas fa-handshake" },
                { val: "teeth_smile", label: "Specialising in a specific part of the body, like the teeth, gums, and jaws.", icon: "fas fa-tooth" },
                { val: "chemicals_drugs", label: "Understanding medicines — how they work, how to make them, and how to give them safely.", icon: "fas fa-pills" },
                { val: "nursing_midwifery", label: "Specialising in a specific area, like pregnancy, childbirth, or the care of newborns.", icon: "fas fa-baby" },
                { val: "diagnostics", label: "Specialising in tests that reveal hidden problems, like X-rays or blood work.", icon: "fas fa-microscope" },
                { val: "public_health", label: "Studying patterns of disease — how to stop outbreaks and keep populations well.", icon: "fas fa-globe-africa" },
                { val: "physiotherapy", label: "Using exercises and hands-on techniques to help someone walk again or recover.", icon: "fas fa-dumbbell" },
                { val: "eyes_vision", label: "Specialising in a specific part of the body, like the eyes and vision.", icon: "fas fa-eye" },
                { val: "speech_hearing", label: "Helping someone hear the world again, or find their voice after losing speech.", icon: "fas fa-deaf" },
                { val: "health_admin", label: "Specialising in the systems and information that keep healthcare organised.", icon: "fas fa-folder-open" },
                { val: "nutrition", label: "Using food as medicine — planning meals that help people recover and live healthier.", icon: "fas fa-carrot" },
                { val: "biomedical", label: "Studying the body at the deepest level — cells, tissues, and organs — to understand disease.", icon: "fas fa-microscope" },
                { val: "biochemistry", label: "Understanding life at the molecular level — how DNA, proteins, and enzymes work.", icon: "fas fa-dna" },
                { val: "microbiology", label: "Studying invisible invaders — bacteria and viruses — and how the body fights back.", icon: "fas fa-bacteria" },
                { val: "genetics", label: "Studying the blueprint of life — DNA, genes, and why diseases run in families.", icon: "fas fa-dna" },
                { val: "pharmacology", label: "Studying how drugs interact with the body — how a tiny pill can cure or, wrongly dosed, poison.", icon: "fas fa-pills" },
                { val: "physiology", label: "Understanding how body systems work and using machines to measure, image, and support them.", icon: "fas fa-heartbeat" }
            ]
        },
        {
            title: "How do you handle high-pressure situations?",
            options: [
                { val: "high_stress", label: "I stay calm, make fast decisions, and take charge when every second counts.", icon: "fas fa-bolt" },
                { val: "structured", label: "I prefer a steady, controlled environment where I can think deeply before acting.", icon: "fas fa-brain" },
                { val: "flexible", label: "I rely on clear protocols and teamwork, supporting others in a fast-paced setting.", icon: "fas fa-users" },
                { val: "high_stress", label: "I thrive when the pressure is on and I have to act purely on instinct.", icon: "fas fa-fire" }
            ]
        },
        {
            title: "Where do you see yourself working in 10 years?",
            options: [
                { val: "hospital", label: "In a busy hospital, moving from patient to patient, making critical decisions.", icon: "fas fa-hospital-alt" },
                { val: "structured", label: "In a quiet clinic, seeing familiar patients and managing their ongoing health.", icon: "fas fa-clinic-medical" },
                { val: "lab", label: "In a research lab, studying diseases and testing new treatments.", icon: "fas fa-microscope" },
                { val: "field_site", label: "Out in the field, working directly in communities to improve health.", icon: "fas fa-map-marked-alt" },
                { val: "chemicals_drugs", label: "In a pharmacy or pharmaceutical company, ensuring people get the right medicines.", icon: "fas fa-prescription-bottle-alt" },
                { val: "nursing_midwifery", label: "In a maternity unit or clinic, helping mothers before, during, and after childbirth.", icon: "fas fa-baby-carriage" },
                { val: "diagnostics", label: "In a laboratory or imaging centre, surrounded by microscopes and scanning machines.", icon: "fas fa-x-ray" },
                { val: "physiotherapy", label: "In a rehabilitation centre or clinic, restoring patients' strength over many sessions.", icon: "fas fa-crutch" },
                { val: "eyes_vision", label: "In a quiet eye clinic, using advanced equipment to examine eyes and prescribe lenses.", icon: "fas fa-glasses" },
                { val: "speech_hearing", label: "In a quiet clinic, conducting hearing tests or teaching a stroke survivor to speak.", icon: "fas fa-head-side-medical" },
                { val: "health_admin", label: "In a quiet office within a hospital, managing databases, budgets, or patient records.", icon: "fas fa-database" },
                { val: "nutrition", label: "In a nutrition clinic, advising patients on healthy eating and managing diet-related diseases.", icon: "fas fa-utensils" },
                { val: "biomedical", label: "In a research lab or university, studying cells and tissues to advance medicine.", icon: "fas fa-flask" },
                { val: "biochemistry", label: "In a research lab, studying enzymes, DNA, or proteins and developing new drugs.", icon: "fas fa-atom" },
                { val: "microbiology", label: "In a microbiology lab, culturing bacteria and researching how the immune system defends us.", icon: "fas fa-viruses" },
                { val: "genetics", label: "In a genetics institute, analyzing DNA samples and studying how traits and diseases are inherited.", icon: "fas fa-chart-bar" },
                { val: "pharmacology", label: "In a pharmaceutical company, testing how new drugs work in the body and whether they are safe.", icon: "fas fa-flask" },
                { val: "physiology", label: "In a hospital's cardiology or neurology department, running ECGs, EEGs, or fine-tuning radiation therapy.", icon: "fas fa-wave-square" }
            ]
        },
        {
            title: "What kind of challenge would make you feel most alive?",
            options: [
                { val: "high_stress", label: "A trauma emergency where I have to act fast to save a life.", icon: "fas fa-ambulance" },
                { val: "discovering_patterns", label: "A complex medical puzzle where the diagnosis isn’t obvious.", icon: "fas fa-puzzle-piece" },
                { val: "saving_lives", label: "A long-term battle with a chronic illness, walking with a patient through their journey.", icon: "fas fa-route" },
                { val: "animals", label: "An outbreak of disease among a herd or in wildlife that requires quick action.", icon: "fas fa-paw" },
                { val: "nursing_midwifery", label: "A long labour where I guide a mother through the pain and joy of bringing new life.", icon: "fas fa-baby" },
                { val: "diagnostics", label: "A complex diagnostic puzzle — looking at a blood slide or scan to find a tiny clue.", icon: "fas fa-search" },
                { val: "public_health", label: "An outbreak of disease that spreads quickly — tracing its source and protecting thousands.", icon: "fas fa-chart-line" },
                { val: "physiotherapy", label: "Helping a patient take their first steps after months of hard work and physical therapy.", icon: "fas fa-running" },
                { val: "eyes_vision", label: "A complex puzzle where a patient's vision is failing and I must find the exact cause.", icon: "fas fa-eye-dropper" },
                { val: "speech_hearing", label: "A child who hasn’t spoken a word, and I find the right therapy to change their life.", icon: "fas fa-comment-medical" },
                { val: "health_admin", label: "A hospital's records are a mess, and I design a new digital system that fixes everything.", icon: "fas fa-project-diagram" },
                { val: "nutrition", label: "A long-term partnership guiding a patient battling obesity or diabetes to transform their diet.", icon: "fas fa-weight" },
                { val: "biomedical", label: "A disease with an unknown cause — I search through cells and molecules until I find the answer.", icon: "fas fa-dna" },
                { val: "biochemistry", label: "A disease that no one understands, and I use biochemistry to uncover its molecular cause.", icon: "fas fa-viruses" },
                { val: "microbiology", label: "A fever of unknown origin, and I identify the rare bacteria or virus causing it.", icon: "fas fa-bug" },
                { val: "genetics", label: "A child with a rare disorder — I search through their genes to find the single mutation responsible.", icon: "fas fa-dna" },
                { val: "pharmacology", label: "A new drug with strange side effects — I figure out why and fix it, or trace an outbreak of poisoning.", icon: "fas fa-vial" },
                { val: "physiology", label: "A patient's heart rhythm is unstable, and I use cardiac physiology to pinpoint the exact problem.", icon: "fas fa-procedures" }
            ]
        },
        {
            title: "Which of these would you be most proud to learn?",
            options: [
                { val: "saving_lives", label: "How to perform a life-saving operation.", icon: "fas fa-heartbeat" },
                { val: "lab", label: "How to interpret complex lab results and scans to find hidden clues.", icon: "fas fa-x-ray" },
                { val: "structured", label: "How to manage a whole healthcare team and improve hospital systems.", icon: "fas fa-clipboard-list" },
                { val: "chemicals_drugs", label: "How to develop a new vaccine or drug that saves millions.", icon: "fas fa-flask" },
                { val: "nursing_midwifery", label: "How to deliver a baby safely and support the mother through the entire process.", icon: "fas fa-baby-carriage" },
                { val: "diagnostics", label: "How to operate a CT scanner or run a blood test to identify a rare disease.", icon: "fas fa-vial" },
                { val: "public_health", label: "How to design a national vaccination campaign that eradicates a disease.", icon: "fas fa-shield-alt" },
                { val: "physiotherapy", label: "How to teach someone with a spinal injury how to sit up, stand, and move again.", icon: "fas fa-wheelchair" },
                { val: "eyes_vision", label: "How to examine the inside of an eye, spot damage, and prescribe the perfect treatment.", icon: "fas fa-eye" },
                { val: "speech_hearing", label: "How to fit a cochlear implant or teach a stutterer to speak fluently.", icon: "fas fa-ear-listen" },
                { val: "health_admin", label: "How to build a secure, efficient electronic health records system that serves thousands.", icon: "fas fa-network-wired" },
                { val: "nutrition", label: "How to design a nutrition programme that eradicates childhood malnutrition in a community.", icon: "fas fa-seedling" },
                { val: "biomedical", label: "How to read tissue slides and genetic data to uncover the root of a disease.", icon: "fas fa-atom" },
                { val: "biochemistry", label: "How to read a DNA sequence and pinpoint the mutation causing a genetic disease.", icon: "fas fa-project-diagram" },
                { val: "microbiology", label: "How to grow a pathogen in the lab and test which antibiotic kills it, or design a new vaccine.", icon: "fas fa-syringe" },
                { val: "genetics", label: "How to read a whole genome and use gene editing tools like CRISPR to correct a disorder.", icon: "fas fa-cut" },
                { val: "pharmacology", label: "How to determine the exact dose of a drug that heals without harming, or identify an unknown poison.", icon: "fas fa-balance-scale" },
                { val: "physiology", label: "How to interpret a complex ECG or calibrate a radiation machine to destroy a tumour precisely.", icon: "fas fa-radiation" }
            ]
        },
        {
            title: "When you think about living bodies or systems, what fascinates you most?",
            options: [
                { val: "human_body", label: "The entire body as an interconnected system — I want to understand it all.", icon: "fas fa-child" },
                { val: "teeth_smile", label: "A specific system, like the mouth, jaw, and teeth.", icon: "fas fa-tooth" },
                { val: "chemicals_drugs", label: "The microscopic world of cells, genes, and molecules that make us who we are.", icon: "fas fa-dna" },
                { val: "animals", label: "The way animals move, behave, and respond to their environment.", icon: "fas fa-paw" },
                { val: "nursing_midwifery", label: "The process of pregnancy and birth — how a new life grows and enters the world.", icon: "fas fa-baby" },
                { val: "public_health", label: "The bigger picture — how poverty, environment, and policy shape who gets sick.", icon: "fas fa-users" },
                { val: "physiotherapy", label: "The way the body moves — muscles, bones, joints, and how to restore movement.", icon: "fas fa-walking" },
                { val: "eyes_vision", label: "A specific system — the eyes and visual system, and how the brain creates sight.", icon: "fas fa-eye" },
                { val: "speech_hearing", label: "The ear and the auditory pathways, or the vocal cords and the brain’s language centres.", icon: "fas fa-volume-up" },
                { val: "health_admin", label: "How health systems, data, and technology come together to deliver care efficiently.", icon: "fas fa-sitemap" },
                { val: "nutrition", label: "How the body uses food — digestion, metabolism, and the power of nutrients to heal.", icon: "fas fa-apple-alt" },
                { val: "biomedical", label: "The microscopic world of cells, tissues, and organs — the intricate machinery of life.", icon: "fas fa-bacteria" },
                { val: "biochemistry", label: "The molecular world — DNA, RNA, proteins, and how they control every breath and heartbeat.", icon: "fas fa-dna" },
                { val: "microbiology", label: "The invisible battlefield — how germs invade and how the immune system defends every inch.", icon: "fas fa-shield-virus" },
                { val: "genetics", label: "The microscopic world of genes, chromosomes, and the code that builds every living thing.", icon: "fas fa-project-diagram" },
                { val: "pharmacology", label: "How a single drug molecule binds to a receptor and changes the way a cell behaves.", icon: "fas fa-capsules" },
                { val: "physiology", label: "How the heart pumps, the lungs exchange gases, or nerves fire — and how we measure every signal.", icon: "fas fa-heartbeat" }
            ]
        },
        {
            title: "How do you feel about working long, unpredictable hours?",
            options: [
                { val: "high_stress", label: "I accept it — it’s part of the job when lives are on the line.", icon: "fas fa-clock" },
                { val: "structured", label: "I’d rather have more control over my schedule and a predictable routine.", icon: "fas fa-calendar-check" },
                { val: "flexible", label: "I’d prefer shift work that’s structured, even if it includes nights.", icon: "fas fa-moon" },
                { val: "hospital", label: "I’m fine with long hours as long as I’m not constantly on call.", icon: "fas fa-bed" }
            ]
        },
        {
            title: "If you could shadow a professional for a day, who would you choose?",
            options: [
                { val: "saving_lives", label: "A surgeon in the operating theatre.", icon: "fas fa-procedures" },
                { val: "discovering_patterns", label: "A physician diagnosing complex cases in a teaching hospital.", icon: "fas fa-user-md" },
                { val: "animals", label: "A mixed-practice vet diagnosing animals on a farm or in a clinic.", icon: "fas fa-paw" },
                { val: "teeth_smile", label: "A dentist performing fillings, extractions, or smile makeovers.", icon: "fas fa-tooth" },
                { val: "chemicals_drugs", label: "A pharmacist advising on medicines and preparing prescriptions.", icon: "fas fa-capsules" },
                { val: "nursing_midwifery", label: "A nurse or midwife in a busy hospital ward or maternity unit.", icon: "fas fa-user-nurse" },
                { val: "diagnostics", label: "A medical lab scientist or radiographer analyzing samples and medical scans.", icon: "fas fa-laptop-medical" },
                { val: "public_health", label: "An epidemiologist investigating a disease outbreak and crunching data.", icon: "fas fa-search-location" },
                { val: "physiotherapy", label: "A physiotherapist guiding a stroke patient through exercises to regain strength.", icon: "fas fa-heartbeat" },
                { val: "eyes_vision", label: "An optometrist examining patients, fitting contact lenses, and detecting eye diseases.", icon: "fas fa-glasses" },
                { val: "speech_hearing", label: "An audiologist testing a baby’s hearing, or a speech therapist helping a child.", icon: "fas fa-comments" },
                { val: "health_admin", label: "A health information manager analyzing hospital data and designing record systems.", icon: "fas fa-folder-open" },
                { val: "nutrition", label: "A dietitian planning special meals for patients with kidney disease or diabetes.", icon: "fas fa-utensils" },
                { val: "biomedical", label: "A biomedical scientist looking at a biopsy sample under a microscope to identify a cancer type.", icon: "fas fa-vial" },
                { val: "biochemistry", label: "A biochemist using gel electrophoresis to separate DNA fragments and find a disease marker.", icon: "fas fa-wave-square" },
                { val: "microbiology", label: "A microbiologist streaking bacteria onto a petri dish, or an immunologist studying T-cells.", icon: "fas fa-bacteria" },
                { val: "genetics", label: "A geneticist analyzing a family's DNA to predict inherited cancer risk, or a bioinformatician comparing genomes.", icon: "fas fa-sitemap" },
                { val: "pharmacology", label: "A pharmacologist testing drug absorption in the body, or a toxicologist assessing whether a pesticide is safe.", icon: "fas fa-prescription" },
                { val: "physiology", label: "A clinical physiologist running a patient stress test, or a medical physicist calibrating radiation therapy.", icon: "fas fa-stethoscope" }
            ]
        }
    ],
    commercial: [
        {
            title: "If you were given a million dollars to start a business, what would be your primary focus?",
            options: [
                { val: "numbers_math", label: "Tracking every penny and optimizing the financial books", icon: "fas fa-calculator" },
                { val: "leadership", label: "Hiring the best team and acting as the visionary CEO", icon: "fas fa-users" },
                { val: "market_trends", label: "Analyzing competitors and forecasting economic trends", icon: "fas fa-chart-line" },
                { val: "selling_ideas", label: "Designing viral marketing campaigns and selling the product", icon: "fas fa-bullhorn" }
            ]
        },
        {
            title: "You are placed in a group project. Which role do you naturally take?",
            options: [
                { val: "managing_money", label: "The Treasurer: Managing the budget and resources", icon: "fas fa-money-bill-wave" },
                { val: "leading_teams", label: "The Manager: Delegating tasks and making final decisions", icon: "fas fa-briefcase" },
                { val: "market_trends", label: "The Strategist: Drafting the formal proposal and policies", icon: "fas fa-file-contract" },
                { val: "remote_agency", label: "The Presenter: Pitching the final idea to the audience", icon: "fas fa-handshake" }
            ]
        },
        {
            title: "What does success look like to you?",
            options: [
                { val: "office", label: "Climbing the corporate ladder to become a top executive", icon: "fas fa-building" },
                { val: "remote_agency", label: "Running a highly creative, fast-paced marketing agency", icon: "fas fa-lightbulb" },
                { val: "government", label: "Advising the government on national economic policies", icon: "fas fa-university" },
                { val: "office", label: "Building my own startup from scratch", icon: "fas fa-rocket" }
            ]
        },
        {
            title: "What type of daily routine suits you best?",
            options: [
                { val: "structured", label: "I prefer a highly organized, strict 9-to-5 schedule", icon: "fas fa-calendar-check" },
                { val: "flexible", label: "I want a flexible schedule where I travel and meet clients", icon: "fas fa-plane" },
                { val: "structured", label: "I want to sit at a desk and crunch data all day", icon: "fas fa-desktop" },
                { val: "flexible", label: "I want to make my own hours as an entrepreneur", icon: "fas fa-clock" }
            ]
        }
    ],
    arts: [
        {
            title: "Which of these documentaries would you most likely watch on a Friday night?",
            options: [
                { val: "justice", label: "A true crime series about high-profile court cases", icon: "fas fa-balance-scale" },
                { val: "media", label: "Behind the scenes of a global news broadcasting network", icon: "fas fa-newspaper" },
                { val: "performance", label: "The making of an award-winning movie or theatre play", icon: "fas fa-theater-masks" },
                { val: "writing", label: "The life story of a famous novelist or historian", icon: "fas fa-book-open" }
            ]
        },
        {
            title: "How do you prefer to express your ideas?",
            options: [
                { val: "defending_people", label: "By engaging in intense, logical debates to prove my point", icon: "fas fa-gavel" },
                { val: "entertaining", label: "By entertaining people through speaking or performing", icon: "fas fa-microphone" },
                { val: "media", label: "By creating visually stunning digital content or photos", icon: "fas fa-camera" },
                { val: "writing", label: "By writing detailed, thought-provoking essays or stories", icon: "fas fa-pen-nib" }
            ]
        },
        {
            title: "Where do you feel the most confident and alive?",
            options: [
                { val: "courtroom", label: "Standing in a courtroom, defending a client", icon: "fas fa-balance-scale" },
                { val: "studio", label: "In a TV or radio studio, reporting live to millions", icon: "fas fa-broadcast-tower" },
                { val: "stage", label: "On a stage or movie set, embodying a character", icon: "fas fa-film" },
                { val: "office", label: "In a quiet study, writing my next big publication", icon: "fas fa-building" }
            ]
        },
        {
            title: "How do you handle pressure?",
            options: [
                { val: "high_stress", label: "I can argue for hours under immense pressure", icon: "fas fa-fire" },
                { val: "flexible", label: "I prefer working on my own creative timelines", icon: "fas fa-paint-brush" },
                { val: "structured", label: "I like researching alone without being rushed", icon: "fas fa-book" },
                { val: "flexible", label: "I love the adrenaline rush of a live audience", icon: "fas fa-users" }
            ]
        }
    ],
    social: [
        {
            title: "If you could instantly solve one global issue, what would it be?",
            options: [
                { val: "government", label: "Corruption and poor political leadership", icon: "fas fa-landmark" },
                { val: "human_mind", label: "Mental health crisis and emotional trauma", icon: "fas fa-brain" },
                { val: "society", label: "Poverty, inequality, and community breakdown", icon: "fas fa-users" },
                { val: "global_affairs", label: "Wars and international conflicts", icon: "fas fa-globe" }
            ]
        },
        {
            title: "Your friend comes to you with a complex personal problem. What is your reaction?",
            options: [
                { val: "policy_making", label: "I help them create a strict set of rules to prevent it.", icon: "fas fa-file-alt" },
                { val: "counseling", label: "I listen deeply, offer empathy, and counsel them.", icon: "fas fa-hands-helping" },
                { val: "field", label: "I immediately go out and investigate the cause.", icon: "fas fa-map-marked-alt" },
                { val: "global_affairs", label: "I act as a diplomat to negotiate peace for them.", icon: "fas fa-plane" }
            ]
        },
        {
            title: "Which of these job titles sounds the most fulfilling?",
            options: [
                { val: "office", label: "Policy Advisor to the President", icon: "fas fa-building" },
                { val: "clinic", label: "Lead Clinical Psychologist", icon: "fas fa-hospital-user" },
                { val: "field", label: "Field Director for a Humanitarian NGO", icon: "fas fa-hands-helping" },
                { val: "office", label: "United Nations Ambassador", icon: "fas fa-globe-africa" }
            ]
        },
        {
            title: "What is your preferred work dynamic?",
            options: [
                { val: "structured", label: "Writing policies from a comfortable desk", icon: "fas fa-pen" },
                { val: "high_stress", label: "Dealing directly with dangerous criminals or crises", icon: "fas fa-shield-alt" },
                { val: "flexible", label: "Traveling the world to meet new cultures", icon: "fas fa-plane-departure" },
                { val: "structured", label: "Conducting long-term social surveys and data entry", icon: "fas fa-clipboard-list" }
            ]
        }
    ]
};

// Nature/Environment branch for Science & Technology (Q1 option D)
const dynamicQuestionsNature = [
    {
        title: "When you think about the natural world, what draws your curiosity the most?",
        options: [
            { val: "plants", label: "The plants around me — how they grow, what they need, and why some die.", icon: "fas fa-seedling" },
            { val: "wild_animals", label: "The animals in the wild — their behaviour, health, and habitats.", icon: "fas fa-paw" },
            { val: "earth_rocks", label: "The rocks, land, and oceans — how the earth itself is shaped.", icon: "fas fa-mountain" },
            { val: "climate", label: "The weather and climate — how they change and affect all life on earth.", icon: "fas fa-cloud-sun" },
            { val: "forensic", label: "Evidence and clues — the hidden physical traces that reveal the truth behind events.", icon: "fas fa-search" },
            { val: "lab_tech", label: "A chemical process or lab procedure — instruments, protocols, and precise measurements.", icon: "fas fa-vial" }
        ]
    },
    {
        title: "What kind of scientific work excites you the most?",
        options: [
            { val: "research_nature", label: "Discovering new species or studying genetics to understand how life evolves.", icon: "fas fa-dna" },
            { val: "field_nature", label: "Working outdoors — collecting samples, observing wildlife, and exploring ecosystems.", icon: "fas fa-binoculars" },
            { val: "lab_nature", label: "Working in a lab — studying cells, molecules, or running controlled experiments.", icon: "fas fa-flask" },
            { val: "applied_nature", label: "Applying science to real problems — improving crops, restoring land, or protecting species.", icon: "fas fa-tractor" },
            { val: "forensic", label: "Investigating crime scenes and analysing physical evidence to solve mysteries.", icon: "fas fa-fingerprint" },
            { val: "lab_tech", label: "Running sophisticated instruments and analytical tests with exacting precision.", icon: "fas fa-microscope" }
        ]
    },
    {
        title: "How do you prefer to work?",
        options: [
            { val: "lab_nature", label: "Indoors in a lab or office, with controlled experiments and data analysis.", icon: "fas fa-microscope" },
            { val: "field_nature", label: "Outdoors in forests, fields, or oceans — I love being in nature itself.", icon: "fas fa-leaf" },
            { val: "research_nature", label: "In a university or research station, designing studies and publishing findings.", icon: "fas fa-university" },
            { val: "applied_nature", label: "On a farm, reserve, or in a community — applying science where it matters most.", icon: "fas fa-globe-africa" },
            { val: "forensic", label: "At a crime scene or in a forensic lab — processing evidence and uncovering the truth.", icon: "fas fa-search-location" },
            { val: "lab_tech", label: "In a quality control or analytical lab — following standard procedures to deliver trusted results.", icon: "fas fa-clipboard-check" }
        ]
    },
    {
        title: "Where do you see yourself working in 10 years?",
        options: [
            { val: "research_nature", label: "In a university or research institute, studying and publishing scientific discoveries.", icon: "fas fa-graduation-cap" },
            { val: "applied_nature", label: "Working with farmers, conservationists, or industries to solve real-world problems.", icon: "fas fa-handshake" },
            { val: "field_nature", label: "In a conservation park or environmental agency, protecting ecosystems and wildlife.", icon: "fas fa-tree" },
            { val: "lab_nature", label: "In a biotech or agro-industry company, using science to improve products or processes.", icon: "fas fa-industry" },
            { val: "forensic", label: "In a forensic laboratory or as a crime scene investigator, helping solve cases.", icon: "fas fa-gavel" },
            { val: "lab_tech", label: "In a pharmaceutical, food safety, or environmental QC lab, running analytical tests.", icon: "fas fa-flask" }
        ]
    },
    {
        title: "What kind of challenge would make you feel most alive?",
        options: [
            { val: "plants", label: "A drought-resistant crop crisis — I develop a new plant variety that saves thousands from hunger.", icon: "fas fa-seedling" },
            { val: "wild_animals", label: "A rare animal near extinction — I study its biology and design a breeding programme to save it.", icon: "fas fa-dove" },
            { val: "earth_rocks", label: "A degraded ecosystem — I lead the effort to restore the soil, water, and biodiversity.", icon: "fas fa-mountain" },
            { val: "climate", label: "A city facing flooding — I model the climate data and design a solution for the community.", icon: "fas fa-water" },
            { val: "marine", label: "A dying coral reef — I dive in, find the cause, and lead the conservation effort to restore it.", icon: "fas fa-fish" },
            { val: "forensic", label: "A crime scene — finding a single hair, lifting a fingerprint, and identifying the suspect.", icon: "fas fa-fingerprint" },
            { val: "lab_tech", label: "A product batch that fails a purity test — I identify the contamination and fix the process.", icon: "fas fa-clipboard-check" }
        ]
    },
    {
        title: "Which of these discoveries would you be most proud to make?",
        options: [
            { val: "research_nature", label: "Mapping the complete DNA of a rare medicinal plant or undiscovered animal species.", icon: "fas fa-dna" },
            { val: "applied_nature", label: "Developing a fertiliser-free farming method that doubles crop yields sustainably.", icon: "fas fa-tractor" },
            { val: "field_nature", label: "Finding a new species of insect in a tropical rainforest that no human has ever seen.", icon: "fas fa-bug" },
            { val: "climate", label: "Predicting a major weather event three weeks early and saving thousands of lives.", icon: "fas fa-cloud-sun" },
            { val: "marine", label: "Tracking a pod of dolphins across thousands of kilometres using satellite tags.", icon: "fas fa-water" },
            { val: "forensic", label: "Tracing a poison in a victim's blood and linking it directly to the suspect.", icon: "fas fa-vial" },
            { val: "lab_tech", label: "How to calibrate a sophisticated analytical instrument and write a national standard operating procedure.", icon: "fas fa-cog" }
        ]
    },
    {
        title: "When you think about the natural world, what fascinates you the most?",
        options: [
            { val: "plants", label: "Plants and their ecosystems — photosynthesis, root systems, and why forests matter.", icon: "fas fa-tree" },
            { val: "wild_animals", label: "Animals — their behaviour, social structures, and how they survive in the wild.", icon: "fas fa-paw" },
            { val: "earth_rocks", label: "The earth itself — rocks, minerals, soils, and the geological forces that shape the planet.", icon: "fas fa-mountain" },
            { val: "climate", label: "The atmosphere, oceans, and climate — the invisible systems that sustain all life.", icon: "fas fa-wind" },
            { val: "marine", label: "The ocean — from microscopic plankton to the great blue whale, and all the mysteries below the surface.", icon: "fas fa-fish" },
            { val: "forensic", label: "The physical traces we leave behind — fingerprints, fibres, and DNA — and what they reveal.", icon: "fas fa-search" },
            { val: "lab_tech", label: "Precision instruments that can measure a part per billion, and the systems that make every result repeatable.", icon: "fas fa-chart-line" }
        ]
    },
    {
        title: "How do you feel about working in remote or outdoor locations?",
        options: [
            { val: "field_nature", label: "I would love it — hiking through forests and collecting samples in remote places.", icon: "fas fa-hiking" },
            { val: "lab_nature", label: "I prefer a stable lab or office environment, with occasional field trips.", icon: "fas fa-flask" },
            { val: "applied_nature", label: "I want to be outdoors most of the time, working hands-on in the field.", icon: "fas fa-seedling" },
            { val: "research_nature", label: "I prefer a purely indoor research setting with controlled, reproducible experiments.", icon: "fas fa-microscope" },
            { val: "forensic", label: "I'm comfortable anywhere — crime scene or lab — as long as I am finding the truth.", icon: "fas fa-search-location" },
            { val: "lab_tech", label: "I prefer a fully controlled lab environment — precision and consistency are my comfort zone.", icon: "fas fa-flask" }
        ]
    },
    {
        title: "If you could shadow a professional for a day, who would you choose?",
        options: [
            { val: "plants", label: "A botanist in a tropical forest, cataloguing plants and searching for new medicines.", icon: "fas fa-leaf" },
            { val: "wild_animals", label: "A wildlife biologist tracking lions in the savanna or diving with marine mammals.", icon: "fas fa-dove" },
            { val: "earth_rocks", label: "A geologist mapping rock formations and assessing land for infrastructure.", icon: "fas fa-mountain" },
            { val: "climate", label: "A meteorologist at a national weather centre, analyzing storm systems and forecasting.", icon: "fas fa-cloud-sun" },
            { val: "marine", label: "A marine biologist scuba diving on a coral reef, recording fish diversity and health.", icon: "fas fa-fish" },
            { val: "forensic", label: "A forensic chemist testing an unknown substance, or a crime scene investigator dusting for prints.", icon: "fas fa-fingerprint" },
            { val: "lab_tech", label: "A laboratory technologist in a pharmaceutical QC lab, testing products for purity and safety.", icon: "fas fa-pills" }
        ]
    }
];

// Engineering branch for Science & Technology (Q1 option B: machines_structures)
const dynamicQuestionsEngineering = [
    {
        title: "When you see something broken in the physical world, what do you want to fix first?",
        options: [
            { val: "mech_engine", label: "A small gadget or appliance that has stopped working.", icon: "fas fa-tools" },
            { val: "mech_engine", label: "A car, engine, or moving part that needs to run again.", icon: "fas fa-car" },
            { val: "civil_struct", label: "A bridge, road, or building that is cracking or falling apart.", icon: "fas fa-road" },
            { val: "elec_power", label: "A power line, circuit board, or electrical device.", icon: "fas fa-bolt" }
        ]
    },
    {
        title: "Which kind of engineering project excites you the most?",
        options: [
            { val: "mech_engine", label: "Designing a robot or industrial machine that works in a factory.", icon: "fas fa-robot" },
            { val: "civil_struct", label: "Building a dam or highway that serves an entire region.", icon: "fas fa-water" },
            { val: "elec_power", label: "Designing a solar power grid that brings electricity to a remote community.", icon: "fas fa-sun" },
            { val: "chem_process", label: "Developing a new fuel from plant waste or designing a refinery process.", icon: "fas fa-industry" }
        ]
    },
    {
        title: "What part of a city do you look at and think — I could engineer that better?",
        options: [
            { val: "civil_struct", label: "The traffic flow, road networks, and interchange systems.", icon: "fas fa-road" },
            { val: "civil_struct", label: "The buildings, bridges, and stadiums that shape the skyline.", icon: "fas fa-building" },
            { val: "field_site_eng", label: "The water supply — how clean water reaches every tap.", icon: "fas fa-tint" },
            { val: "field_site_eng", label: "Waste management — how rubbish and sewage are handled without harming the environment.", icon: "fas fa-recycle" }
        ]
    },
    {
        title: "Where do you see yourself working in 10 years?",
        options: [
            { val: "field_site_eng", label: "On a construction site, overseeing the building of a bridge, dam, or highway.", icon: "fas fa-hard-hat" },
            { val: "office_design", label: "In an office, using CAD software to model a skyscraper before it is built.", icon: "fas fa-drafting-compass" },
            { val: "field_site_eng", label: "In a water treatment or environmental monitoring facility.", icon: "fas fa-tint" },
            { val: "mech_engine", label: "In a factory or plant, optimizing production processes and machinery.", icon: "fas fa-cogs" }
        ]
    },
    {
        title: "What kind of challenge would make you feel most alive?",
        options: [
            { val: "civil_struct", label: "Designing an earthquake-proof building that saves thousands of lives.", icon: "fas fa-building" },
            { val: "civil_struct", label: "Building a road through a mountain that connects two remote towns.", icon: "fas fa-mountain" },
            { val: "field_site_eng", label: "Cleaning up a polluted river and restoring its ecosystem.", icon: "fas fa-water" },
            { val: "civil_struct", label: "Designing a drainage system that stops a city from flooding every rainy season.", icon: "fas fa-cloud-rain" }
        ]
    },
    {
        title: "Which of these would you be most proud to learn?",
        options: [
            { val: "civil_struct", label: "How to calculate the exact steel and concrete needed for a 20-storey building.", icon: "fas fa-ruler-combined" },
            { val: "civil_struct", label: "How to test soil to determine if it can safely support a heavy dam.", icon: "fas fa-mountain" },
            { val: "field_site_eng", label: "How to design a wastewater treatment process that turns sewage into clean water.", icon: "fas fa-recycle" },
            { val: "office_design", label: "How to survey land and model the best route for a new highway using GIS software.", icon: "fas fa-map-marked-alt" }
        ]
    },
    {
        title: "When you think about engineering, what fascinates you the most?",
        options: [
            { val: "civil_struct", label: "Huge structures that stand for centuries — towers, tunnels, bridges, and monuments.", icon: "fas fa-archway" },
            { val: "field_site_eng", label: "Hidden systems that make life possible — pipes, filters, and canals through farmland.", icon: "fas fa-tint" },
            { val: "mech_engine", label: "The power of machines and engines that move industries and transport the world.", icon: "fas fa-cogs" },
            { val: "elec_power", label: "The speed and intelligence of electronics and power systems.", icon: "fas fa-microchip" }
        ]
    },
    {
        title: "How do you feel about working outdoors in all kinds of weather and conditions?",
        options: [
            { val: "field_site_eng", label: "I would love it — fresh air, real sites, and hands-on problem-solving.", icon: "fas fa-hard-hat" },
            { val: "office_design", label: "I'd split my time between the office and the field.", icon: "fas fa-drafting-compass" },
            { val: "office_design", label: "I prefer a comfortable office with occasional site visits.", icon: "fas fa-desktop" },
            { val: "elec_power", label: "I want to be fully indoors, working with computers or lab equipment.", icon: "fas fa-laptop" }
        ]
    },
    {
        title: "If you could shadow a professional for a day, who would you choose?",
        options: [
            { val: "civil_struct", label: "A civil engineer inspecting the steel frame of a new stadium.", icon: "fas fa-building" },
            { val: "field_site_eng", label: "An environmental engineer testing water samples from a lagoon being restored.", icon: "fas fa-flask" },
            { val: "civil_struct", label: "A structural engineer checking a bridge for cracks after a heavy storm.", icon: "fas fa-road" },
            { val: "mech_engine", label: "A construction manager coordinating trucks, cranes, and workers on a highway project.", icon: "fas fa-hard-hat" }
        ]
    }
];

function selectOption(btn) {
    const parent = btn.parentElement;
    const siblings = parent.querySelectorAll('.option-btn');
    siblings.forEach(s => {
        s.classList.remove('selected');
        s.style.borderColor = "#e2e8f0";
        s.style.background = "#f8fafc";
    });

    btn.classList.add('selected');
    btn.style.borderColor = "#34d399";
    btn.style.background = "#ecfdf5";

    document.getElementById('btnNext').disabled = false;
}

function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('percentIndicator').innerText = `${progress}%`;
    document.getElementById('stepIndicator').innerText = `Step ${currentStep} of ${totalSteps}`;

    document.getElementById('btnPrev').style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    
    const nextBtn = document.getElementById('btnNext');
    if (currentStep === totalSteps) {
        nextBtn.innerText = "Generate My Course Report";
    } else {
        nextBtn.innerText = "Continue";
    }
}

function generateDynamicQuestions(dept) {
    const questions = dynamicQuestions[dept];
    
    // Generate the exact number of steps dynamically
    questions.forEach((q, index) => {
        const stepNum = index + 2; // Questions start at Step 2
        document.getElementById(`step${stepNum}Title`).innerText = q.title;
        let html = '';
        q.options.forEach(opt => {
            html += `<button class="option-btn" data-val="${opt.val}" onclick="selectOption(this)"><i class="${opt.icon}"></i><span>${opt.label}</span></button>`;
        });
        document.getElementById(`step${stepNum}Options`).innerHTML = html;
    });
}

function generateNatureQuestions() {
    dynamicQuestionsNature.forEach((q, index) => {
        const stepNum = index + 2;
        document.getElementById(`step${stepNum}Title`).innerText = q.title;
        let html = '';
        q.options.forEach(opt => {
            html += `<button class="option-btn" data-val="${opt.val}" onclick="selectOption(this)"><i class="${opt.icon}"></i><span>${opt.label}</span></button>`;
        });
        document.getElementById(`step${stepNum}Options`).innerHTML = html;
    });
}

function generateEngineeringQuestions() {
    dynamicQuestionsEngineering.forEach((q, index) => {
        const stepNum = index + 2;
        document.getElementById(`step${stepNum}Title`).innerText = q.title;
        let html = '';
        q.options.forEach(opt => {
            html += `<button class="option-btn" data-val="${opt.val}" onclick="selectOption(this)"><i class="${opt.icon}"></i><span>${opt.label}</span></button>`;
        });
        document.getElementById(`step${stepNum}Options`).innerHTML = html;
    });
}

function nextStep() {
    const currentBlock = document.querySelector(`.question-block[data-step="${currentStep}"]`);
    const selectedBtn = currentBlock.querySelector('.option-btn.selected');
    
    if (selectedBtn) {
        if (currentStep === 1) {
            userProfile.department = selectedBtn.dataset.val;
            const q1Answer = selectedBtn.dataset.val;
            if (q1Answer === 'nature_environment') {
                userProfile.branch = 'nature';
                totalSteps = dynamicQuestionsNature.length + 1;
                generateNatureQuestions();
            } else if (q1Answer === 'machines_structures') {
                userProfile.branch = 'engineering';
                userProfile.department = 'science';
                totalSteps = dynamicQuestionsEngineering.length + 1;
                generateEngineeringQuestions();
            } else {
                userProfile.branch = 'health_tech';
                totalSteps = dynamicQuestions[userProfile.department].length + 1;
                generateDynamicQuestions(userProfile.department);
            }
        } else {
            userProfile[`q${currentStep}`] = selectedBtn.dataset.val;
        }
    }

    if (currentStep < totalSteps) {
        currentBlock.classList.remove('active');
        currentStep++;
        document.querySelector(`.question-block[data-step="${currentStep}"]`).classList.add('active');
        
        const nextSelected = document.querySelector(`.question-block[data-step="${currentStep}"] .option-btn.selected`);
        document.getElementById('btnNext').disabled = !nextSelected;
        
        updateProgress();
    } else {
        calculateResults();
    }
}

function prevStep() {
    if (currentStep > 1) {
        const currentBlock = document.querySelector(`.question-block[data-step="${currentStep}"]`);
        currentBlock.classList.remove('active');
        currentStep--;
        document.querySelector(`.question-block[data-step="${currentStep}"]`).classList.add('active');
        document.getElementById('btnNext').disabled = false;
        updateProgress();
    }
}

function calculateResults() {
    document.getElementById('quizForm').style.display = 'none';
    document.getElementById('progressContainer').style.display = 'none';
    document.getElementById('loadingScreen').style.display = 'block';

    let departmentMatches;

    if (userProfile.branch === 'nature') {
        // Nature branch: filter science courses by nature_environment tag
        // Then score based on Q2-Q10 nature answers
        departmentMatches = courseDatabase.filter(c =>
            c.department === 'science' &&
            c.tags.includes('nature_environment')
        );
        departmentMatches.forEach(course => {
            let score = 0;
            for (let i = 2; i <= totalSteps; i++) {
                let answer = userProfile[`q${i}`];
                if (answer && course.tags.includes(answer)) score += 3;
            }
            course.matchScore = score;
        });
    } else if (userProfile.branch === 'engineering') {
        // Engineering branch: filter science courses with machines_structures tag
        departmentMatches = courseDatabase.filter(c =>
            c.department === 'science' &&
            c.tags.includes('machines_structures')
        );
        departmentMatches.forEach(course => {
            let score = 0;
            for (let i = 2; i <= totalSteps; i++) {
                let answer = userProfile[`q${i}`];
                if (answer && course.tags.includes(answer)) score += 3;
            }
            course.matchScore = score;
        });
    } else {
        // Health/Tech branch: filter by department AND Q2 tag
        departmentMatches = courseDatabase.filter(c => 
            c.department === userProfile.department && 
            c.tags.includes(userProfile.q2)
        );
        departmentMatches.forEach(course => {
            let score = 0;
            for (let i = 3; i <= totalSteps; i++) {
                let answer = userProfile[`q${i}`];
                if (answer && course.tags.includes(answer)) {
                    score += 3;
                }
            }
            course.matchScore = score;
        });
    }

    // Sort by highest score
    departmentMatches.sort((a, b) => b.matchScore - a.matchScore);

    // Keep only the top 4
    const finalMatches = departmentMatches.slice(0, 4);

    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        displayResults(finalMatches);
    }, 2000);
}

function displayResults(matches) {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsScreen = document.getElementById('resultsScreen');
    
    const deptNames = {
        "science": "Science & Technology",
        "commercial": "Commercial & Business",
        "arts": "Arts & Humanities",
        "social": "Social Sciences"
    };
    
    document.getElementById('resDeptName').innerText = deptNames[userProfile.department] || "Your Field";
    
    let html = '';
    
    if (matches.length === 0) {
        html = `<div style="text-align:center; padding: 20px;">
                    <h3 style="color:#ef4444; margin-bottom:10px;"><i class="fas fa-exclamation-circle"></i> No Perfect Match Found</h3>
                    <p style="color:#64748b;">Your unique combination of answers didn't strongly align with our primary courses in this department. Try adjusting your preferences or exploring another department!</p>
                </div>`;
    } else {
        matches.forEach((course, index) => {
            const isTop = index === 0;
            const badgeHTML = isTop ? `<div class="match-badge">#1 Best Fit</div>` : ``;
            const cardClass = isTop ? `primary-match` : ``;

            html += `
                <div class="match-card ${cardClass}">
                    ${badgeHTML}
                    <h3 style="font-size: 1.4rem; color: #1e293b; margin-bottom: 5px;">${course.title}</h3>
                    <div style="margin-bottom: 15px;">
                        <span style="display:inline-block; background:#ecfdf5; color:#059669; padding:4px 10px; border-radius:4px; font-size:0.8rem; font-weight:bold;">${course.competitiveness} Competition</span>
                        <span style="display:inline-block; background:#f0fdf4; color:#16a34a; padding:4px 10px; border-radius:4px; font-size:0.8rem; font-weight:bold; margin-left: 5px;">Perfect Alignment</span>
                    </div>
                    
                    <p style="color: #475569; font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">
                        ${course.desc}
                    </p>

                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px;">
                        <div style="margin-bottom: 10px;">
                            <strong style="color: #0f172a; font-size: 0.9rem;">JAMB Subjects:</strong>
                            <div style="color: #64748b; font-size: 0.9rem;">${course.jamb}</div>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <strong style="color: #0f172a; font-size: 0.9rem;">O'Level Requirements:</strong>
                            <div style="color: #64748b; font-size: 0.9rem;">${course.olevel}</div>
                        </div>
                        <div>
                            <strong style="color: #0f172a; font-size: 0.9rem;">Future Careers:</strong>
                            <div style="color: #64748b; font-size: 0.9rem;">${course.careers}</div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    resultsContainer.innerHTML = html;
    resultsScreen.style.display = 'block';
}

function openDeptGuide() {
    document.getElementById('deptGuideModal').style.display = 'flex';
}

function closeDeptGuide() {
    document.getElementById('deptGuideModal').style.display = 'none';
}
