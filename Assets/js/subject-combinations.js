document.addEventListener('DOMContentLoaded', () => {
    
    // Top 10 Database
    const coursesDB = [
        {
            name: "Medicine and Surgery",
            jamb: ["Use of English", "Biology", "Chemistry", "Physics"],
            olevel: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"],
            remarks: "Highly competitive. A minimum of 250 in JAMB is widely recommended. All O'Level subjects must be passed at credit level (C6 or better) in ONE sitting for top universities like UNILAG, UI, and OAU."
        },
        {
            name: "Law",
            jamb: ["Use of English", "Literature in English", "Plus any two (2) Arts or Social Science subjects"],
            olevel: ["English Language", "Mathematics", "Literature in English", "Plus any two (2) Arts or Social Science subjects"],
            remarks: "Mathematics is compulsory at O'Level. Some universities strictly require a Credit in Literature."
        },
        {
            name: "Computer Science",
            jamb: ["Use of English", "Mathematics", "Physics", "Plus one of Biology, Chemistry, Agric Science, Economics or Geography"],
            olevel: ["English Language", "Mathematics", "Physics", "Plus two other science subjects"],
            remarks: "Most universities accept Chemistry as the 4th JAMB subject instead of Biology."
        },
        {
            name: "Mass Communication",
            jamb: ["Use of English", "Literature in English", "Plus any two Arts or Social Science subjects"],
            olevel: ["English Language", "Mathematics", "Literature in English", "Plus two Arts or Social Science subjects"],
            remarks: "Very few universities will accept passes (D7/E8) in Mathematics for Mass Comm."
        },
        {
            name: "Accounting",
            jamb: ["Use of English", "Mathematics", "Economics", "Plus any Social Science subject"],
            olevel: ["English Language", "Mathematics", "Economics", "Plus any two other subjects"],
            remarks: "If you don't have Economics at O'Level, you might not be admitted. Commerce is often accepted."
        },
        {
            name: "Nursing Science",
            jamb: ["Use of English", "Biology", "Chemistry", "Physics"],
            olevel: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"],
            remarks: "Similar stringency to Medicine. Most Federal Universities require ONE sitting for your WAEC/NECO."
        },
        {
            name: "Pharmacy",
            jamb: ["Use of English", "Biology", "Chemistry", "Physics"],
            olevel: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"],
            remarks: "Highly competitive science course."
        },
        {
            name: "Mechanical Engineering",
            jamb: ["Use of English", "Mathematics", "Physics", "Chemistry"],
            olevel: ["English Language", "Mathematics", "Physics", "Chemistry", "Plus any other science subject"],
            remarks: "Further Mathematics is highly recommended at O'Level but usually not compulsory."
        },
        {
            name: "Economics",
            jamb: ["Use of English", "Mathematics", "Economics", "Plus any Social Science or Arts subject"],
            olevel: ["English Language", "Mathematics", "Economics", "Plus any two of Arts or Social Science subjects"],
            remarks: "Mathematics and Economics are strictly compulsory at credit level."
        },
        {
            name: "Architecture",
            jamb: ["Use of English", "Physics", "Mathematics", "Plus any of Chemistry, Geography, Art, Biology, or Economics"],
            olevel: ["English Language", "Mathematics", "Physics", "Plus any two of Chemistry, Geography, Art, Biology, or Economics"],
            remarks: "Technical Drawing or Fine Art at O'Level gives a huge advantage during screening in some universities."
        },
        {
                "name": "Accounting / Accountancy",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "plus any Social Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Actuarial Science",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "and any other Social Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Adult Education",
                "jamb": [
                        "Use of English",
                        "Government/History",
                        "one Social Science subject",
                        "and any other subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Agricultural Economics",
                "jamb": [
                        "Use of English",
                        "Chemistry",
                        "Biology/Agricultural Science",
                        "and Mathematics or Physics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Agricultural Engineering",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Agricultural Extension",
                "jamb": [
                        "Use of English",
                        "Chemistry",
                        "Biology or Agriculture",
                        "and Physics or Mathematics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Agricultural Science Education",
                "jamb": [
                        "Use of English",
                        "Any three from Chemistry",
                        "Biology",
                        "Agriculture",
                        "Physics",
                        "Economics",
                        "Geography",
                        "and Mathematics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Agriculture",
                "jamb": [
                        "Use of English",
                        "Chemistry",
                        "Biology/Agricultural Science",
                        "and any of Physics or Mathematics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Agronomy",
                "jamb": [
                        "Use of English",
                        "Chemistry",
                        "Biology or Agriculture",
                        "and Physics or Mathematics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Anatomy / Human Anatomy",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Animal Production and Science",
                "jamb": [
                        "Use of English",
                        "Chemistry",
                        "Biology/Agriculture",
                        "and Mathematics or Physics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Applied Biology",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Chemistry",
                        "and Physics or Mathematics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Applied Chemistry",
                "jamb": [
                        "Use of English",
                        "Chemistry",
                        "Mathematics",
                        "and any of Physics/Biology/Agricultural Sci."
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Applied Geophysics",
                "jamb": [
                        "Use of English",
                        "Physics",
                        "Mathematics",
                        "and Chemistry or Geography"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Applied Microbiology",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Chemistry",
                        "and Physics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Arts (Combined Honours)",
                "jamb": [
                        "Use of English",
                        "Any three Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Banking and Finance",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "plus one of Government and Geography"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Biochemistry",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Biological Sciences",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Chemistry",
                        "and Physics or Mathematics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Biomedical Engineering",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Biomedical Technology",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Botany",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Chemistry",
                        "and any other Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Building",
                "jamb": [
                        "Use of English",
                        "Physics",
                        "Mathematics",
                        "and any of Chemistry",
                        "Geography",
                        "Economics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Building Technology",
                "jamb": [
                        "Use of English",
                        "Physics",
                        "Mathematics",
                        "and any of Chemistry",
                        "Geography",
                        "Economics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Business Administration",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "plus one of Government and Geography"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Business Education",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "and one other subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Business Management",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "plus one of Government and Geography"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Chemical Engineering",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Chemistry",
                "jamb": [
                        "Use of English",
                        "Chemistry and two of Physics",
                        "Biology",
                        "and Mathematics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Christian Religious Studies (CRS)",
                "jamb": [
                        "Use of English",
                        "Two Arts subjects including CRK and any other subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Civil Engineering",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Computer Engineering",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Cooperative and Rural Development",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "and one other subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Creative Arts",
                "jamb": [
                        "Use of English",
                        "Fine Art and two other Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Criminology and Security Studies",
                "jamb": [
                        "Use of English",
                        "Economics",
                        "Government",
                        "and any other Social Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Crop Production and Science",
                "jamb": [
                        "Use of English",
                        "Chemistry",
                        "Biology/Agriculture",
                        "and Mathematics or Physics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Dentistry and Dental Technology",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Education & Biology",
                "jamb": [
                        "Use of English",
                        "Biology and two other subjects from Chemistry",
                        "Physics",
                        "Mathematics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Education & Chemistry",
                "jamb": [
                        "Use of English",
                        "Chemistry and two other subjects from Physics",
                        "Biology",
                        "Mathematics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Education & Computer Science",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and one of Chemistry",
                        "Biology",
                        "Economics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Education & Economics",
                "jamb": [
                        "Use of English",
                        "Economics",
                        "Mathematics",
                        "and one of Government",
                        "History",
                        "Geography"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Education & English Language",
                "jamb": [
                        "Use of English",
                        "Literature in English and one Arts subject plus any other subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Education & Geography",
                "jamb": [
                        "Use of English",
                        "Geography and two other Social Science or Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Education & History",
                "jamb": [
                        "Use of English",
                        "History/Government and any two Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Education & Integrated Science",
                "jamb": [
                        "Use of English",
                        "Any three of Biology",
                        "Chemistry",
                        "Physics",
                        "Mathematics",
                        "Agric Science"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Education & Mathematics",
                "jamb": [
                        "Use of English",
                        "Mathematics and any two of Physics",
                        "Chemistry",
                        "Economics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Education & Physics",
                "jamb": [
                        "Use of English",
                        "Physics",
                        "Mathematics",
                        "and Chemistry or Biology"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Education & Political Science",
                "jamb": [
                        "Use of English",
                        "Government/History and two other Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Education & Social Studies",
                "jamb": [
                        "Use of English",
                        "Any three of Government",
                        "Economics",
                        "Geography",
                        "History",
                        "CRS",
                        "IRS"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Educational Management",
                "jamb": [
                        "Use of English",
                        "Economics",
                        "Mathematics",
                        "and one of Government",
                        "History",
                        "Geography"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Electrical/Electronics Engineering",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "English and Literary Studies",
                "jamb": [
                        "Use of English",
                        "Literature in English",
                        "one other Arts subject",
                        "and another Arts or Social Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "English Language",
                "jamb": [
                        "Use of English",
                        "Literature in English and any two Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Entrepreneurship",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "and one other Social Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Environmental Biology",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Chemistry",
                        "and any other Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Environmental Management",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Chemistry",
                        "and Geography or Physics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Estate Management",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "and one of Geography",
                        "Physics",
                        "Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Film Arts",
                "jamb": [
                        "Use of English",
                        "Literature in English and any two Arts subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Finance",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "plus one of Government and Geography"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Fine and Applied Arts",
                "jamb": [
                        "Use of English",
                        "Fine Art and two other Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Fisheries",
                "jamb": [
                        "Use of English",
                        "Chemistry",
                        "Biology/Agricultural Science",
                        "and any other Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Fisheries and Aquaculture",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Chemistry",
                        "and Agricultural Science or Physics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Food Science and Technology",
                "jamb": [
                        "Use of English",
                        "Chemistry",
                        "Mathematics or Physics",
                        "and Agricultural Science"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Forestry",
                "jamb": [
                        "Use of English",
                        "Chemistry",
                        "Biology or Agriculture",
                        "and Physics or Mathematics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Forestry and Wildlife Management",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Chemistry",
                        "and Agricultural Science or Mathematics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "French",
                "jamb": [
                        "Use of English",
                        "French and any other two subjects from Arts and Social Sciences"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Geography",
                "jamb": [
                        "Use of English",
                        "Geography and any two of Mathematics",
                        "Biology",
                        "Chemistry",
                        "Physics",
                        "Agricultural Science"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Geology",
                "jamb": [
                        "Use of English",
                        "Any three of Chemistry",
                        "Physics",
                        "Mathematics",
                        "Biology",
                        "Geography"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Geophysics",
                "jamb": [
                        "Use of English",
                        "Physics",
                        "Mathematics",
                        "and Chemistry or Geography"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Guidance and Counselling",
                "jamb": [
                        "Use of English",
                        "Any three Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Hausa",
                "jamb": [
                        "Use of English",
                        "Hausa",
                        "and any two subjects from Arts and Social Sciences"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Health Education",
                "jamb": [
                        "Use of English",
                        "Biology and any two relevant subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "History and International Studies",
                "jamb": [
                        "Use of English",
                        "History/Government and any two Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Home Economics",
                "jamb": [
                        "Use of English",
                        "Chemistry",
                        "Biology",
                        "and Economics or Agricultural Science"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Home Science",
                "jamb": [
                        "Use of English",
                        "Chemistry",
                        "Biology or Agriculture",
                        "and Mathematics or Physics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Hospitality and Tourism Management",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "and Geography or Biology"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Human Kinetics / Physical & Health Education",
                "jamb": [
                        "Use of English",
                        "Biology and any two relevant subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Human Nutrition and Dietetics",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Human Resources Management",
                "jamb": [
                        "Use of English",
                        "Economics",
                        "Government",
                        "and any other relevant subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Igbo",
                "jamb": [
                        "Use of English",
                        "Igbo",
                        "and any two subjects from Arts and Social Sciences"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Industrial Chemistry",
                "jamb": [
                        "Use of English",
                        "Chemistry",
                        "Mathematics",
                        "and any of Physics",
                        "Biology",
                        "Agric Science"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Industrial Mathematics",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and one of Chemistry",
                        "Economics",
                        "Geography"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Industrial Physics",
                "jamb": [
                        "Use of English",
                        "Physics",
                        "Mathematics",
                        "and Chemistry or Biology"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Industrial Relations",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "plus one other relevant subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Information and Communication Technology",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and one of Chemistry",
                        "Biology",
                        "Economics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Insurance",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "and one other subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "International Relations",
                "jamb": [
                        "Use of English",
                        "Literature in English",
                        "Economics",
                        "and Geography/Government/History"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Islamic Studies",
                "jamb": [
                        "Use of English",
                        "Islamic Religious Studies plus two other Arts subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Journalism",
                "jamb": [
                        "Use of English",
                        "Literature in English",
                        "Economics",
                        "and Government"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Languages and Linguistics",
                "jamb": [
                        "Use of English",
                        "One Arts subject and two other subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Library and Information Science",
                "jamb": [
                        "Use of English",
                        "Any three Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Linguistics",
                "jamb": [
                        "Use of English",
                        "Any three Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Literature in English",
                "jamb": [
                        "Use of English",
                        "Literature in English",
                        "one other Arts subject",
                        "and another Arts or Social Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Marine Biology",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Chemistry",
                        "and any other Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Marketing",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "and one other relevant subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Mathematics",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "and any two of Physics",
                        "Chemistry",
                        "Economics",
                        "Biology",
                        "Agricultural Science"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Mechatronics Engineering",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Medical Biochemistry",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Medical Laboratory Science",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Medical Rehabilitation",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Metallurgical and Materials Engineering",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Microbiology",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Chemistry",
                        "and Physics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Music",
                "jamb": [
                        "Use of English",
                        "Music",
                        "and any two Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Nutrition and Dietetics",
                "jamb": [
                        "Use of English",
                        "Chemistry",
                        "Biology/Agriculture",
                        "and Mathematics/Physics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Optometry",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Peace Studies and Conflict Resolution",
                "jamb": [
                        "Use of English",
                        "Government",
                        "Economics",
                        "and any other Social Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Petroleum Engineering",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Philosophy",
                "jamb": [
                        "Use of English",
                        "Any three Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Physical Education",
                "jamb": [
                        "Use of English",
                        "Biology and any two relevant subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Physics",
                "jamb": [
                        "Use of English",
                        "Physics",
                        "Mathematics",
                        "and Chemistry or Biology"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Physiology",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Physiotherapy",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Plant Science",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Chemistry",
                        "and any other Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Political Science",
                "jamb": [
                        "Use of English",
                        "Government or History",
                        "and any two of Economics",
                        "Geography",
                        "Literature"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Prosthesis and Orthopedic Technology",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Psychology",
                "jamb": [
                        "Use of English",
                        "Any three Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Public Administration",
                "jamb": [
                        "Use of English",
                        "Government",
                        "Economics",
                        "and any other Social Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Public Health",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Chemistry",
                        "and Physics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Pure and Applied Mathematics",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and Chemistry or Economics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Quantity Surveying",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and Economics or Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Radiography",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Religious Studies",
                "jamb": [
                        "Use of English",
                        "Two Arts subjects including Religious Knowledge and any other subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Science Laboratory Technology",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Chemistry",
                        "and Physics or Mathematics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Social Work",
                "jamb": [
                        "Use of English",
                        "Any three Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Sociology",
                "jamb": [
                        "Use of English",
                        "Any three Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Soil Science",
                "jamb": [
                        "Use of English",
                        "Chemistry",
                        "Biology or Agricultural Science",
                        "and any of Mathematics or Physics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Special Education",
                "jamb": [
                        "Use of English",
                        "Any three Arts or Social Science subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Sports Science",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Physics",
                        "and any other Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Statistics",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "and any two of Physics",
                        "Chemistry",
                        "Economics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Surveying and Geoinformatics",
                "jamb": [
                        "Use of English",
                        "Physics",
                        "Mathematics",
                        "and any of Chemistry",
                        "Geography",
                        "Art",
                        "Biology",
                        "Economics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Taxation",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "plus any Social Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Teacher Education Science",
                "jamb": [
                        "Use of English",
                        "Any three of Biology",
                        "Chemistry",
                        "Physics",
                        "Mathematics",
                        "Agric Science"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Theatre Arts",
                "jamb": [
                        "Use of English",
                        "Literature in English and any two Arts subjects"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Tourism",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Economics",
                        "and any other subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Urban and Regional Planning",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Geography",
                        "and Economics"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Veterinary Medicine",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Vocational and Technical Education",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and one other subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Water Resources and Environmental Engineering",
                "jamb": [
                        "Use of English",
                        "Mathematics",
                        "Physics",
                        "and Chemistry"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Yoruba",
                "jamb": [
                        "Use of English",
                        "Yoruba",
                        "and any two subjects from Arts and Social Sciences"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        },
        {
                "name": "Zoology",
                "jamb": [
                        "Use of English",
                        "Biology",
                        "Chemistry",
                        "and any other Science subject"
                ],
                "olevel": [
                        "English Language",
                        "Mathematics",
                        "Plus three relevant subjects according to your JAMB combination"
                ],
                "remarks": "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        }

    ];

    const searchInput = document.getElementById('course-search');
    const dropdown = document.getElementById('search-dropdown');
    const resultPanel = document.getElementById('result-panel');
    
    // Result DOM elements
    const resultCourseName = document.getElementById('result-course-name');
    const resultJambList = document.getElementById('result-jamb-list');
    const resultOlevelList = document.getElementById('result-olevel-list');
    const resultRemarks = document.getElementById('result-remarks');

    function renderCourseResult(course) {
        // Hide dropdown
        dropdown.classList.add('hidden');
        searchInput.value = course.name;

        // Set Title
        resultCourseName.innerText = course.name;

        // Set JAMB
        resultJambList.innerHTML = '';
        course.jamb.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check-circle"></i> ${item}`;
            resultJambList.appendChild(li);
        });

        // Set OLevel
        resultOlevelList.innerHTML = '';
        course.olevel.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check-circle"></i> ${item}`;
            resultOlevelList.appendChild(li);
        });

        // Set Remarks
        resultRemarks.innerText = course.remarks;

        // Show panel
        resultPanel.classList.remove('hidden');
    }

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase().trim();
        dropdown.innerHTML = '';
        
        if (val === '') {
            dropdown.classList.add('hidden');
            resultPanel.classList.add('hidden');
            return;
        }

        const filtered = coursesDB.filter(c => c.name.toLowerCase().includes(val));
        
        if (filtered.length > 0) {
            filtered.forEach(course => {
                const div = document.createElement('div');
                div.className = 'dropdown-item';
                div.innerText = course.name;
                div.addEventListener('click', () => {
                    renderCourseResult(course);
                });
                dropdown.appendChild(div);
            });
            dropdown.classList.remove('hidden');
        } else {
            const div = document.createElement('div');
            div.className = 'dropdown-item';
            div.innerText = "Course not found. Try 'Medicine', 'Law', or 'Accounting'.";
            div.style.color = '#ef4444';
            div.style.pointerEvents = 'none';
            dropdown.appendChild(div);
            dropdown.classList.remove('hidden');
        }
    });

    // Close dropdown clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        resultPanel.classList.add('hidden');
        searchInput.value = '';
        searchInput.focus();
    });

    const downloadBtn = document.getElementById('download-pdf-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const element = document.getElementById('pdf-container');
            
            // Fix for html2pdf blank page issue
            const opt = {
                margin:       0.3,
                filename:     `OAE_Subject_Combo_${resultCourseName.innerText.replace(/\s+/g, '_')}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            
            html2pdf().set(opt).from(element).save().then(() => {
                downloadBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Download as PDF';
            });
        });
    }
});
