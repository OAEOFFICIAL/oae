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
        title: "Computer Science",
        department: "science",
        tags: ["computers", "software_dev", "algorithms", "theory_logic", "office_design"],
        jamb: "English, Math, Physics, Chemistry (or Biology/Agric)",
        olevel: "5 Credits: English, Math, Physics, plus two sciences",
        careers: "Software Developer, Data Scientist, AI Engineer, Systems Analyst",
        competitiveness: "High",
        desc: "You are drawn to the world of code, algorithms, and the endless creativity of software. You want to understand how computers think — and then make them think better. Whether you build apps, analyse data, or push the boundaries of artificial intelligence, you belong at the heart of the digital revolution."
    },
    {
        title: "Computer Science & Mathematics",
        department: "science",
        tags: ["computers", "theory_logic", "algorithms", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, plus two others",
        careers: "Algorithm Engineer, Cryptographer, Quantitative Analyst",
        competitiveness: "High",
        desc: "For those who want to master the mathematical foundations of computing. You will solve the most complex problems in logic, security, and data science by combining pure math with high-level programming."
    },
    {
        title: "Computer Science & Economics",
        department: "science",
        tags: ["computers", "data_science", "market_trends", "office_design"],
        jamb: "English, Math, Economics, plus one science/social science",
        olevel: "5 Credits: English, Math, Economics, plus two others",
        careers: "Financial Tech Developer, Business Intelligence Analyst, Economic Modeler",
        competitiveness: "High",
        desc: "The intersection of logic and the market. You will build the systems that run modern finance, using data science and computing to understand and predict economic behaviour."
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
        title: "Mechanical & Production Engineering",
        department: "science",
        tags: ["machines_structures", "mech_engine", "field_site_eng", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, Chem, Further Math/Technical Drawing",
        careers: "Mechanical Engineer, Production Engineer, Automotive Engineer, Maintenance Engineer",
        competitiveness: "High",
        desc: "You are drawn to machines, engines, and the moving parts that make the world run. You enjoy understanding how things work and making them work better, faster, and stronger. You are a builder of machines and a master of motion."
    },
    {
        title: "Electrical & Electronics Engineering",
        department: "science",
        tags: ["machines_structures", "elec_power", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, Chem, Further Math/Technical Drawing",
        careers: "Electrical Engineer, Electronics Designer, Telecommunications Engineer, Power Systems Engineer",
        competitiveness: "Very High",
        desc: "You are fascinated by the invisible power that lights up homes, runs machines, and connects the world. Whether it is the massive scale of the national grid or the tiny world of microchips, you are the one who keeps the current flowing and the devices buzzing."
    },
    {
        title: "Chemical & Process Engineering",
        department: "science",
        tags: ["machines_structures", "chem_process", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, Chem, Further Math/Technical Drawing",
        careers: "Chemical Engineer, Process Engineer, Refinery Manager, Food Process Engineer",
        competitiveness: "High",
        desc: "You are fascinated by how raw materials — oil, gas, minerals, or even food — can be transformed into the products we use every day. You turn raw potential into everyday reality, working with massive reactors and complex systems to create the world's essentials."
    },
    {
        title: "Petroleum & Gas Engineering",
        department: "science",
        tags: ["machines_structures", "petroleum", "field_site_eng", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, Chem, Further Math/Technical Drawing",
        careers: "Petroleum Engineer, Drilling Engineer, Reservoir Engineer, Production Engineer",
        competitiveness: "Very High",
        desc: "You are fascinated by the treasures deep underground — oil and gas — and the technology needed to find them, extract them, and bring them to the surface. You solve problems thousands of metres below the earth to power the world."
    },
    {
        title: "Aerospace & Aeronautical Engineering",
        department: "science",
        tags: ["machines_structures", "aerospace", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, Chem, Further Math/Technical Drawing",
        careers: "Aerospace Engineer, Aeronautical Engineer, Aircraft Designer, Avionics Specialist",
        competitiveness: "Very High",
        desc: "You are drawn to the sky and beyond — the machines that conquer gravity. Whether it is passenger jets, supersonic planes, or rockets that leave our planet, you are a builder of wings and a dreamer of stars."
    },
    {
        title: "Marine & Naval Engineering",
        department: "science",
        tags: ["machines_structures", "marine_eng", "field_site_eng", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, Chem, Further Math/Technical Drawing",
        careers: "Marine Engineer, Naval Architect, Offshore Engineer, Shipyard Manager",
        competitiveness: "High",
        desc: "You are drawn to the sea — the massive machines and structures that conquer it. Whether you are designing elegant hulls or maintaining the massive engines of a tanker, you are the one who tames the waves."
    },
    {
        title: "Mining & Geological Engineering",
        department: "science",
        tags: ["machines_structures", "mining_geo", "field_site_eng", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, Chem, Further Math/Technical Drawing",
        careers: "Mining Engineer, Geological Engineer, Mineral Processor, Geotechnical Engineer",
        competitiveness: "High",
        desc: "You are drawn to the treasures hidden in the earth — the metals, minerals, and gems that build our world. You want to find them, extract them safely, and unlock the earth's riches with respect for the ground."
    },
    {
        title: "Materials & Metallurgical Engineering",
        department: "science",
        tags: ["machines_structures", "materials_eng", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, Chem, Further Math/Technical Drawing",
        careers: "Materials Engineer, Metallurgist, Polymer Scientist, Failure Analyst",
        competitiveness: "High",
        desc: "You are fascinated by what things are made of — metals, plastics, ceramics, and composites. You want to understand why materials break, how to make them stronger, and how to create new ones that have never existed before."
    },
    {
        title: "Agricultural & Biosystems Engineering",
        department: "science",
        tags: ["machines_structures", "agric_eng", "field_site_eng", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, Chem, plus one other",
        careers: "Agricultural Engineer, Irrigation Engineer, Food Engineer, Bio-systems Specialist",
        competitiveness: "High",
        desc: "You are drawn to the land, the food we eat, and the machines and systems that make farming productive and sustainable. You are the engineer who feeds the world, managing everything from soil and water to processing raw harvests."
    },
    {
        title: "Biomedical & Medical Engineering",
        department: "science",
        tags: ["machines_structures", "biomedical", "office_design"],
        jamb: "English, Math, Physics, Biology (or Chemistry)",
        olevel: "5 Credits: English, Math, Physics, Chem, Bio",
        careers: "Biomedical Engineer, Clinical Engineer, Prosthetist, Medical Device Designer",
        competitiveness: "Very High",
        desc: "You are the bridge between medicine and engineering — using technology to replace, repair, and support the human body. You are an engineer of healing, designing devices that save lives and improve the very quality of human existence."
    },
    {
        title: "Mechatronics & Robotics Engineering",
        department: "science",
        tags: ["machines_structures", "robotics", "embedded_systems", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, Chem, plus one science",
        careers: "Mechatronics Engineer, Robotics Specialist, Automation Engineer, Control Systems Engineer",
        competitiveness: "Very High",
        desc: "You are the one who will make machines come alive. You don't want to choose just one field — you want mechanics, electronics, and computer science all at once to build the intelligent machines of the future."
    },
    {
        title: "Computer Engineering",
        department: "science",
        tags: ["computers", "comp_hardware", "embedded_systems", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, Chem, plus one science",
        careers: "Computer Hardware Engineer, Embedded Systems Engineer, Network Architect",
        competitiveness: "High",
        desc: "You are a builder of the digital age — fascinated by the hardware that powers our world. You want to design faster processors, smarter machines, and the physical circuits that make code come alive."
    },
    {
        title: "Software Engineering",
        department: "science",
        tags: ["computers", "software_dev", "app_building", "office_design"],
        jamb: "English, Math, Physics, Chemistry (or Biology/Agric)",
        olevel: "5 Credits: English, Math, Physics, plus two sciences",
        careers: "Software Developer, Systems Architect, Full-Stack Engineer",
        competitiveness: "Very High",
        desc: "You are a creator whose primary tool is code. You want to build elegant, powerful software that solves real-world problems for millions of users. If you can dream it, you can program it."
    },
    {
        title: "Web & Mobile Development",
        department: "science",
        tags: ["computers", "software_dev", "app_building", "flexible"],
        jamb: "English, Math, Physics, Chemistry/Biology",
        olevel: "5 Credits: English, Math, Physics, plus two others",
        careers: "Frontend Developer, App Developer, UI/UX Designer",
        competitiveness: "High",
        desc: "You are drawn to the apps and websites we use every day. You want to design the interfaces, build the features, and ensure that every user has a perfect digital experience."
    },
    {
        title: "Data Science & Artificial Intelligence",
        department: "science",
        tags: ["computers", "data_science", "theory_logic", "office_design"],
        jamb: "English, Math, Physics, Chemistry/Biology",
        olevel: "5 Credits: English, Math, Physics, plus two others",
        careers: "AI Researcher, Data Scientist, ML Engineer",
        competitiveness: "Very High",
        desc: "You want to be at the edge of the future — where machines learn and data tells stories. You will build the intelligent systems that power the next generation of technology."
    },
    {
        title: "Information Technology & Systems",
        department: "science",
        tags: ["computers", "network_security", "it_systems", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, plus two others",
        careers: "IT Manager, Systems Analyst, Network Architect",
        competitiveness: "High",
        desc: "You are the one who makes technology work for people and businesses. You bridge the gap between complex systems and the real-world problems they solve."
    },
    {
        title: "Information & Communication Technology",
        department: "science",
        tags: ["computers", "it_systems", "telecom", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, plus two others",
        careers: "Telecom Engineer, ICT Consultant, Broadcast Engineer",
        competitiveness: "High",
        desc: "You are fascinated by how information travels. You want to connect people, whether through massive telecommunications networks, TV broadcasts, or enterprise IT infrastructure."
    },
    {
        title: "Multimedia Technology",
        department: "science",
        tags: ["computers", "app_building", "it_systems", "flexible"],
        jamb: "English, Math, Physics, Art/Chemistry",
        olevel: "5 Credits: English, Math, Physics, plus two others",
        careers: "Multimedia Designer, Video Editor, Creative Technologist",
        competitiveness: "Medium",
        desc: "You are drawn to the creative side of technology. You want to build video, animation, and digital media systems that inform, entertain, and inspire."
    },
    {
        title: "Cybersecurity & Digital Forensics",
        department: "science",
        tags: ["computers", "network_security", "forensic", "office_design"],
        jamb: "English, Math, Physics, Chemistry",
        olevel: "5 Credits: English, Math, Physics, plus two others",
        careers: "Ethical Hacker, Forensic Analyst, Security Consultant",
        competitiveness: "Very High",
        desc: "You are the guardian of the digital world. You protect systems from attackers, investigate digital crimes, and ensure that data stays safe and secure."
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
        title: "Crop Science & Agriculture",
        department: "science",
        tags: ["plants", "field_site", "nature_environment", "research_nature"],
        jamb: "English, Biology/Agric, Chemistry, Physics/Math",
        olevel: "5 Credits: English, Math, Bio/Agric, Chem, Physics",
        careers: "Agronomist, Crop Scientist, Farm Manager",
        competitiveness: "Medium",
        desc: "You are drawn to the land and the plants that feed us. You want to understand how crops grow, how to protect them, and how to produce more food sustainably to feed a growing world."
    },
    {
        title: "Soil Science & Horticulture",
        department: "science",
        tags: ["plants", "earth_rocks", "field_site", "nature_environment"],
        jamb: "English, Biology/Agric, Chemistry, Physics/Math",
        olevel: "5 Credits: English, Math, Bio/Agric, Chem, Geography",
        careers: "Soil Scientist, Horticulturist, Landscape Manager",
        competitiveness: "Medium",
        desc: "You are fascinated by the foundation of all life — the soil — and the art of growing ornamental plants. Whether maintaining soil health or designing beautiful landscapes, you work at the root of nature."
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
        title: "Oceanography & Marine Sciences",
        department: "science",
        tags: ["nature_environment", "earth_rocks", "marine", "field_site"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Oceanographer, Marine Scientist, Maritime Specialist",
        competitiveness: "Low",
        desc: "You are captivated by the ocean — its physics, chemistry, geology, and its role in shaping the planet. You want to study the sea with scientific instruments, research vessels, and computer models."
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
    {
        title: "Environmental Science & Biology",
        department: "science",
        tags: ["nature_environment", "field_site", "lab_nature"],
        jamb: "English, Biology, Chemistry, Physics/Geography",
        olevel: "5 Credits: English, Math, Bio, Chem, Geography/Physics",
        careers: "Environmental Scientist, Conservation Officer, Ecologist",
        competitiveness: "High",
        desc: "You are deeply concerned about the planet. You want to understand the science behind environmental problems and use that knowledge to create real solutions, from conservation to sustainable policy."
    },
    {
        title: "Environmental Management & Toxicology",
        department: "science",
        tags: ["nature_environment", "toxicology", "office_design"],
        jamb: "English, Biology, Chemistry, Physics",
        olevel: "5 Credits: English, Math, Bio, Chem, Physics",
        careers: "Toxicologist, Environmental Consultant, Waste Management Specialist",
        competitiveness: "Medium",
        desc: "You are drawn to the human side of the environment — investigating pollution, ensuring corporate compliance, and analyzing the impact of chemicals on ecosystems and public health."
    },
    {
        title: "Geology & Geoscience",
        department: "science",
        tags: ["earth_rocks", "field_site", "research_nature", "office_design"],
        jamb: "English, Physics, Chemistry, Biology/Math",
        olevel: "5 Credits: English, Math, Physics, Chem, Bio/Geography",
        careers: "Geologist, Seismologist, Hydrogeologist",
        competitiveness: "High",
        desc: "You are fascinated by the ground beneath your feet. You want to read the history of the earth written in stone and use it to find water, minerals, or simply understand our planet."
    },
    {
        title: "Geophysics & Petroleum Studies",
        department: "science",
        tags: ["earth_rocks", "field_site", "lab_nature"],
        jamb: "English, Physics, Chemistry, Math",
        olevel: "5 Credits: English, Math, Physics, Chem, Geography",
        careers: "Geophysicist, Petroleum Geologist, Exploration Scientist",
        competitiveness: "Very High",
        desc: "You are drawn to the physics of the earth — seismic waves, gravity, and the invisible forces that shape our world. You use advanced technology to see what lies miles beneath the surface."
    },
    {
        title: "Geography & Regional Planning",
        department: "science",
        tags: ["nature_environment", "office_design", "field_site"],
        jamb: "English, Geography, Math, plus one Science/Social Science",
        olevel: "5 Credits: English, Math, Geography, plus two others",
        careers: "Urban Planner, GIS Analyst, Geographer",
        competitiveness: "Medium",
        desc: "You are the one who sees the big picture — how people live, move, and build on the land. You use maps, data, and planning to design cities and manage resources sustainably."
    },
    {
        title: "Meteorology & Climate Science",
        department: "science",
        tags: ["nature_environment", "research_nature", "office_design"],
        jamb: "English, Physics, Math, Geography/Chemistry",
        olevel: "5 Credits: English, Math, Physics, Geography, plus one other",
        careers: "Meteorologist, Climate Scientist, Weather Forecaster",
        competitiveness: "High",
        desc: "You are fascinated by the atmosphere above — the weather that shapes our days and the climate that shapes our future. You forecast storms and study the changing climate to protect communities."
    },
    {
        title: "Physics & Applied Physics",
        department: "science",
        tags: ["research_nature", "theory_logic", "office_design", "lab_nature"],
        jamb: "English, Physics, Math, Chemistry",
        olevel: "5 Credits: English, Math, Physics, Chem, plus one other",
        careers: "Physicist, Research Scientist, Data Analyst",
        competitiveness: "High",
        desc: "You are fascinated by the fundamental laws that govern everything — from the smallest particle to the largest galaxy. You want to understand how the universe works and solve complex theoretical problems."
    },
    {
        title: "Physics with Electronics & Solar Energy",
        department: "science",
        tags: ["elec_power", "machines_structures", "lab_nature", "computers"],
        jamb: "English, Physics, Math, Chemistry",
        olevel: "5 Credits: English, Math, Physics, Chem, plus one other",
        careers: "Electronics Physicist, Solar Energy Specialist, Applied Scientist",
        competitiveness: "High",
        desc: "You want to use the laws of physics to build something useful. From designing renewable solar energy systems to creating advanced electronic sensors, you bridge the gap between pure science and engineering."
    },
    {
        title: "Chemistry & Medicinal Chemistry",
        department: "science",
        tags: ["chemicals_drugs", "lab_nature", "forensic", "lab_tech"],
        jamb: "English, Chemistry, Physics, Biology/Math",
        olevel: "5 Credits: English, Math, Chemistry, Physics, Bio",
        careers: "Chemist, Medicinal Chemist, Forensic Analyst",
        competitiveness: "High",
        desc: "You are fascinated by molecules — how they are made, how they react, and how they can be used to create everything from life-saving medicines to new materials."
    },
    {
        title: "Industrial & Petroleum Chemistry",
        department: "science",
        tags: ["chem_process", "petroleum", "lab_nature", "machines_structures"],
        jamb: "English, Chemistry, Physics, Math",
        olevel: "5 Credits: English, Math, Chemistry, Physics, plus one other",
        careers: "Industrial Chemist, Petroleum Analyst, Quality Control Manager",
        competitiveness: "High",
        desc: "You are drawn to industry — making products on a large scale. Whether you are formulating new plastics, refining crude oil into fuels, or managing a massive chemical plant, you are the architect of modern materials."
    },
    {
        title: "Mathematics & Applied Mathematics",
        department: "science",
        tags: ["theory_logic", "data_science", "numbers_math", "office_design"],
        jamb: "English, Math, Physics, Chemistry/Economics",
        olevel: "5 Credits: English, Math, Physics, plus two others",
        careers: "Mathematician, Quantitative Analyst, Research Scientist",
        competitiveness: "High",
        desc: "You are drawn to the language of the universe — numbers, equations, and the logic that underpins everything. You find beauty in patterns and satisfaction in solving the hardest problems."
    },
    {
        title: "Industrial & Computational Mathematics",
        department: "science",
        tags: ["algorithms", "computers", "data_science", "theory_logic"],
        jamb: "English, Math, Physics, Chemistry/Computer Studies",
        olevel: "5 Credits: English, Math, Physics, plus two others",
        careers: "Computational Scientist, Algorithm Developer, Operations Researcher",
        competitiveness: "High",
        desc: "You want to use maths to solve real-world problems. Whether modelling disease spread, optimizing a supply chain, or building the algorithms that power AI, your logic is the engine of modern industry."
    },
    {
        title: "Statistics & Data Analytics",
        department: "science",
        tags: ["data_science", "numbers_math", "office_design", "discovering_patterns"],
        jamb: "English, Math, Physics/Chemistry, Economics",
        olevel: "5 Credits: English, Math, Physics, plus two others",
        careers: "Statistician, Data Analyst, Market Researcher",
        competitiveness: "High",
        desc: "You are the one who makes sense of uncertainty. You use data and careful analysis to guide decisions that affect millions of people, turning raw numbers into powerful knowledge."
    },
    {
        title: "Actuarial Science & Biostatistics",
        department: "science",
        tags: ["managing_money", "data_science", "numbers_math", "discovering_patterns"],
        jamb: "English, Math, Economics, plus one Science",
        olevel: "5 Credits: English, Math, Economics, plus two Sciences",
        careers: "Actuary, Biostatistician, Risk Manager",
        competitiveness: "Very High",
        desc: "You calculate risk and reward. Whether you are setting insurance premiums in a bank or analyzing clinical trial data in a hospital, you use mathematical probability to predict the future."
    },
    {
        title: "Animal Science & Production",
        department: "science",
        tags: ["wild_animals", "field_site", "nature_environment", "research_nature"],
        jamb: "English, Biology/Agric, Chemistry, Physics/Math",
        olevel: "5 Credits: English, Math, Bio/Agric, Chem, Physics",
        careers: "Animal Scientist, Livestock Manager, Nutritionist",
        competitiveness: "Medium",
        desc: "You are drawn to the creatures that feed us. You want to improve animal health, their production, and the systems that raise them, ensuring sustainable and efficient farming."
    },
    {
        title: "Fisheries & Aquaculture",
        department: "science",
        tags: ["wild_animals", "marine", "field_site", "nature_environment"],
        jamb: "English, Biology/Agric, Chemistry, Physics/Math",
        olevel: "5 Credits: English, Math, Bio/Agric, Chem, Geography",
        careers: "Aquaculturist, Fisheries Officer, Farm Manager",
        competitiveness: "Medium",
        desc: "Your heart is in the water — fish, shrimp, and aquatic farming. You want to study the science of aquaculture to build productive systems that provide protein to communities."
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
                { val: "nature_environment", label: "A chemical reaction, an environmental issue, or something in nature that’s out of balance.", icon: "fas fa-leaf" }
            ]
        },
        {
            title: "When you imagine helping a living being who is unwell, what feels most natural to you?",
            options: [
                { val: "saving_lives", label: "Direct Care: Being right there with them — examining, treating, and guiding recovery.", icon: "fas fa-stethoscope" },
                { val: "lab", label: "Behind the Scenes: Working in a lab or research centre to find out what is wrong.", icon: "fas fa-vial" },
                { val: "field_site", label: "Community Health: Making sure environments stay healthy and preventing outbreaks.", icon: "fas fa-shield-virus" },
                { val: "physiotherapy", label: "Rehabilitation: Helping patients regain movement, speech, or strength after injury.", icon: "fas fa-walking" }
            ]
        },
        {
            title: "Which part of being a scientist or healer most excites you?",
            options: [
                { val: "discovering_patterns", label: "The Diagnosis: Using tests and logic to find the cause of mysterious illnesses.", icon: "fas fa-search-plus" },
                { val: "high_stress", label: "The Procedure: Performing surgical or delicate operations with your hands.", icon: "fas fa-hands" },
                { val: "chemicals_drugs", label: "The Medicine: Understanding drugs, how to make them, and how they work in the body.", icon: "fas fa-pills" },
                { val: "nursing_midwifery", label: "The Support: Providing continuous care for mothers, newborns, or hospital patients.", icon: "fas fa-baby" }
            ]
        },
        {
            title: "How do you handle high-pressure situations?",
            options: [
                { val: "high_stress", label: "I stay calm, make fast decisions, and take charge when every second counts.", icon: "fas fa-bolt" },
                { val: "structured", label: "I prefer a steady, controlled environment where I can think deeply.", icon: "fas fa-brain" },
                { val: "flexible", label: "I rely on clear protocols and teamwork to support others.", icon: "fas fa-users" },
                { val: "high_stress", label: "I thrive on adrenaline and acting purely on professional instinct.", icon: "fas fa-fire" }
            ]
        },
        {
            title: "Where do you see yourself working in 10 years?",
            options: [
                { val: "hospital", label: "A Major Hospital: Dealing with emergencies and performing surgeries.", icon: "fas fa-hospital-alt" },
                { val: "lab", label: "A Research Lab: Studying diseases and testing new treatments or vaccines.", icon: "fas fa-microscope" },
                { val: "structured", label: "A Specialist Clinic: Focusing on eyes, teeth, or patient rehabilitation.", icon: "fas fa-clinic-medical" },
                { val: "chemicals_drugs", label: "A Pharmaceutical Hub: Managing medications or developing new drugs.", icon: "fas fa-prescription-bottle-alt" }
            ]
        },
        {
            title: "What kind of challenge would make you feel most alive?",
            options: [
                { val: "high_stress", label: "A Medical Emergency: Saving a life when every second counts.", icon: "fas fa-ambulance" },
                { val: "discovering_patterns", label: "A Diagnostic Puzzle: Finding the cause of a rare or unknown disease.", icon: "fas fa-puzzle-piece" },
                { val: "nursing_midwifery", label: "A Journey of Care: Helping a mother through birth or a patient through recovery.", icon: "fas fa-heart" },
                { val: "public_health", label: "A Global Health Crisis: Stopping an outbreak and protecting a community.", icon: "fas fa-globe-africa" }
            ]
        },
        {
            title: "What area of biology/chemistry fascinates you most?",
            options: [
                { val: "human_body", label: "Human Anatomy: How every organ and system works together to sustain life.", icon: "fas fa-human-capacity" },
                { val: "chemicals_drugs", label: "Pharmacology: How molecules and drugs interact with cells to cure disease.", icon: "fas fa-pills" },
                { val: "genetics", label: "Genetics: The DNA blueprint that determines who we are and what diseases we carry.", icon: "fas fa-dna" },
                { val: "microbiology", label: "Microbiology: The invisible world of bacteria and viruses and how we fight them.", icon: "fas fa-viruses" }
            ]
        },
        {
            title: "How do you prefer to spend your work day?",
            options: [
                { val: "hospital", label: "Always Moving: Walking wards, seeing patients, and taking quick action.", icon: "fas fa-walking" },
                { val: "lab", label: "Focused Study: Working in a quiet, sterile lab with high-tech equipment.", icon: "fas fa-microscope" },
                { val: "structured", label: "Patient Interaction: Talking to people and counseling them on their health.", icon: "fas fa-comments" },
                { val: "flexible", label: "Community Outreach: Traveling to different locations to improve public health.", icon: "fas fa-route" }
            ]
        },
        {
            title: "Which of these would you be most proud to achieve?",
            options: [
                { val: "saving_lives", label: "Successfully performing a difficult surgery that saves a patient's life.", icon: "fas fa-star" },
                { val: "lab", label: "Discovering a new drug or vaccine that wipes out a major disease.", icon: "fas fa-search" },
                { val: "public_health", label: "Designing a healthcare system that makes medical care free for everyone.", icon: "fas fa-university" },
                { val: "physiotherapy", label: "Helping a paralyzed patient take their very first steps after months of therapy.", icon: "fas fa-walking" }
            ]
        },
        {
            title: "If you could shadow a professional, who would it be?",
            options: [
                { val: "human_body", label: "A Neurosurgeon operating on the brain at a top hospital.", icon: "fas fa-brain" },
                { val: "lab", label: "A Medical Researcher sequencing DNA in a state-of-the-art lab.", icon: "fas fa-dna" },
                { val: "public_health", label: "A WHO Official managing an international disease prevention program.", icon: "fas fa-globe" },
                { val: "chemicals_drugs", label: "A Lead Pharmacologist developing the next generation of cancer drugs.", icon: "fas fa-pills" }
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
            { val: "plants", label: "Flora: Plants, forests, and how they produce food and medicine.", icon: "fas fa-seedling" },
            { val: "wild_animals", label: "Fauna: Wild animals, their biology, and protecting their habitats.", icon: "fas fa-paw" },
            { val: "earth_rocks", label: "Geology: Rocks, minerals, and the physical forces that shape the Earth.", icon: "fas fa-mountain" },
            { val: "nature_environment", label: "Environment: The big picture — pollution, climate change, and human impact.", icon: "fas fa-globe-americas" }
        ]
    },
    {
        title: "What kind of scientific work excites you the most?",
        options: [
            { val: "plants", label: "Discovery: Mapping DNA of plants or finding new plant species.", icon: "fas fa-leaf" },
            { val: "wild_animals", label: "Exploration: Working in remote forests or oceans to study wildlife.", icon: "fas fa-binoculars" },
            { val: "earth_rocks", label: "Investigation: Exploring the earth's crust to find hidden resources.", icon: "fas fa-gem" },
            { val: "nature_environment", label: "Protection: Investigating pollution and holding polluters accountable.", icon: "fas fa-shield-alt" }
        ]
    },
    {
        title: "Where do you see yourself working in 10 years?",
        options: [
            { val: "plants", label: "In a Biotech Lab: Developing new agricultural products or medicines.", icon: "fas fa-flask" },
            { val: "wild_animals", label: "In a National Park: Managing conservation and wildlife protection.", icon: "fas fa-tree" },
            { val: "earth_rocks", label: "In the Field: Surveying land for minerals or oil extraction.", icon: "fas fa-map-marked-alt" },
            { val: "nature_environment", label: "In a Government Agency: Writing and enforcing environmental laws.", icon: "fas fa-building" }
        ]
    },
    {
        title: "What kind of challenge would make you feel most alive?",
        options: [
            { val: "plants", label: "Saving a Crop: Developing a plant that can survive extreme droughts.", icon: "fas fa-sun" },
            { val: "wild_animals", label: "Saving a Species: Bringing a rare animal back from the brink of extinction.", icon: "fas fa-dove" },
            { val: "earth_rocks", label: "Solving a Mystery: Using rocks to understand the history of the earth.", icon: "fas fa-search" },
            { val: "nature_environment", label: "Saving a River: Collecting samples to shut down illegal toxic dumping.", icon: "fas fa-water" }
        ]
    },
    {
        title: "Which tool would you be most comfortable using daily?",
        options: [
            { val: "plants", label: "Microscopes and genetic sequencers for studying plant cells.", icon: "fas fa-microscope" },
            { val: "wild_animals", label: "High-powered binoculars and GPS for tracking wildlife.", icon: "fas fa-binoculars" },
            { val: "earth_rocks", label: "Geological hammers, compasses, and seismic mapping tools.", icon: "fas fa-hammer" },
            { val: "nature_environment", label: "Water quality testers and air pollution monitoring kits.", icon: "fas fa-vial" }
        ]
    },
    {
        title: "What is your primary goal as a scientist?",
        options: [
            { val: "plants", label: "Ensuring global food security through advanced agriculture.", icon: "fas fa-utensils" },
            { val: "wild_animals", label: "Protecting biodiversity and preserving natural animal habitats.", icon: "fas fa-paw" },
            { val: "earth_rocks", label: "Discovering and sustainably extracting the earth's natural resources.", icon: "fas fa-industry" },
            { val: "nature_environment", label: "Reversing the effects of climate change and cleaning up pollution.", icon: "fas fa-leaf" }
        ]
    },
    {
        title: "Which of these subjects did you find most fascinating?",
        options: [
            { val: "plants", label: "Botany: How plants breathe, grow, and adapt to their surroundings.", icon: "fas fa-seedling" },
            { val: "wild_animals", label: "Zoology: How animals behave, evolve, and survive in the wild.", icon: "fas fa-fish" },
            { val: "earth_rocks", label: "Geology: How tectonic plates shift and create mountains and oceans.", icon: "fas fa-mountain" },
            { val: "nature_environment", label: "Toxicology: How chemicals interact with living organisms and ecosystems.", icon: "fas fa-skull-crossbones" }
        ]
    },
    {
        title: "What kind of environment do you thrive in?",
        options: [
            { val: "plants", label: "A quiet greenhouse or an agricultural research farm.", icon: "fas fa-tractor" },
            { val: "wild_animals", label: "The great outdoors — forests, savannas, and rugged terrain.", icon: "fas fa-campground" },
            { val: "earth_rocks", label: "Deep underground, in mines, or working with rock formations.", icon: "fas fa-hard-hat" },
            { val: "nature_environment", label: "A mix of field testing and office work writing policy reports.", icon: "fas fa-file-alt" }
        ]
    },
    {
        title: "If you could shadow a professional for a day, who would you choose?",
        options: [
            { val: "plants", label: "A Plant Geneticist developing a new disease-resistant crop.", icon: "fas fa-dna" },
            { val: "wild_animals", label: "A Wildlife Biologist tagging and tracking endangered lions.", icon: "fas fa-paw" },
            { val: "earth_rocks", label: "A Geologist analyzing core samples from a new drill site.", icon: "fas fa-gem" },
            { val: "nature_environment", label: "An Environmental Scientist testing a polluted river for heavy metals.", icon: "fas fa-water" }
        ]
    }
];

// Engineering branch for Science & Technology (Q1 option B: machines_structures)
const dynamicQuestionsEngineering = [
    {
        title: "When you see something broken in the physical world, what do you want to fix first?",
        options: [
            { val: "mech_engine", label: "Machines: A car engine, a robotic arm, or a complex industrial device.", icon: "fas fa-cogs" },
            { val: "civil_struct", label: "Structures: A bridge, highway, or building that is failing or needs building.", icon: "fas fa-archway" },
            { val: "elec_power", label: "Power Systems: A circuit board, a solar grid, or an electrical network.", icon: "fas fa-bolt" },
            { val: "petroleum", label: "Resources: An oil well, a gas refinery, or a mineral extraction site.", icon: "fas fa-oil-well" }
        ]
    },
    {
        title: "Which kind of engineering project excites you the most?",
        options: [
            { val: "robotics", label: "Automation: Designing robots and smart machines for factories or space.", icon: "fas fa-robot" },
            { val: "aerospace", label: "Aerodynamics: Building aircraft, drones, or rockets that travel high and fast.", icon: "fas fa-plane" },
            { val: "marine_eng", label: "Maritime: Designing ships, offshore platforms, or deep-sea engines.", icon: "fas fa-ship" },
            { val: "biomedical", label: "Biotech: Creating artificial hearts, prosthetic limbs, or life-saving devices.", icon: "fas fa-heartbeat" }
        ]
    },
    {
        title: "Where do you see yourself working in 10 years?",
        options: [
            { val: "field_site_eng", label: "On Site: Managing a construction project or an oil rig in the field.", icon: "fas fa-hard-hat" },
            { val: "office_design", label: "In the Studio: Using CAD software to design skyscrapers or engines.", icon: "fas fa-desktop" },
            { val: "robotics", label: "In a Lab: Researching robotics, new materials, or aerospace tech.", icon: "fas fa-brain" },
            { val: "agric_eng", label: "Rural Impact: Engineering food systems, dams, and tractors for farms.", icon: "fas fa-tractor" }
        ]
    },
    {
        title: "What kind of challenge would make you feel most alive?",
        options: [
            { val: "civil_struct", label: "Building a bridge that connects a remote village to the world.", icon: "fas fa-road" },
            { val: "elec_power", label: "Bringing electricity to a community that has never had it.", icon: "fas fa-sun" },
            { val: "aerospace", label: "Designing a rocket that takes the first humans to Mars.", icon: "fas fa-rocket" },
            { val: "biomedical", label: "Inventing a robotic limb that feels and moves like a real one.", icon: "fas fa-hand-paper" }
        ]
    },
    {
        title: "What is your attitude toward safety and ethics in engineering?",
        options: [
            { val: "civil_struct", label: "Safety is #1 — I want to ensure buildings never collapse.", icon: "fas fa-shield-alt" },
            { val: "mining_geo", label: "Ethics is key — I want to ensure mining doesn't destroy the earth.", icon: "fas fa-leaf" },
            { val: "materials_eng", label: "Quality is vital — I want to create the strongest, safest materials.", icon: "fas fa-atom" },
            { val: "biomedical", label: "Humanity is first — I want to design tools that extend human life.", icon: "fas fa-heart" }
        ]
    },
    {
        title: "Which environment sounds most interesting to you?",
        options: [
            { val: "marine_eng", label: "The Deep Ocean: Designing structures that withstand massive pressure.", icon: "fas fa-water" },
            { val: "aerospace", label: "High Altitude: Designing wings that slice through thin air at Mach 3.", icon: "fas fa-wind" },
            { val: "mining_geo", label: "Underground: Designing tunnels and shafts for mineral extraction.", icon: "fas fa-mountain" },
            { val: "agric_eng", label: "The Farm: Designing automated irrigation and harvest systems.", icon: "fas fa-seedling" }
        ]
    },
    {
        title: "How do you prefer to spend your creative energy?",
        options: [
            { val: "office_design", label: "Sketching and 3D modeling on a powerful computer.", icon: "fas fa-draw-polygon" },
            { val: "mech_engine", label: "Tinkering with gears, pistons, and physical prototypes.", icon: "fas fa-cogs" },
            { val: "elec_power", label: "Soldering circuits and writing code for microcontrollers.", icon: "fas fa-microchip" },
            { val: "field_site_eng", label: "Leading a crew of workers to execute a massive project.", icon: "fas fa-users" }
        ]
    },
    {
        title: "What is your 'Dream Project'?",
        options: [
            { val: "aerospace", label: "A self-sustaining city on the Moon or Mars.", icon: "fas fa-moon" },
            { val: "marine_eng", label: "A floating city that moves across the oceans.", icon: "fas fa-anchor" },
            { val: "civil_struct", label: "A skyscraper that is 2 kilometres tall and perfectly safe.", icon: "fas fa-building" },
            { val: "robotics", label: "A robotic companion that can perform any human task.", icon: "fas fa-robot" }
        ]
    },
    {
        title: "Which of these subjects did you find most fascinating?",
        options: [
            { val: "mech_engine", label: "Physics: Forces, motion, and energy in machines.", icon: "fas fa-apple-alt" },
            { val: "materials_eng", label: "Chemistry: How atoms bond to create steel, carbon, or glass.", icon: "fas fa-vial" },
            { val: "mining_geo", label: "Geology: The composition of the earth and how to find minerals.", icon: "fas fa-layer-group" },
            { val: "elec_power", label: "Electromagnetism: How current flows and powers the world.", icon: "fas fa-bolt" }
        ]
    }
];

// Computing branch for Science & Technology (Q1 option C: computers)
const dynamicQuestionsComputing = [
    {
        title: "When you see a problem with computers or technology, what do you want to fix first?",
        options: [
            { val: "software_dev", label: "The Software: The app code or the programme that is crashing.", icon: "fas fa-code" },
            { val: "it_systems", label: "The System: How computers, networks, and people work together.", icon: "fas fa-network-wired" },
            { val: "data_science", label: "The Data: Messy records that need to be organised and analysed.", icon: "fas fa-database" },
            { val: "network_security", label: "The Security: A breach where someone has broken into the system.", icon: "fas fa-shield-alt" }
        ]
    },
    {
        title: "Which kind of digital project excites you the most?",
        options: [
            { val: "app_building", label: "Engineering: Building a mobile app or a web platform for millions.", icon: "fas fa-mobile-alt" },
            { val: "it_systems", label: "Systems: Setting up a company's entire network and servers.", icon: "fas fa-server" },
            { val: "data_science", label: "AI: Building a system that suggests movies or predicts trends.", icon: "fas fa-brain" },
            { val: "forensic", label: "Forensics: Recovering deleted files and tracing a hacker's path.", icon: "fas fa-user-secret" }
        ]
    },
    {
        title: "What part of technology draws you in the most?",
        options: [
            { val: "software_dev", label: "The Experience: How an app looks, feels, and works for the user.", icon: "fas fa-paint-brush" },
            { val: "it_systems", label: "The Solution: Matching the right technology to a business problem.", icon: "fas fa-lightbulb" },
            { val: "data_science", label: "The Patterns: Finding hidden trends that no human could spot.", icon: "fas fa-chart-line" },
            { val: "network_security", label: "The Battle: Ethical hacking to find weaknesses before the bad guys do.", icon: "fas fa-user-ninja" }
        ]
    },
    {
        title: "Where do you see yourself working in 10 years?",
        options: [
            { val: "app_building", label: "Tech Startup: Launching a new app that solves a real problem.", icon: "fas fa-rocket" },
            { val: "it_systems", label: "Consultancy: Helping companies improve their business systems.", icon: "fas fa-briefcase" },
            { val: "data_science", label: "Research Lab: Pushing the boundaries of what machines can learn.", icon: "fas fa-microscope" },
            { val: "forensic", label: "Police Unit: Analysing suspects' devices for criminal evidence.", icon: "fas fa-building-shield" }
        ]
    },
    {
        title: "What kind of challenge would make you feel most alive?",
        options: [
            { val: "app_building", label: "Scaling a website to handle a million visitors at once.", icon: "fas fa-users" },
            { val: "it_systems", label: "Getting a company's crashed email server back online in an hour.", icon: "fas fa-envelope-open-text" },
            { val: "data_science", label: "Building a model that predicts exactly what a user will click next.", icon: "fas fa-mouse-pointer" },
            { val: "network_security", label: "Breaking a ransomware encryption to restore a hospital's data.", icon: "fas fa-unlock-alt" }
        ]
    },
    {
        title: "Which of these would you be most proud to learn?",
        options: [
            { val: "software_dev", label: "How to write clean, reusable code that a whole team can use.", icon: "fas fa-broom" },
            { val: "it_systems", label: "How to manage a massive IT project from planning to completion.", icon: "fas fa-clipboard-list" },
            { val: "data_science", label: "How to build a neural network that can see and understand images.", icon: "fas fa-eye" },
            { val: "network_security", label: "How to perform a penetration test on a corporate network.", icon: "fas fa-shield-virus" }
        ]
    },
    {
        title: "When you think about technology, what fascinates you the most?",
        options: [
            { val: "software_dev", label: "The Impact: Creating something tangible that solves real problems.", icon: "fas fa-heart" },
            { val: "it_systems", label: "The Users: Making technology easy and helpful for everyone.", icon: "fas fa-users" },
            { val: "data_science", label: "The Intelligence: How machines can learn and become smart.", icon: "fas fa-microchip" },
            { val: "forensic", label: "The Clues: How every click and file tells a forensic story.", icon: "fas fa-search-plus" }
        ]
    },
    {
        title: "How do you feel about working with others?",
        options: [
            { val: "software_dev", label: "I love it — great software is built by great, collaborative teams.", icon: "fas fa-users" },
            { val: "it_systems", label: "I love being the go-to person people rely on for solutions.", icon: "fas fa-hands-helping" },
            { val: "data_science", label: "I prefer to present my data findings to a team of decision-makers.", icon: "fas fa-presentation" },
            { val: "network_security", label: "I am the vault keeper, protecting everyone's data and privacy.", icon: "fas fa-vault" }
        ]
    },
    {
        title: "If you could shadow a professional for a day, who would you choose?",
        options: [
            { val: "app_building", label: "A Mobile App Developer launching a feature to millions.", icon: "fas fa-mobile-alt" },
            { val: "it_systems", label: "An IT Manager planning a massive digital upgrade for a hospital.", icon: "fas fa-clinic-medical" },
            { val: "data_science", label: "A Machine Learning Engineer training a self-driving car.", icon: "fas fa-car" },
            { val: "network_security", label: "An Ethical Hacker trying to break into a bank's system.", icon: "fas fa-user-ninja" }
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
    questions.forEach((q, index) => {
        const stepNum = index + 2; 
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
        const stepNum = index + 3; // Branch questions start at Step 3
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
        const stepNum = index + 3; // Branch questions start at Step 3
        document.getElementById(`step${stepNum}Title`).innerText = q.title;
        let html = '';
        q.options.forEach(opt => {
            html += `<button class="option-btn" data-val="${opt.val}" onclick="selectOption(this)"><i class="${opt.icon}"></i><span>${opt.label}</span></button>`;
        });
        document.getElementById(`step${stepNum}Options`).innerHTML = html;
    });
}

function generateComputingQuestions() {
    dynamicQuestionsComputing.forEach((q, index) => {
        const stepNum = index + 3; // Branch questions start at Step 3
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
        userProfile[`q${currentStep}`] = selectedBtn.dataset.val;

        if (currentStep === 1) {
            userProfile.department = selectedBtn.dataset.val;
            totalSteps = dynamicQuestions[userProfile.department].length + 1;
            generateDynamicQuestions(userProfile.department);
            userProfile.branch = 'health_tech'; // Default for Science, or only branch for others
        } else if (currentStep === 2 && userProfile.department === 'science') {
            const q2Answer = selectedBtn.dataset.val;
            if (q2Answer === 'nature_environment') {
                userProfile.branch = 'nature';
                totalSteps = dynamicQuestionsNature.length + 2; // Q1 + Q2 + dynamic questions
                generateNatureQuestions();
            } else if (q2Answer === 'machines_structures') {
                userProfile.branch = 'engineering';
                totalSteps = dynamicQuestionsEngineering.length + 2;
                generateEngineeringQuestions();
            } else if (q2Answer === 'computers') {
                userProfile.branch = 'computing';
                totalSteps = dynamicQuestionsComputing.length + 2;
                generateComputingQuestions();
            }
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
    } else if (userProfile.branch === 'computing') {
        // Computing branch: filter science courses with computers tag
        departmentMatches = courseDatabase.filter(c =>
            c.department === 'science' &&
            c.tags.includes('computers')
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

    // Keep only the top 6 to give a comprehensive list of related options
    const finalMatches = departmentMatches.slice(0, 6);

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
        const topCourse = matches[0];
        
        // Render Top Match Prominently
        html += `
            <div class="match-card primary-match" style="border: 2px solid #2563eb; background: #f8fafc; transform: scale(1.02); margin-bottom: 40px; position: relative;">
                <div class="match-badge" style="background: #2563eb; color: white; padding: 6px 15px; border-radius: 20px; font-weight: bold; font-size: 0.85rem; display: inline-block; margin-bottom: 15px;">
                    <i class="fas fa-star" style="color: #fbbf24; margin-right: 5px;"></i> #1 Primary Career Match
                </div>
                <h3 style="font-size: 1.6rem; color: #1e293b; margin-bottom: 5px;">${topCourse.title}</h3>
                <div style="margin-bottom: 15px;">
                    <span style="display:inline-block; background:#ecfdf5; color:#059669; padding:4px 10px; border-radius:4px; font-size:0.8rem; font-weight:bold;">${topCourse.competitiveness} Competition</span>
                    <span style="display:inline-block; background:#eff6ff; color:#2563eb; padding:4px 10px; border-radius:4px; font-size:0.8rem; font-weight:bold; margin-left: 5px;">Highly Recommended</span>
                </div>
                
                <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin-bottom: 20px;">
                    ${topCourse.desc}
                </p>

                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; display: grid; gap: 15px;">
                    <div>
                        <strong style="color: #0f172a; font-size: 0.9rem; display: block; margin-bottom: 4px;"><i class="fas fa-book-open"></i> JAMB Subjects:</strong>
                        <div style="color: #64748b; font-size: 0.9rem;">${topCourse.jamb}</div>
                    </div>
                    <div>
                        <strong style="color: #0f172a; font-size: 0.9rem; display: block; margin-bottom: 4px;"><i class="fas fa-graduation-cap"></i> O'Level Requirements:</strong>
                        <div style="color: #64748b; font-size: 0.9rem;">${topCourse.olevel}</div>
                    </div>
                    <div>
                        <strong style="color: #0f172a; font-size: 0.9rem; display: block; margin-bottom: 4px;"><i class="fas fa-briefcase"></i> Future Careers:</strong>
                        <div style="color: #64748b; font-size: 0.9rem;">${topCourse.careers}</div>
                    </div>
                </div>
            </div>
        `;

        if (matches.length > 1) {
            html += `
            <div style="margin-top: 30px; margin-bottom: 20px;">
                <h4 style="font-size: 1.2rem; color: #334155; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Related Courses You Can Also Study</h4>
                <p style="color: #64748b; font-size: 0.9rem; margin-top: 5px;">Based on your answers, you also have a strong affinity for these related fields:</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
            `;
            
            for (let i = 1; i < matches.length; i++) {
                const course = matches[i];
                html += `
                    <div class="match-card" style="padding: 20px; border-top: 4px solid #64748b; background: white; display: flex; flex-direction: column; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                        <h3 style="font-size: 1.25rem; color: #1e293b; margin-bottom: 8px;">${course.title}</h3>
                        <div style="margin-bottom: 12px;">
                            <span style="display:inline-block; background:#f1f5f9; color:#475569; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold;">${course.competitiveness} Competition</span>
                        </div>
                        <p style="color: #475569; font-size: 0.95rem; margin-bottom: 20px; line-height: 1.6; flex-grow: 1;">${course.desc}</p>
                        
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 15px;">
                            <div style="margin-bottom: 10px;">
                                <strong style="color: #334155; font-size: 0.85rem; display: block; margin-bottom: 2px;"><i class="fas fa-book-open" style="color: #94a3b8; margin-right: 4px;"></i> JAMB Subjects:</strong>
                                <div style="color: #64748b; font-size: 0.85rem;">${course.jamb}</div>
                            </div>
                            <div>
                                <strong style="color: #334155; font-size: 0.85rem; display: block; margin-bottom: 2px;"><i class="fas fa-graduation-cap" style="color: #94a3b8; margin-right: 4px;"></i> O'Level Requirements:</strong>
                                <div style="color: #64748b; font-size: 0.85rem;">${course.olevel}</div>
                            </div>
                        </div>
                        
                        <div style="padding-top: 10px; border-top: 1px dashed #e2e8f0;">
                            <strong style="font-size: 0.85rem; color: #334155; display: block; margin-bottom: 4px;"><i class="fas fa-briefcase" style="color: #94a3b8; margin-right: 4px;"></i> Potential Careers:</strong>
                            <div style="font-size: 0.85rem; color: #2563eb; font-weight: 500; line-height: 1.4;">${course.careers}</div>
                        </div>
                    </div>
                `;
            }
            html += `</div>`;
        }
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
