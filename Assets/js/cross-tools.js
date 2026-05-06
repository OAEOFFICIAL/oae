/**
 * OAE Cross-Tool Navigation Engine
 * Automatically detects the current admission tool and renders
 * a "Next Steps" section linking to the other related tools.
 */
(function () {

    // ── TOOL REGISTRY ─────────────────────────────────────────────
    const TOOLS = {
        cutoffs: {
            href: '/admission/cut-off-marks/',
            icon: 'fa-list-alt',
            title: 'Cut-Off Marks Explorer',
            desc: 'Browse official departmental cut-offs for top Nigerian universities.',
            color: '#0a8a2f',
            bg: 'rgba(10,138,47,0.15)',
            step: 1,
            label: 'Cut-Offs'
        },
        calculator: {
            href: '/admission/aggregate-calculator/',
            icon: 'fa-calculator',
            title: 'Aggregate Calculator',
            desc: "Compute your exact aggregate score using your school's official formula.",
            color: '#d97706',
            bg: 'rgba(217,119,6,0.15)',
            step: 2,
            label: 'Aggregate'
        },
        predictor: {
            href: '/admission/chance-predictor/',
            icon: 'fa-brain',
            title: 'Admission Chance Predictor',
            desc: 'Get a personalised verdict — are you safe, borderline, or unlikely?',
            color: '#6c3fc4',
            bg: 'rgba(108,63,196,0.15)',
            step: 3,
            label: 'Predictor'
        },
        subjects: {
            href: '/admission/subject-combinations/',
            icon: 'fa-book-open',
            title: 'Subject Combinations',
            desc: "Find the right JAMB & O'Level subjects required for your course.",
            color: '#0369a1',
            bg: 'rgba(3,105,161,0.15)',
            step: 4,
            label: 'Subjects'
        },
        postjamb: {
            href: '/admission/post-jamb/',
            icon: 'fa-pencil-alt',
            title: 'Post-JAMB Guide',
            desc: 'Screening dates, tips, and everything you need for Post-UTME success.',
            color: '#be123c',
            bg: 'rgba(190,18,60,0.15)',
            step: 5,
            label: 'Post-UTME'
        }
    };

    // ── DETECT CURRENT PAGE ────────────────────────────────────────
    const path = window.location.pathname;
    let currentKey = '';
    if      (path.includes('cut-off-marks'))       currentKey = 'cutoffs';
    else if (path.includes('aggregate-calculator')) currentKey = 'calculator';
    else if (path.includes('chance-predictor'))     currentKey = 'predictor';
    else if (path.includes('subject-combinations')) currentKey = 'subjects';
    else if (path.includes('post-jamb'))            currentKey = 'postjamb';

    // Nothing to render if not on a known tool page
    if (!currentKey) return;

    // ── DECIDE WHICH CARDS TO SHOW ─────────────────────────────────
    // Priority order: logically next steps come first
    const PRIORITY = {
        cutoffs:    ['calculator', 'predictor', 'subjects'],
        calculator: ['predictor', 'cutoffs',    'subjects'],
        predictor:  ['cutoffs',   'calculator', 'subjects'],
        subjects:   ['cutoffs',   'calculator', 'predictor'],
        postjamb:   ['predictor', 'cutoffs',    'calculator']
    };
    const showKeys = PRIORITY[currentKey] || Object.keys(TOOLS).filter(k => k !== currentKey).slice(0, 3);

    // ── JOURNEY DOTS ───────────────────────────────────────────────
    const allSteps = Object.entries(TOOLS).sort((a, b) => a[1].step - b[1].step);
    const dotsHtml = allSteps.map(([key, t], i) => {
        const isActive = key === currentKey;
        const isLast   = i === allSteps.length - 1;
        return `
            <div class="ojd-step">
                <a href="${t.href}" style="text-decoration:none;">
                    <div class="ojd-dot${isActive ? ' active' : ''}" title="${t.title}"
                         style="${isActive ? `background:${t.bg};border-color:${t.color};color:${t.color};` : ''}">
                        <i class="fas ${t.icon}"></i>
                    </div>
                    <div class="ojd-label${isActive ? ' active' : ''}"
                         style="${isActive ? `color:${t.color};` : ''}">${t.label}</div>
                </a>
            </div>
            ${!isLast ? '<div class="ojd-line"></div>' : ''}
        `;
    }).join('');

    // ── TOOL CARDS ─────────────────────────────────────────────────
    const cardsHtml = showKeys.map(key => {
        const t = TOOLS[key];
        return `
            <a href="${t.href}" class="oae-next-card">
                <div class="onc-icon" style="background:${t.bg}; color:${t.color};">
                    <i class="fas ${t.icon}"></i>
                </div>
                <div class="onc-text">
                    <h4>${t.title}</h4>
                    <p>${t.desc}</p>
                </div>
                <i class="fas fa-arrow-right onc-arrow"></i>
            </a>
        `;
    }).join('');

    // ── HEADING COPY PER PAGE ──────────────────────────────────────
    const COPY = {
        cutoffs:    { heading: 'Now, <span>Predict Your Chances</span>',  sub: "You've seen the cut-offs. Now enter your scores and find out if you'll get admitted." },
        calculator: { heading: 'Got Your Aggregate? <span>Check Your Chances</span>', sub: 'Run your calculated aggregate through our predictor to get a real admission verdict.' },
        predictor:  { heading: 'Explore More <span>Admission Tools</span>', sub: 'Dig deeper — verify cut-offs, recalculate your aggregate, or confirm your subject combination.' },
        subjects:   { heading: 'Know Your Subjects? <span>Check the Cut-Offs</span>', sub: "Now confirm your course's merit aggregate and predict your admission chances." },
        postjamb:   { heading: 'Ready for <span>Post-UTME?</span>', sub: "Use our other tools to maximise your chances before and after your screening." }
    };
    const copy = COPY[currentKey];

    // ── BUILD SECTION HTML ─────────────────────────────────────────
    const section = document.createElement('section');
    section.className = 'oae-next-steps';
    section.innerHTML = `
        <div class="oae-next-inner">

            <!-- Journey Progress Dots -->
            <div class="oae-journey-dots">${dotsHtml}</div>

            <!-- Section Header -->
            <div class="oae-next-header">
                <div class="oae-next-badge">
                    <i class="fas fa-compass"></i> Continue Your Journey
                </div>
                <h2>${copy.heading}</h2>
                <p>${copy.sub}</p>
            </div>

            <!-- Tool Cards -->
            <div class="oae-next-grid">${cardsHtml}</div>

        </div>
    `;

    // ── INJECT BEFORE FOOTER ───────────────────────────────────────
    const footer = document.querySelector('footer.oae-footer, footer');
    if (footer) {
        footer.parentNode.insertBefore(section, footer);
    } else {
        document.body.appendChild(section);
    }

})();
