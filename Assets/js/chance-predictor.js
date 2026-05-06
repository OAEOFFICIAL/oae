/**
 * OAE Smart Admission Chance Predictor Engine
 * Rule-based prediction using real historical cut-off data from cutoffs-db.js
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── DOM REFERENCES ──────────────────────────────────────────
    const uniSelect       = document.getElementById('pred-uni-select');
    const courseSelect    = document.getElementById('pred-course-select');
    const stateSelect     = document.getElementById('pred-state-select');
    const jambInput       = document.getElementById('pred-jamb');
    const putmeInput      = document.getElementById('pred-putme');
    const putmeGroup      = document.getElementById('pred-putme-group');
    const putmeLabel      = document.getElementById('pred-putme-label');
    const olevelSection   = document.getElementById('pred-olevel-section');
    const olevelSelects   = document.querySelectorAll('.pred-olevel-grade');
    const predictBtn      = document.getElementById('predict-btn');
    const predictBtnText  = document.getElementById('predict-btn-text');
    const predError       = document.getElementById('pred-error');
    const resultArea      = document.getElementById('pred-result-area');
    const loadingEl       = document.getElementById('pred-loading');
    const putmeStatusRadios = document.querySelectorAll('input[name="putme_status"]');

    // ── UNIVERSITY META (formula + display info) ─────────────────
    const UNI_META = {
        unilag: {
            name: 'University of Lagos (UNILAG)',
            putmeMax: 30, putmeLabel: 'Post-UTME Score (Out of 30)',
            hasOlevel: true, olevelMap: 'unilag',
            formula: (j, p, o) => (j / 8) + p + o,
            reverseFormula: (targetAgg, j, o) => targetAgg - (j / 8) - o,
            channel: 'https://whatsapp.com/channel/0029VbA5AY4I1rcbqvQE0J31'
        },
        oau: {
            name: 'Obafemi Awolowo University (OAU)',
            putmeMax: 40, putmeLabel: 'Post-UTME Score (Out of 40)',
            hasOlevel: true, olevelMap: 'oau',
            formula: (j, p, o) => (j / 8) + p + o,
            reverseFormula: (targetAgg, j, o) => targetAgg - (j / 8) - o,
            channel: 'https://whatsapp.com/channel/0029VbAfy2mIN9iuQOBiZ41T'
        },
        ui: {
            name: 'University of Ibadan (UI)',
            putmeMax: 100, putmeLabel: 'Post-UTME Score (Out of 100)',
            hasOlevel: false, olevelMap: null,
            formula: (j, p) => (j / 8) + (p / 2),
            reverseFormula: (targetAgg, j, o) => (targetAgg - (j / 8)) * 2,
            channel: 'https://whatsapp.com/channel/0029VbApRRo30LKJcV3UNj2M'
        },
        fuoye: {
            name: 'Federal University Oye-Ekiti (FUOYE)',
            putmeMax: 100, putmeLabel: 'Post-UTME Score (Out of 100)',
            hasOlevel: true, olevelMap: 'fuoye',
            formula: (j, p, o) => (j / 400 * 50) + (p / 100 * 40) + o,
            reverseFormula: (targetAgg, j, o) => ((targetAgg - (j / 400 * 50) - o) * 100) / 40,
            channel: 'https://whatsapp.com/channel/0029VbAXFbVHgZWhJlxbzz3l'
        }
    };

    // ── O'LEVEL GRADE POINT MAPS ────────────────────────────────
    const OLEVEL_MAPS = {
        unilag: { A1: 4.0, B2: 3.6, B3: 3.2, C4: 2.8, C5: 2.4, C6: 2.0 },  // max 20 (5×4)
        oau:    { A1: 2.0, B2: 1.8, B3: 1.6, C4: 1.4, C5: 1.2, C6: 1.0 },  // max 10 (5×2)
        fuoye:  { A1: 2.0, B2: 1.8, B3: 1.6, C4: 1.4, C5: 1.2, C6: 1.0 },  // max 10
        uniosun:{ A1: 8,   B2: 7,   B3: 6,   C4: 5,   C5: 4,   C6: 3   },
        lasu:   { A1: 8,   B2: 7,   B3: 6,   C4: 5,   C5: 4,   C6: 3   },
        default:{ A1: 4.0, B2: 3.5, B3: 3.0, C4: 2.5, C5: 2.0, C6: 1.5 }
    };

    // ── NIGERIAN STATES ─────────────────────────────────────────
    const STATES = [
        'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue',
        'Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT',
        'Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi',
        'Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo',
        'Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'
    ];

    function init() {
        populateStates();
        populateUniversities();
        uniSelect.addEventListener('change', onUniChange);
        predictBtn.addEventListener('click', onPredict);
        putmeStatusRadios.forEach(radio => radio.addEventListener('change', onPutmeStatusChange));
    }

    function onPutmeStatusChange() {
        const isYes = document.querySelector('input[name="putme_status"]:checked').value === 'yes';
        if (isYes) {
            if (uniSelect.value) putmeGroup.style.display = 'block';
            predictBtnText.innerHTML = '<i class="fas fa-brain"></i> Predict My Admission Chances';
        } else {
            putmeGroup.style.display = 'none';
            predictBtnText.innerHTML = '<i class="fas fa-bullseye"></i> Calculate Required Score';
        }
    }

    function populateStates() {
        STATES.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s; opt.textContent = s;
            stateSelect.appendChild(opt);
        });
    }

    function populateUniversities() {
        // Only include schools we have BOTH cutoff data AND formula for
        const db = window.oaeCutOffData || {};
        Object.keys(UNI_META).forEach(key => {
            if (db[key]) {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = UNI_META[key].name;
                uniSelect.appendChild(opt);
            }
        });
    }

    function onUniChange() {
        const val = uniSelect.value;
        if (!val) {
            courseSelect.innerHTML = '<option value="">— Select University First —</option>';
            courseSelect.disabled = true;
            putmeGroup.style.display = 'none';
            olevelSection.classList.remove('visible');
            return;
        }

        const meta = UNI_META[val];
        const db   = window.oaeCutOffData[val];

        // Populate courses
        courseSelect.innerHTML = '<option value="">— Select Course —</option>';
        const latestYear = Object.keys(db.years).sort((a, b) => b.localeCompare(a))[0];
        const faculties  = db.years[latestYear];
        Object.entries(faculties).forEach(([faculty, courses]) => {
            const grp = document.createElement('optgroup');
            grp.label = faculty;
            courses.forEach(c => {
                if (c.mark && c.mark !== 'NIL') {
                    const opt = document.createElement('option');
                    opt.value = JSON.stringify({ mark: c.mark, catchment: c.catchment || {} });
                    opt.textContent = c.course;
                    grp.appendChild(opt);
                }
            });
            if (grp.children.length > 0) courseSelect.appendChild(grp);
        });
        courseSelect.disabled = false;

        // Toggle Post-UTME visibility based on status
        const isYes = document.querySelector('input[name="putme_status"]:checked').value === 'yes';
        if (isYes) putmeGroup.style.display = 'block';
        putmeLabel.textContent   = meta.putmeLabel;
        putmeInput.max           = meta.putmeMax;
        putmeInput.placeholder   = `e.g. ${Math.round(meta.putmeMax * 0.65)}`;

        // Toggle O'Level
        if (meta.hasOlevel) {
            olevelSection.classList.add('visible');
        } else {
            olevelSection.classList.remove('visible');
        }
    }

    // ── AGGREGATE CALCULATORS ───────────────────────────────────
    function calcOlevel(mapKey, grades) {
        const map = OLEVEL_MAPS[mapKey] || OLEVEL_MAPS.default;
        return grades.reduce((sum, g) => sum + (map[g] || 0), 0);
    }

    function computeAggregate(uniKey, jamb, putme, olevelGrades) {
        const meta = UNI_META[uniKey];
        let olevelScore = 0;
        if (meta.hasOlevel && meta.olevelMap) {
            olevelScore = calcOlevel(meta.olevelMap, olevelGrades);
        }
        return meta.formula(jamb, putme, olevelScore);
    }

    // ── PREDICTION LOGIC ─────────────────────────────────────────
    function predict(aggregate, meritCutoff, catchmentCutoff, state) {
        // Buffer zones for borderline
        const SAFE_BUFFER       = 2.5;   // pts above cutoff = definitely safe
        const BORDERLINE_BELOW  = 5.0;   // pts below cutoff but still borderline
        const UNLIKELY_BUFFER   = 10.0;  // too far below

        let verdict, chancePct, details;
        const diff = aggregate - meritCutoff;

        // Check catchment
        const hasCatchment = catchmentCutoff !== null && catchmentCutoff !== 'NIL';
        const catchVal     = hasCatchment ? parseFloat(catchmentCutoff) : null;
        const aboveCatch   = hasCatchment && aggregate >= catchVal;
        const catchDiff    = hasCatchment ? aggregate - catchVal : null;

        if (diff >= SAFE_BUFFER) {
            // Comfortably above merit cutoff
            chancePct = Math.min(98, 70 + Math.round(diff * 1.5));
            verdict   = 'safe';
            details   = `Your aggregate of <strong>${aggregate.toFixed(2)}</strong> is <strong>${diff.toFixed(2)} points above</strong> the merit cut-off of <strong>${meritCutoff}</strong>. You are in a very strong position for direct merit admission regardless of state of origin.`;
        } else if (diff >= 0) {
            // Just at or slightly above merit
            chancePct = Math.round(55 + (diff / SAFE_BUFFER) * 15);
            verdict   = 'safe';
            details   = `Your aggregate of <strong>${aggregate.toFixed(2)}</strong> meets the merit cut-off of <strong>${meritCutoff}</strong>. You qualify for merit admission but the margin is slim — maintain a strong profile and ensure your documents are complete.`;
        } else if (hasCatchment && aboveCatch) {
            // Below merit but above catchment — depends on state
            const catchMargin = catchDiff.toFixed(2);
            const meritCatchRange = Math.abs(meritCutoff - catchVal);
            chancePct = meritCatchRange > 0
                ? Math.min(80, Math.round(50 + (catchDiff / meritCatchRange) * 20))
                : 60;
            verdict   = 'catchment-safe';
            details   = `Your score is below the merit cut-off of <strong>${meritCutoff}</strong>, but you are <strong>${catchMargin} points above</strong> the catchment cut-off of <strong>${catchVal}</strong> for <strong>${state}</strong>. Your state of origin gives you a significant advantage — admission via the catchment quota is highly likely.`;
        } else if (Math.abs(diff) <= BORDERLINE_BELOW) {
            // Borderline — close to cutoff
            chancePct = Math.max(20, Math.round(45 - Math.abs(diff) * 3));
            verdict   = 'borderline';
            const catchNote = (hasCatchment && !aboveCatch) ? ` You are also below the catchment cut-off of <strong>${catchVal}</strong> for <strong>${state}</strong>.` : '';
            details   = `Your aggregate of <strong>${aggregate.toFixed(2)}</strong> is <strong>${Math.abs(diff).toFixed(2)} points below</strong> the merit cut-off of <strong>${meritCutoff}</strong>.${catchNote} You are in the borderline zone — consider a change of course to a less competitive department in this university or explore other institutions.`;
        } else {
            // Unlikely — far below
            chancePct = Math.max(5, Math.round(20 - (Math.abs(diff) - BORDERLINE_BELOW) * 1.5));
            verdict   = 'unlikely';
            const unlikelyCatchNote = (hasCatchment && !aboveCatch) ? ` Catchment cut-off is <strong>${catchVal}</strong> for <strong>${state}</strong>.` : '';
            details   = `Your aggregate of <strong>${aggregate.toFixed(2)}</strong> is <strong>${Math.abs(diff).toFixed(2)} points below</strong> the cut-off of <strong>${meritCutoff}</strong>.${unlikelyCatchNote} Admission into this course this session is very unlikely. We strongly recommend considering alternative courses or universities.`;
        }

        return { verdict, chancePct: Math.min(99, chancePct), details };
    }

    // ── TIPS GENERATOR ───────────────────────────────────────────
    function generateTips(verdict, uniKey, state, aggregate, meritCutoff) {
        const tips = [];
        const meta = UNI_META[uniKey];

        if (verdict === 'safe') {
            tips.push({ icon: 'fa-check-circle', text: 'Complete your Post-UTME screening registration on time and double-check all uploaded documents.' });
            tips.push({ icon: 'fa-file-alt', text: 'Prepare your O\'Level results, JAMB result slip, and birth certificate as originals for verification.' });
            tips.push({ icon: 'fa-bell', text: `Join the OAE ${meta.name.split('(')[0].trim()} Channel to get real-time admission updates.` });
        } else if (verdict === 'catchment-safe') {
            tips.push({ icon: 'fa-map-marker-alt', text: `Ensure your ${state} state of origin documents are correctly stated in your JAMB profile — this is critical for catchment admission.` });
            tips.push({ icon: 'fa-check-circle', text: 'Submit all screening documents promptly and confirm your catchment status via the CAPS portal.' });
            tips.push({ icon: 'fa-bell', text: `Join the OAE channel for real-time updates specific to this university.` });
        } else if (verdict === 'borderline') {
            tips.push({ icon: 'fa-search', text: 'Search for less competitive courses in the same faculty with lower cut-offs — they may be an easier entry point.' });
            tips.push({ icon: 'fa-university', text: 'Apply to 2–3 alternative universities using the OAE Aggregate Calculator to check your standing.' });
            tips.push({ icon: 'fa-redo', text: 'If no other option fits, consider a foundation/pre-degree programme at this school, or Direct Entry in future.' });
        } else {
            tips.push({ icon: 'fa-compass', text: 'Use the OAE Cut-Off Marks Explorer to find universities and courses where your aggregate meets the standard.' });
            tips.push({ icon: 'fa-graduation-cap', text: 'Polytechnics and Colleges of Education often have lower cut-offs and offer the same career pathways.' });
            tips.push({ icon: 'fa-book', text: 'Consider adding your name to the supplementary list or waiting list for the next JAMB cycle with a stronger score.' });
        }

        return tips;
    }

    // ── ALTERNATIVE COURSES RECOMMENDATION ───────────────────────
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

        // We only want courses from the SAME faculty to ensure subject combination alignment
        if (!targetFaculty) return [];
        const relatedCourses = faculties[targetFaculty];

        const meta = UNI_META[uniKey];

        relatedCourses.forEach(c => {
            if (c.course === targetCourseName || !c.mark || c.mark === 'NIL') return;
            
            const meritCutoff = parseFloat(c.mark);
            
            if (mode === 'taken') {
                const { aggregate } = params;
                // If they have taken it, recommend courses where their aggregate comfortably meets the merit cutoff
                if (aggregate >= meritCutoff) {
                    allAlternatives.push({
                        course: c.course,
                        mark: meritCutoff,
                        margin: aggregate - meritCutoff,
                        type: 'safe'
                    });
                }
            } else if (mode === 'not_taken') {
                const { jamb, olevelScore } = params;
                // Calculate required putme
                const requiredPutme = meta.reverseFormula(meritCutoff, jamb, olevelScore);
                
                // Realistic if > 0 and <= maxPutme (any mathematically possible target)
                if (requiredPutme > 0 && requiredPutme <= meta.putmeMax) {
                    allAlternatives.push({
                        course: c.course,
                        mark: meritCutoff,
                        requiredPutme: requiredPutme,
                        maxPutme: meta.putmeMax,
                        type: 'realistic'
                    });
                } else if (requiredPutme <= 0) {
                    // They already beat the cutoff just with JAMB/OLevel (rare but possible)
                    allAlternatives.push({
                        course: c.course,
                        mark: meritCutoff,
                        requiredPutme: 0,
                        maxPutme: meta.putmeMax,
                        type: 'guaranteed'
                    });
                }
            }
        });

        // Sort alternatives by cutoff descending (recommend best possible safe/realistic courses)
        allAlternatives.sort((a, b) => b.mark - a.mark);

        return allAlternatives.slice(0, 3); // Top 3
    }

    // ── RENDER RESULT ────────────────────────────────────────────
    function renderResult(params) {
        const { aggregate, meritCutoff, catchmentCutoff, verdict, chancePct, details, tips, uniName, courseName, state, channel, alternatives } = params;

        const verdictLabels = {
            safe: { title: '✅ Safe — Merit Admission Likely', icon: 'fa-check', sub: 'Your score qualifies for direct merit admission' },
            'catchment-safe': { title: '🏠 Safe via Catchment', icon: 'fa-home', sub: `Your state (${state}) grants you a catchment advantage` },
            borderline: { title: '⚠️ Borderline — Consider Alternatives', icon: 'fa-exclamation', sub: 'You are within striking range but not guaranteed' },
            unlikely: { title: '❌ Unlikely — Act Now', icon: 'fa-times', sub: 'Your score is significantly below cut-off' }
        };
        const lbl = verdictLabels[verdict];

        const catchDisplay = (catchmentCutoff && catchmentCutoff !== 'NIL')
            ? `<div class="cutoff-row"><span>Catchment (${state})</span><span class="cutoff-val catchment">${parseFloat(catchmentCutoff).toFixed(2)}</span></div>`
            : `<div class="cutoff-row"><span>Catchment (${state})</span><span class="cutoff-val nil">Not Available</span></div>`;

        const maxScore = 100;
        const yourPct    = Math.min(100, (aggregate / maxScore) * 100);
        const meritPct   = Math.min(100, (meritCutoff / maxScore) * 100);

        const tipsHtml = tips.map(t =>
            `<div class="tip-item"><i class="fas ${t.icon}"></i><span>${t.text}</span></div>`
        ).join('');

        resultArea.innerHTML = `
            <!-- Aggregate Score Box -->
            <div class="agg-score-box">
                <div class="agg-label">Your Calculated Aggregate</div>
                <div class="agg-value">${aggregate.toFixed(2)}</div>
                <div class="agg-school">${uniName} — ${courseName}</div>
            </div>

            <!-- Cutoff Comparison -->
            <div class="cutoff-comparison">
                <h4><i class="fas fa-chart-bar"></i> Cut-Off Comparison</h4>
                <div class="cutoff-row">
                    <span>Your Aggregate</span>
                    <span class="cutoff-val your-score">${aggregate.toFixed(2)}</span>
                </div>
                <div class="cutoff-row">
                    <span>Merit Cut-Off</span>
                    <span class="cutoff-val merit">${parseFloat(meritCutoff).toFixed(2)}</span>
                </div>
                ${catchDisplay}

                <div class="compare-bar-wrap">
                    <div class="compare-bar-label">
                        <span>Your Score</span><span>${aggregate.toFixed(1)}</span>
                    </div>
                    <div class="compare-bar-track">
                        <div class="compare-bar-fill your" style="width: 0%" data-target="${yourPct}"></div>
                    </div>
                </div>
                <div class="compare-bar-wrap">
                    <div class="compare-bar-label">
                        <span>Merit Cut-Off</span><span>${meritCutoff}</span>
                    </div>
                    <div class="compare-bar-track">
                        <div class="compare-bar-fill merit-line" style="width: 0%" data-target="${meritPct}"></div>
                    </div>
                </div>
            </div>

            <!-- Verdict Card -->
            <div class="verdict-card ${verdict}">
                <div class="verdict-top">
                    <div class="verdict-icon"><i class="fas ${lbl.icon}"></i></div>
                    <div>
                        <div class="verdict-title">${lbl.title}</div>
                        <div class="verdict-subtitle">${lbl.sub}</div>
                    </div>
                </div>
                <p class="verdict-message">${details}</p>
                <div class="chance-meter-wrap">
                    <div class="chance-meter-label">
                        <span>Admission Probability</span>
                        <span class="chance-pct">${chancePct}%</span>
                    </div>
                    <div class="chance-track">
                        <div class="chance-fill" style="width: 0%" data-target="${chancePct}"></div>
                    </div>
                </div>
            </div>

            <!-- Action Tips -->
            <div class="action-tips">
                <h4><i class="fas fa-lightbulb"></i> Smart Recommendations</h4>
                ${tipsHtml}
            </div>

            <!-- Course Alternatives -->
            ${alternatives && alternatives.length > 0 ? `
            <div class="action-tips" style="margin-top: 15px; background: #f8fafc; border-left-color: #6366f1;">
                <h4><i class="fas fa-random"></i> Smart Course Alternatives</h4>
                <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 12px; margin-top: -5px;">Based on your combination, here are safer courses in the same faculty that your score already qualifies for:</p>
                ${alternatives.map(alt => `
                    <div class="tip-item" style="align-items: flex-start;">
                        <i class="fas fa-check-circle" style="color: #10b981; margin-top: 3px;"></i>
                        <div>
                            <strong>${alt.course}</strong><br>
                            <span style="font-size: 0.85rem; color: #64748b;">Merit Cut-off: ${alt.mark} (You beat this by ${alt.margin.toFixed(2)} pts)</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            <!-- WhatsApp Channel CTA -->
            <div class="channel-cta" style="display:block;">
                <a href="${channel}" target="_blank" rel="noopener">
                    <i class="fab fa-whatsapp"></i>
                    Join OAE ${uniName.split('(')[0].trim()} Channel for Updates
                </a>
            </div>
        `;

        // Animate bars with a small delay
        requestAnimationFrame(() => {
            setTimeout(() => {
                document.querySelectorAll('.compare-bar-fill, .chance-fill').forEach(el => {
                    el.style.width = el.dataset.target + '%';
                });
            }, 100);
        });
    }

    // ── RENDER TARGET RESULTS ────────────────────────────────────
    function renderTargetResult(params) {
        const { meritTarget, catchTarget, state, maxPutme, uniName, courseName, channel, alternatives } = params;

        const isMeritPossible = meritTarget <= maxPutme;
        const isCatchPossible = catchTarget !== null && catchTarget <= maxPutme;

        // User feedback: "need to score between required mark - 30"
        const formatRange = (target) => {
            if (target <= 0) return `<span class="target-score success">0 <small>/ ${maxPutme}</small></span>`;
            if (target > maxPutme) return `<span class="target-score impossible">Impossible</span>`;
            return `<span class="target-score success">${target.toFixed(1)} - ${maxPutme} <small>/ ${maxPutme}</small></span>`;
        };

        const meritDisplay = formatRange(meritTarget);
        const catchDisplayContent = catchTarget !== null ? formatRange(catchTarget) : `<span class="target-score nil">Not Available</span>`;

        let adviceHtml = '';
        if (isMeritPossible) {
            adviceHtml = `<div class="verdict-card safe">
                <div class="verdict-top">
                    <div class="verdict-icon"><i class="fas fa-bullseye"></i></div>
                    <div>
                        <div class="verdict-title">Goal Set!</div>
                        <div class="verdict-subtitle">You still have a solid chance</div>
                    </div>
                </div>
                <p class="verdict-message">To secure admission on merit, you need to score at least <strong>${meritTarget.toFixed(1)} out of ${maxPutme}</strong> in your Post-UTME. Start preparing intensively.</p>
            </div>`;
        } else if (isCatchPossible) {
            adviceHtml = `<div class="verdict-card catchment-safe">
                <div class="verdict-top">
                    <div class="verdict-icon"><i class="fas fa-home"></i></div>
                    <div>
                        <div class="verdict-title">Catchment Lifeline</div>
                        <div class="verdict-subtitle">Merit is out of reach, but catchment is possible</div>
                    </div>
                </div>
                <p class="verdict-message">A merit admission requires scoring above the max possible Post-UTME score. However, leveraging your <strong>${state}</strong> state of origin, you can still gain admission by scoring at least <strong>${catchTarget.toFixed(1)} out of ${maxPutme}</strong>.</p>
            </div>`;
        } else {
            adviceHtml = `<div class="verdict-card unlikely">
                <div class="verdict-top">
                    <div class="verdict-icon"><i class="fas fa-exclamation-triangle"></i></div>
                    <div>
                        <div class="verdict-title">Consider Changing Course</div>
                        <div class="verdict-subtitle">Required score exceeds maximum possible</div>
                    </div>
                </div>
                <p class="verdict-message">Even if you score 100% in your Post-UTME, your combined aggregate will still be below the required cut-off marks for this course. <strong>We strongly advise changing to a less competitive course.</strong></p>
            </div>`;
        }

        resultArea.innerHTML = `
            <!-- Target Box -->
            <div class="agg-score-box">
                <div class="agg-label">Required Post-UTME Score</div>
                <div class="agg-value">${isMeritPossible ? meritTarget.toFixed(1) : (isCatchPossible ? catchTarget.toFixed(1) : 'Change Course')}</div>
                <div class="agg-school">${uniName} — ${courseName}</div>
            </div>

            <!-- Detailed Targets -->
            <div class="cutoff-comparison" style="margin-top: 20px;">
                <h4><i class="fas fa-bullseye"></i> Target Breakdown</h4>
                <div class="cutoff-row">
                    <span>Target for Merit Admission</span>
                    ${meritDisplay}
                </div>
                <div class="cutoff-row">
                    <span>Target for Catchment (${state})</span>
                    ${catchDisplayContent}
                </div>
            </div>

            ${adviceHtml}

            <!-- Course Alternatives -->
            ${alternatives && alternatives.length > 0 ? `
            <div class="action-tips" style="margin-top: 15px; background: #f8fafc; border-left-color: #6366f1;">
                <h4><i class="fas fa-random"></i> Smart Course Alternatives</h4>
                <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 12px; margin-top: -5px;">Consider changing to these courses in the same faculty with more realistic Post-UTME targets:</p>
                ${alternatives.map(alt => `
                    <div class="tip-item" style="align-items: flex-start;">
                        <i class="fas fa-bullseye" style="color: #6366f1; margin-top: 3px;"></i>
                        <div>
                            <strong>${alt.course}</strong><br>
                            <span style="font-size: 0.85rem; color: #64748b;">Merit Cut-off: ${alt.mark} &bull; Required Target: ${alt.requiredPutme > 0 ? `${alt.requiredPutme.toFixed(1)} - ${alt.maxPutme}` : 'Guaranteed'}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            <!-- WhatsApp Channel CTA -->
            <div class="channel-cta" style="display:block;">
                <a href="${channel}" target="_blank" rel="noopener">
                    <i class="fab fa-whatsapp"></i>
                    Join OAE ${uniName.split('(')[0].trim()} Channel for Updates
                </a>
            </div>
        `;
    }

    // ── MAIN PREDICT HANDLER ─────────────────────────────────────
    function onPredict() {
        predError.style.display = 'none';

        const uniKey  = uniSelect.value;
        const course  = courseSelect.value;
        const state   = stateSelect.value;
        const jambRaw = jambInput.value.trim();
        const putmeRaw = putmeInput.value.trim();

        const putmeStatus = document.querySelector('input[name="putme_status"]:checked').value;

        // Validate
        if (!uniKey)    return showError('Please select a university.');
        if (!course)    return showError('Please select a course.');
        if (!state)     return showError('Please select your state of origin.');
        if (!jambRaw)   return showError('Please enter your JAMB score.');

        const jamb = parseFloat(jambRaw);
        if (isNaN(jamb) || jamb < 0 || jamb > 400)
            return showError('Enter a valid JAMB score between 0 and 400.');

        const meta    = UNI_META[uniKey];
        let putme = 0;

        if (putmeStatus === 'yes') {
            if (putmeRaw === '')
                return showError(`Please enter your Post-UTME score (out of ${meta.putmeMax}).`);
            putme = parseFloat(putmeRaw);
            if (isNaN(putme) || putme < 0 || putme > meta.putmeMax)
                return showError(`Post-UTME score must be between 0 and ${meta.putmeMax} for this school.`);
        }

        let olevelGrades = [];
        if (meta.hasOlevel) {
            olevelSelects.forEach(sel => olevelGrades.push(sel.value));
            if (olevelGrades.some(g => g === ''))
                return showError("Please select grades for all 5 O'Level subjects.");
        }

        // Show loading briefly for effect
        resultArea.innerHTML = '';
        loadingEl.innerHTML = putmeStatus === 'yes' 
            ? '<i class="fas fa-circle-notch"></i> Analysing your profile against cut-off data...'
            : '<i class="fas fa-circle-notch"></i> Calculating target Post-UTME scores...';
        loadingEl.style.display = 'block';

        setTimeout(() => {
            loadingEl.style.display = 'none';

            // Parse course data
            let courseData;
            try { courseData = JSON.parse(course); }
            catch (e) { return showError('Invalid course selection. Please try again.'); }

            const meritCutoff = parseFloat(courseData.mark);
            const catchMap    = courseData.catchment || {};
            const catchVal    = catchMap[state] || null;
            const courseName  = courseSelect.options[courseSelect.selectedIndex].textContent;

            if (putmeStatus === 'no') {
                // Flow 2: Target Calculator
                let olevelScore = 0;
                if (meta.hasOlevel && meta.olevelMap) {
                    olevelScore = calcOlevel(meta.olevelMap, olevelGrades);
                }

                const meritTarget = meta.reverseFormula(meritCutoff, jamb, olevelScore);
                let catchTarget = null;
                if (catchVal !== null && catchVal !== 'NIL') {
                    catchTarget = meta.reverseFormula(parseFloat(catchVal), jamb, olevelScore);
                }

                // Find Alternatives
                const alternatives = findAlternativeCourses(uniKey, courseName, 'not_taken', { jamb, olevelScore });

                renderTargetResult({
                    meritTarget: Math.max(0, meritTarget),
                    catchTarget: catchTarget !== null ? Math.max(0, catchTarget) : null,
                    state,
                    maxPutme: meta.putmeMax,
                    uniName: meta.name,
                    courseName,
                    channel: meta.channel,
                    alternatives
                });
            } else {
                // Flow 1: Normal Predictor
                const aggregate = computeAggregate(uniKey, jamb, putme, olevelGrades);
                const cappedAgg = Math.min(100, aggregate);

                // Run prediction
                const { verdict, chancePct, details } = predict(cappedAgg, meritCutoff, catchVal, state);

                // Generate tips
                const tips = generateTips(verdict, uniKey, state, cappedAgg, meritCutoff);

                // Find Alternatives
                const alternatives = findAlternativeCourses(uniKey, courseName, 'taken', { aggregate: cappedAgg });

                // Render
                renderResult({
                    aggregate: cappedAgg,
                    meritCutoff,
                    catchmentCutoff: catchVal,
                    verdict, chancePct, details, tips,
                    uniName:    meta.name,
                    courseName,
                    state,
                    channel:    meta.channel,
                    alternatives
                });
            }

        }, 900); // artificial 0.9s delay for polish
    }

    function showError(msg) {
        predError.textContent = msg;
        predError.style.display = 'block';
        predError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ── START ────────────────────────────────────────────────────
    init();
});
