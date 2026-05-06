/**
 * OAE Admission Updates Database
 * 
 * Instructions for Admins:
 * To add a new update, simply copy one of the {} blocks below, paste it at the TOP of the list, 
 * and change the details. The website will automatically update!
 * 
 * Properties:
 * - id: unique number
 * - title: Headline of the news
 * - date: YYYY-MM-DD
 * - category: "Post-UTME", "JAMB", "Cut-Off", "General"
 * - excerpt: Short summary
 * - content: Full details (you can use basic HTML tags like <br> or <strong>)
 * - school: Tag the school (e.g. "UNILAG", "General")
 * - link: External link to apply (optional, leave empty "" if none)
 */

const oaeNewsDatabase = [
    {
        id: 4,
        title: "UNILAG 2025/2026 Post-UTME Form Officially Out",
        date: "2025-07-15",
        category: "Post-UTME",
        school: "UNILAG",
        excerpt: "The University of Lagos (UNILAG) has commenced the sale of its Post-UTME screening forms for the 2025/2026 academic session.",
        content: "Management of the University of Lagos (UNILAG) has announced that the online registration for the 2025/2026 Post-UTME screening exercise will commence on Monday, August 4th, and close on Friday, August 29th, 2025.<br><br>Candidates who made UNILAG their first choice and scored 200 and above are eligible. The screening fee is N2,000.",
        link: "/admission/schools/unilag.html"
    },
    {
        id: 3,
        title: "JAMB Releases 2025 Institutional Cut-Off Marks",
        date: "2025-06-20",
        category: "Cut-Off",
        school: "General",
        excerpt: "JAMB has officially announced the minimum cut-off marks for Universities, Polytechnics, and Colleges of Education.",
        content: "Following the policy meeting held in Abuja, JAMB has pegged the minimum admission cut-off mark for Universities at 140, Polytechnics at 100, and Colleges of Education at 100.<br><br><strong>Note:</strong> Premium institutions like UNILAG, OAU, and UI strictly maintain a 200 cut-off.",
        link: ""
    },
    {
        id: 2,
        title: "Federal Polytechnic Nekede Announces ND Screening",
        date: "2025-08-01",
        category: "Post-UTME",
        school: "NEKEDEPOLY",
        excerpt: "Eligible candidates are invited for the 2025/2026 National Diploma (ND) screening exercise.",
        content: "Federal Polytechnic, Nekede has opened its portal for the 2025/2026 ND full-time admission screening. Candidates who scored 120 and above in JAMB and chose the polytechnic as their first choice are required to apply.",
        link: "/admission/schools/nekedepoly.html"
    },
    {
        id: 1,
        title: "How to Calculate Your Admission Aggregate Score",
        date: "2025-05-10",
        category: "General",
        school: "General",
        excerpt: "Stop guessing your chances. Learn exactly how schools calculate your O'Level and JAMB scores to form your final aggregate.",
        content: "Many students miss out on admission because they target highly competitive courses without understanding the aggregate system. Most universities use a 50:30:20 ratio (JAMB:Post-UTME:O'Level).<br><br>Use our official tool to calculate your exact aggregate score instantly.",
        link: "/admission/aggregate-calculator/index.html"
    }
];
