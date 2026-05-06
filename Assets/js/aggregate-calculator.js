document.addEventListener('DOMContentLoaded', () => {
    const uniSelect = document.getElementById('university-select');
    const jambInput = document.getElementById('jamb-score');
    const postutmeInput = document.getElementById('postutme-score');
    const olevelGroup = document.getElementById('olevel-group');
    const calcBtn = document.getElementById('calculate-btn');
    const errorDiv = document.getElementById('calc-error');
    const postutmeLabel = document.getElementById('postutme-label');
    const formulaDisplay = document.getElementById('formula-display');
    const olevelSelects = document.querySelectorAll('.olevel-grade');
    const postutmeGroup = document.getElementById('postutme-group');
    const sittingsGroup = document.getElementById('sittings-group');
    const sittingsSelect = document.getElementById('sittings-select');
    const olevel5 = document.getElementById('olevel-5');
    const scoreUnit = document.getElementById('score-unit');
    
    const circle = document.getElementById('score-ring-circle');
    const scoreVal = document.getElementById('final-score-value');
    const feedbackCard = document.getElementById('feedback-card');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackMessage = document.getElementById('feedback-message');

    // Circle Circumference = 2 * PI * r = 2 * 3.14159 * 78 = ~490
    const circumference = 490;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    // Handle UI changes when university changes
    uniSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        
        postutmeGroup.style.display = 'block';
        sittingsGroup.style.display = 'none';
        olevel5.style.display = '';
        scoreUnit.innerText = '%';

        if (val === 'general') {
            olevelGroup.style.display = 'none';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 8) + (Post-UTME ÷ 2)';
        } else if (val === 'unilag') {
            olevelGroup.style.display = 'block';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 30)';
            postutmeInput.max = 30;
            formulaDisplay.innerText = '(JAMB ÷ 8) + OLevel Points(20) + Post-UTME(30)';
        } else if (val === 'oau') {
            olevelGroup.style.display = 'block';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 40)';
            postutmeInput.max = 40;
            formulaDisplay.innerText = '(JAMB ÷ 8) + OLevel Points(10) + Post-UTME(40)';
        } else if (val === 'ui') {
            olevelGroup.style.display = 'none';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 8) + (Post-UTME ÷ 2)';
        } else if (val === 'unizik') {
            olevelGroup.style.display = 'block';
            postutmeGroup.style.display = 'none';
            sittingsGroup.style.display = 'block';
            olevel5.style.display = 'none';
            scoreUnit.innerText = '';
            formulaDisplay.innerText = 'JAMB(70%) + OLevel(30%)';
        } else if (val === 'uniosun') {
            olevelGroup.style.display = 'block';
            postutmeGroup.style.display = 'none';
            formulaDisplay.innerText = '(JAMB × 60 ÷ 400) + OLevel(40)';
        } else if (val === 'lasu') {
            olevelGroup.style.display = 'block';
            postutmeGroup.style.display = 'none';
            formulaDisplay.innerText = '(JAMB × 0.15) + OLevel(40)';
        } else if (val === 'fuhsi') {
            olevelGroup.style.display = 'block';
            postutmeGroup.style.display = 'none';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '/100';
            formulaDisplay.innerText = '(JAMB ÷ 400 × 80) + (OLevel ÷ 30 × 20)';
        } else if (val === 'uniport') {
            olevelGroup.style.display = 'block';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 50) + (Post-UTME ÷ 100 × 30) + OLevel(20)';
        } else if (val === 'abu') {
            olevelGroup.style.display = 'block';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 40) + (Post-UTME ÷ 100 × 40) + OLevel(20)';
        } else if (val === 'unilorin') {
            olevelGroup.style.display = 'none';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 60) + (Post-UTME ÷ 100 × 40)';
        } else if (val === 'unn') {
            olevelGroup.style.display = 'none';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 50) + (Post-UTME ÷ 100 × 50)';
        } else if (val === 'fuoye') {
            olevelGroup.style.display = 'block';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 50) + (Post-UTME ÷ 100 × 40) + OLevel(10)';
        } else if (val === 'uniben') {
            olevelGroup.style.display = 'none';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 50) + (Post-UTME ÷ 100 × 50)';
        } else if (val === 'futa') {
            olevelGroup.style.display = 'none';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 50) + (Post-UTME ÷ 100 × 50)';
        } else if (val === 'unical') {
            olevelGroup.style.display = 'none';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 50) + (Post-UTME ÷ 100 × 50)';
        } else if (val === 'oou') {
            olevelGroup.style.display = 'none';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 50) + (Post-UTME ÷ 100 × 50)';
        } else if (val === 'kwasu') {
            olevelGroup.style.display = 'none';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 50) + (Post-UTME ÷ 100 × 50)';
        } else if (val === 'delsu') {
            olevelGroup.style.display = 'none';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 50) + (Post-UTME ÷ 100 × 50)';
        } else if (val === 'rsu') {
            olevelGroup.style.display = 'block';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 50) + (Post-UTME ÷ 100 × 40) + OLevel(10)';
        } else if (val === 'fedpolyilaro') {
            olevelGroup.style.display = 'block';
            postutmeGroup.style.display = 'none';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            formulaDisplay.innerText = '(JAMB ÷ 400 × 60) + OLevel(40)';
        } else if (val === 'yabatech') {
            olevelGroup.style.display = 'block';
            postutmeGroup.style.display = 'none';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            formulaDisplay.innerText = '(JAMB ÷ 400 × 60) + OLevel(40)';
        } else if (val === 'ebsu') {
            olevelGroup.style.display = 'none';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 50) + (Post-UTME ÷ 100 × 50)';
        } else if (val === 'lasued') {
            olevelGroup.style.display = 'none';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 50) + (Post-UTME ÷ 100 × 50)';
        } else if (val === 'afit') {
            olevelGroup.style.display = 'none';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 50) + (Post-UTME ÷ 100 × 50)';
        } else if (val === 'futminna') {
            olevelGroup.style.display = 'none';
            postutmeGroup.style.display = 'block';
            sittingsGroup.style.display = 'none';
            olevel5.style.display = '';
            scoreUnit.innerText = '%';
            postutmeLabel.innerText = 'Post-UTME Score (Out of 100)';
            postutmeInput.max = 100;
            formulaDisplay.innerText = '(JAMB ÷ 400 × 50) + (Post-UTME ÷ 100 × 50)';
        }
    });

    const getOlevelPointsUnilag = (grade) => {
        const map = { 'A1': 4.0, 'B2': 3.6, 'B3': 3.2, 'C4': 2.8, 'C5': 2.4, 'C6': 2.0 };
        return map[grade] || 0;
    };

    const getOlevelPointsOau = (grade) => {
        const map = { 'A1': 2.0, 'B2': 1.8, 'B3': 1.6, 'C4': 1.4, 'C5': 1.2, 'C6': 1.0 };
        return map[grade] || 0;
    };

    const getOlevelPointsUnizik = (grade) => {
        const map = { 'A1': 90, 'B2': 80, 'B3': 70, 'C4': 60, 'C5': 55, 'C6': 50 };
        return map[grade] || 0;
    };

    const getOlevelPointsUniosun = (grade) => {
        const map = { 'A1': 8, 'B2': 7, 'B3': 6, 'C4': 5, 'C5': 4, 'C6': 3 };
        return map[grade] || 0;
    };

    const getOlevelPointsLasu = (grade) => {
        const map = { 'A1': 8, 'B2': 7, 'B3': 6, 'C4': 5, 'C5': 4, 'C6': 3 };
        return map[grade] || 0;
    };

    const getOlevelPointsFuhsi = (grade) => {
        const map = { 'A1': 6, 'B2': 5, 'B3': 4, 'C4': 3, 'C5': 2, 'C6': 1 };
        return map[grade] || 0;
    };

    const getOlevelPointsUniport = (grade) => {
        const map = { 'A1': 4.0, 'B2': 3.5, 'B3': 3.0, 'C4': 2.5, 'C5': 2.0, 'C6': 1.5 };
        return map[grade] || 0;
    };

    const getOlevelPointsAbu = (grade) => {
        const map = { 'A1': 4.0, 'B2': 3.0, 'B3': 2.0, 'C4': 1.0, 'C5': 0.5, 'C6': 0 };
        return map[grade] || 0;
    };

    const getOlevelPointsFuoye = (grade) => {
        const map = { 'A1': 2.0, 'B2': 1.8, 'B3': 1.6, 'C4': 1.4, 'C5': 1.2, 'C6': 1.0 };
        return map[grade] || 0;
    };

    const getOlevelPointsRsu = (grade) => {
        const map = { 'A1': 2.0, 'B2': 1.8, 'B3': 1.6, 'C4': 1.4, 'C5': 1.2, 'C6': 1.0 };
        return map[grade] || 0;
    };

    const getOlevelPointsFedpoly = (grade) => {
        const map = { 'A1': 8, 'B2': 7, 'B3': 6, 'C4': 5, 'C5': 4, 'C6': 3 };
        return map[grade] || 0;
    };

    const showError = (msg) => {
        errorDiv.innerText = msg;
        errorDiv.style.display = 'block';
    };

    const hideError = () => {
        errorDiv.style.display = 'none';
    };

    const updateRing = (percent, displayScore = null) => {
        let pct = percent > 100 ? 100 : percent;
        const offset = circumference - (pct / 100) * circumference;
        circle.style.strokeDashoffset = offset;
        
        let color = '#f44336'; // Red
        let bgStyle = '#ffebee';
        let titleColor = '#d32f2f';
        let fbTitle = 'Low Chance - Warning';
        let fbMsg = 'Your score is below average. You may need to consider a change of course to less competitive departments or polytechnics to guarantee admission this year.';

        if (percent >= 70) {
            color = '#4CAF50'; // Green
            bgStyle = '#e8f5e9';
            titleColor = '#2e7d32';
            fbTitle = 'Excellent - Very Safe';
            fbMsg = 'Outstanding score! You have a highly competitive aggregate and are safe for top courses like Medicine, Law, or Nursing.';
        } else if (percent >= 60) {
            color = '#ff9800'; // Orange/Yellow
            bgStyle = '#fff3e0';
            titleColor = '#ef6c00';
            fbTitle = 'Good - Safe for Moderates';
            fbMsg = 'You have a solid chance. You are safe for moderately competitive courses (Sciences, Arts, Education). Avoid extremely competitive courses unles you have catchment advantage.';
        }

        circle.style.stroke = color;
        scoreVal.innerText = displayScore !== null ? displayScore.toFixed(1) : pct.toFixed(1);
        scoreVal.style.color = color;
        
        feedbackCard.style.background = bgStyle;
        feedbackTitle.innerText = fbTitle;
        feedbackTitle.style.color = titleColor;
        feedbackMessage.innerText = fbMsg;
    };

    calcBtn.addEventListener('click', () => {
        hideError();
        const mode = uniSelect.value;
        const jambRaw = jambInput.value.trim();
        const putmeRaw = postutmeInput.value.trim();

        if (jambRaw === "") {
            return showError("Please enter your JAMB score.");
        }
        const jamb = parseFloat(jambRaw);
        if (isNaN(jamb) || jamb < 0 || jamb > 400) {
            return showError("Please enter a valid JAMB score between 0 and 400.");
        }
        
        let maxPutme = 100;
        if (mode === 'unilag') maxPutme = 30;
        if (mode === 'oau') maxPutme = 40;

        let putme = 0;
        if (mode !== 'unizik' && mode !== 'uniosun' && mode !== 'lasu' && mode !== 'fuhsi' && mode !== 'fedpolyilaro' && mode !== 'yabatech') {
            if (putmeRaw === "") {
                return showError("Please enter your Post-UTME score.");
            }
            putme = parseFloat(putmeRaw);
            if (isNaN(putme) || putme < 0 || putme > maxPutme) {
                return showError(`Please enter a valid Post-UTME score between 0 and ${maxPutme} for this school.`);
            }
        }

        let aggregate = 0;
        let percentForRing = 0;

        if (mode === 'general' || mode === 'ui') {
            aggregate = (jamb / 8) + (putme / 2);
            percentForRing = aggregate;
        } else if (mode === 'unilorin') {
            aggregate = (jamb / 400 * 60) + (putme / 100 * 40);
            percentForRing = aggregate;
        } else if (mode === 'unn' || mode === 'uniben' || mode === 'futa' || mode === 'unical' || mode === 'oou' || mode === 'kwasu' || mode === 'delsu' || mode === 'ebsu' || mode === 'lasued' || mode === 'afit' || mode === 'futminna') {
            aggregate = (jamb / 400 * 50) + (putme / 100 * 50);
            percentForRing = aggregate;
        } else if (mode === 'fuhsi') {
            // FUHSI: 80% JAMB + 20% O'Level (max 30 points)
            let olevelTotal = 0;
            let missingGrade = false;
            
            Array.from(olevelSelects).forEach(sel => {
                if (sel.value === "") {
                    missingGrade = true;
                } else {
                    olevelTotal += getOlevelPointsFuhsi(sel.value);
                }
            });

            if (missingGrade) {
                return showError(`Please select grades for all 5 O'Level subjects.`);
            }

            const jambComponent = (jamb / 400) * 80;
            const olevelComponent = (olevelTotal / 30) * 20;
            aggregate = jambComponent + olevelComponent;
            percentForRing = aggregate;
        } else if (mode === 'unilag' || mode === 'oau' || mode === 'unizik' || mode === 'uniosun' || mode === 'lasu' || mode === 'uniport' || mode === 'abu' || mode === 'fuoye' || mode === 'rsu' || mode === 'fedpolyilaro' || mode === 'yabatech') {
            let olevelTotal = 0;
            let missingGrade = false;
            
            const selectsToCheck = mode === 'unizik' ? Array.from(olevelSelects).slice(0, 4) : Array.from(olevelSelects);

            selectsToCheck.forEach(sel => {
                if (sel.value === "") {
                    missingGrade = true;
                } else {
                    if (mode === 'unilag') olevelTotal += getOlevelPointsUnilag(sel.value);
                    else if (mode === 'oau') olevelTotal += getOlevelPointsOau(sel.value);
                    else if (mode === 'unizik') olevelTotal += getOlevelPointsUnizik(sel.value);
                    else if (mode === 'uniosun') olevelTotal += getOlevelPointsUniosun(sel.value);
                    else if (mode === 'lasu') olevelTotal += getOlevelPointsLasu(sel.value);
                    else if (mode === 'uniport') olevelTotal += getOlevelPointsUniport(sel.value);
                    else if (mode === 'abu') olevelTotal += getOlevelPointsAbu(sel.value);
                    else if (mode === 'fuoye') olevelTotal += getOlevelPointsFuoye(sel.value);
                    else if (mode === 'rsu') olevelTotal += getOlevelPointsRsu(sel.value);
                    else if (mode === 'fedpolyilaro') olevelTotal += getOlevelPointsFedpoly(sel.value);
                    else if (mode === 'yabatech') olevelTotal += getOlevelPointsFedpoly(sel.value);
                }
            });

            if (missingGrade) {
                const req = mode === 'unizik' ? '4' : '5';
                return showError(`Please select grades for all ${req} required O'Level subjects.`);
            }
            
            if (mode === 'unizik') {
                const bonus = sittingsSelect.value === '1' ? 10 : 0;
                aggregate = (jamb * 0.7) + ((olevelTotal + bonus) * 0.3);
                percentForRing = (aggregate / 400) * 100;
            } else if (mode === 'uniosun') {
                aggregate = (jamb * 60 / 400) + olevelTotal;
                percentForRing = aggregate;
            } else if (mode === 'lasu') {
                aggregate = (jamb * 0.15) + olevelTotal;
                percentForRing = aggregate;
            } else if (mode === 'uniport') {
                aggregate = (jamb / 400 * 50) + (putme / 100 * 30) + olevelTotal;
                percentForRing = aggregate;
            } else if (mode === 'abu') {
                aggregate = (jamb / 400 * 40) + (putme / 100 * 40) + olevelTotal;
                percentForRing = aggregate;
            } else if (mode === 'fuoye') {
                aggregate = (jamb / 400 * 50) + (putme / 100 * 40) + olevelTotal;
                percentForRing = aggregate;
            } else if (mode === 'rsu') {
                aggregate = (jamb / 400 * 50) + (putme / 100 * 40) + olevelTotal;
                percentForRing = aggregate;
            } else if (mode === 'fedpolyilaro' || mode === 'yabatech') {
                aggregate = (jamb / 400 * 60) + olevelTotal;
                percentForRing = aggregate;
            } else {
                aggregate = (jamb / 8) + olevelTotal + putme;
                percentForRing = aggregate;
            }
        }

        // Cap at 100 just in case
        if (mode !== 'unizik' && aggregate > 100) aggregate = 100;
        if (percentForRing > 100) percentForRing = 100;
        
        updateRing(percentForRing, mode === 'unizik' ? aggregate : null);
        
        const schoolNames = {
            'general': 'Your Aggregate for general schools calculation is:',
            'unilag': 'Your Aggregate for UNILAG is:',
            'oau': 'Your Aggregate for OAU is:',
            'ui': 'Your Aggregate for UI is:',
            'unizik': 'Your Aggregate for UNIZIK is:',
            'uniosun': 'Your Aggregate for UNIOSUN is:',
            'lasu': 'Your Aggregate for LASU is:',
            'fuhsi': 'Your Screening Score for FUHSI is:',
            'uniport': 'Your Aggregate for UNIPORT is:',
            'abu': 'Your Aggregate for ABU is:',
            'unilorin': 'Your Aggregate for UNILORIN is:',
            'unn': 'Your Aggregate for UNN is:',
            'fuoye': 'Your Aggregate for FUOYE is:',
            'uniben': 'Your Aggregate for UNIBEN is:',
            'futa': 'Your Aggregate for FUTA is:',
            'unical': 'Your Aggregate for UNICAL is:',
            'oou': 'Your Aggregate for OOU is:',
            'kwasu': 'Your Aggregate for KWASU is:',
            'delsu': 'Your Aggregate for DELSU is:',
            'rsu': 'Your Aggregate for RSU is:',
            'fedpolyilaro': 'Your Aggregate for FED POLY ILARO is:',
            'yabatech': 'Your Aggregate for YABATECH is:',
            'ebsu': 'Your Aggregate for EBSU is:',
            'lasued': 'Your Aggregate for LASUED is:',
            'afit': 'Your Aggregate for AFIT is:',
            'futminna': 'Your Aggregate for FUTMINNA is:'
        };
        document.getElementById('result-school-title').innerText = schoolNames[mode];

        // Save to localStorage for Dashboard
        const schoolDisplayName = schoolNames[mode] ? schoolNames[mode].replace('Your Aggregate for ', '').replace(' is:', '') : mode.toUpperCase();
        const finalScoreToSave = mode === 'unizik' ? aggregate.toFixed(1) : percentForRing.toFixed(1);
        localStorage.setItem('oae_saved_aggregate', JSON.stringify({ score: finalScoreToSave, school: schoolDisplayName }));

        // Setup WhatsApp Channel Link
        const schoolChannels = {
            'lasu': 'https://whatsapp.com/channel/0029VbAryZU60eBZibqNYu0N',
            'ui': 'https://whatsapp.com/channel/0029VbApRRo30LKJcV3UNj2M',
            'oau': 'https://whatsapp.com/channel/0029VbAfy2mIN9iuQOBiZ41T',
            'unilag': 'https://whatsapp.com/channel/0029VbA5AY4I1rcbqvQE0J31',
            'oou': 'https://whatsapp.com/channel/0029VbB4tDhCXC3BIaNKy635',
            'unilorin': 'https://whatsapp.com/channel/0029Vb5ZFhcB4hdZCwDj0U2N',
            'uniport': 'https://whatsapp.com/channel/0029Vb5obYTK0IBf0q5al437',
            'uniben': 'https://whatsapp.com/channel/0029VbATZs28F2pDTQWAqY1x',
            'delsu': 'https://whatsapp.com/channel/0029VbAr06N4NVih70Bzm30P',
            'fuoye': 'https://whatsapp.com/channel/0029VbAXFbVHgZWhJlxbzz3l',
            'uniosun': 'https://whatsapp.com/channel/0029Vb5C7EE8vd1WGYRQfG1b',
            'futa': 'https://whatsapp.com/channel/0029Vb5k1dr3wtbAOzzfNq45',
            'fuhsi': 'https://whatsapp.com/channel/0029Vb6M5RMC1FuGCQfnPf1p',
            'dou': 'https://whatsapp.com/channel/0029VbBg7qS3AzNTTwG6L80d',
            'abu': 'https://whatsapp.com/channel/0029Vb6RzZXJuyAKUH0YUC3k',
            'unn': 'https://whatsapp.com/channel/0029VbAkzM9A2pL8tUzNV72m',
            'unizik': 'https://whatsapp.com/channel/0029VbAOV3SCnA7o1ccft639',
            'kwasu': 'https://whatsapp.com/channel/0029Vb5WeS9BPzjafElsFW0e',
            'unical': 'https://whatsapp.com/channel/0029VbBBTkgDzgT2xRHcpb2A',
            'yabatech': 'https://whatsapp.com/channel/0029Vb6n1qqL2AU0rRd5pI2D',
            'dufuhs': 'https://whatsapp.com/channel/0029VbAzsc8GehEQFhVLIJ3x',
            'ebsu': 'https://whatsapp.com/channel/0029Vb61i6hK0IBhNmrByH1t',
            'lasued': 'https://whatsapp.com/channel/0029Vb65Mdt1dAwB7K3AB31W',
            'afit': 'https://whatsapp.com/channel/0029VbB35VN5q08UbtsW1F0l',
            'rsu': 'https://whatsapp.com/channel/0029VbBGQzVKbYMUqZAJPb1z',
            'adeleke': 'https://whatsapp.com/channel/0029VbB5LCt1Hsq3fBzuCE2l',
            'fuhsi': 'https://whatsapp.com/channel/0029Vb6M5RMC1FuGCQfnPf1p',
            'fedpolyilaro': 'https://whatsapp.com/channel/0029Vb7AzKYBPzjSBTiSPV2P',
            'general': 'https://whatsapp.com/channel/0029VakYvdGBPzja0pE8OC3G'
        };

        const channelUrl = schoolChannels[mode] || schoolChannels['general'];
        
        const channelLinkContainer = document.getElementById('channel-link-container');
        const channelLink = document.getElementById('channel-link');
        const channelLinkText = document.getElementById('channel-link-text');
        
        if (channelLinkContainer) {
            channelLink.href = channelUrl;
            channelLink.style.cssText = `
                color: #2e7d32;
                font-weight: bold;
                text-decoration: none;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                flex-wrap: wrap;
            `;
            
            channelLinkContainer.style.cssText = `
                display: block;
                margin-top: 20px;
                padding: 16px;
                background: linear-gradient(135deg, #f0f7f0 0%, #e8f5e9 100%);
                border-radius: 10px;
                text-align: center;
                border: 2px solid #c8e6c9;
                box-shadow: 0 2px 8px rgba(10, 138, 47, 0.1);
            `;
            
            channelLinkText.innerHTML = `<i class="fas fa-graduation-cap"></i> Join <strong>${schoolDisplayName}</strong> Channel<br/><small style="font-size: 0.85rem; font-weight: normal; opacity: 0.8;">Get real-time updates on admissions, results, and important announcements</small>`;
            channelLinkContainer.style.display = 'block';
        }
        
        document.getElementById('download-pdf-btn').style.display = 'block';
    });

    const downloadBtn = document.getElementById('download-pdf-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const element = document.getElementById('pdf-dashboard');
            downloadBtn.style.display = 'none'; 
            
            // Fix for html2pdf blank page issue (window scroll position)
            const opt = {
                margin:       0.3,
                filename:     'OAE_Official_Aggregate_Result.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            
            html2pdf().set(opt).from(element).save().then(() => {
                downloadBtn.style.display = 'block'; 
            });
        });
    }
});
