const fs = require('fs');

// Mock DOM/Browser environment
window = {};

// Load db and chance-predictor
const dbContent = fs.readFileSync('c:/Users/USER/Documents/OAE/Assets/js/cutoffs-db.js', 'utf8');
eval(dbContent);
window.oaeCutOffData = cutOffData;

const UNI_META = {
    unilag: {
        name: 'University of Lagos (UNILAG)',
        putmeMax: 30, putmeLabel: 'Post-UTME Score (Out of 30)',
        hasOlevel: true, olevelMap: 'unilag',
        formula: (j, p, o) => (j / 8) + p + o,
        reverseFormula: (targetAgg, j, o) => targetAgg - (j / 8) - o,
        channel: 'https://whatsapp.com/channel/0029VbA5AY4I1rcbqvQE0J31'
    }
};

function findAlternativeCourses(uniKey, targetCourseName, mode, params) {
    const db = window.oaeCutOffData[uniKey];
    if (!db) return [];
    
    const latestYear = Object.keys(db.years).sort((a, b) => b.localeCompare(a))[0];
    const faculties = db.years[latestYear];
    
    let targetFaculty = null;
    let allAlternatives = [];
    
    // Find the faculty of the target course
    Object.entries(faculties).forEach(([faculty, courses]) => {
        if (courses.some(c => c.course === targetCourseName)) {
            targetFaculty = faculty;
        }
    });

    if (!targetFaculty) return [];
    const relatedCourses = faculties[targetFaculty];

    const meta = UNI_META[uniKey];

    relatedCourses.forEach(c => {
        if (c.course === targetCourseName || !c.mark || c.mark === 'NIL') return;
        
        const meritCutoff = parseFloat(c.mark);
        
        if (mode === 'taken') {
            const { aggregate } = params;
            if (aggregate >= meritCutoff) {
                allAlternatives.push({ course: c.course, mark: meritCutoff, margin: aggregate - meritCutoff });
            }
        } else if (mode === 'not_taken') {
            const { jamb, olevelScore } = params;
            const requiredPutme = meta.reverseFormula(meritCutoff, jamb, olevelScore);
            
            // Testing 0.9 threshold
            if (requiredPutme > 0 && requiredPutme <= meta.putmeMax * 0.9) {
                allAlternatives.push({ course: c.course, mark: meritCutoff, requiredPutme: requiredPutme });
            }
        }
    });

    allAlternatives.sort((a, b) => b.mark - a.mark);
    return allAlternatives.slice(0, 3);
}

// Jamb 320, 5 A1s (Olevel = 20)
console.log("For 320 JAMB, 5 A1s:", findAlternativeCourses('unilag', 'Medicine & Surgery', 'not_taken', { jamb: 320, olevelScore: 20 }));

// Jamb 240, 5 C6s (Olevel = 10)
console.log("For 240 JAMB, 5 C6s:", findAlternativeCourses('unilag', 'Medicine & Surgery', 'not_taken', { jamb: 240, olevelScore: 10 }));

// Jamb 260, 5 B3s (Olevel = 5 * 3.2 = 16)
console.log("For 260 JAMB, 5 B3s:", findAlternativeCourses('unilag', 'Medicine & Surgery', 'not_taken', { jamb: 260, olevelScore: 16 }));
