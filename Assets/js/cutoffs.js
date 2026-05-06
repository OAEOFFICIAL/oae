/**
 * OAE Cut-Off Marks Logic Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    const schoolSelect = document.getElementById('school-select');
    const yearSelect = document.getElementById('year-select');
    const searchInput = document.getElementById('course-search');
    const bannerSection = document.getElementById('school-banner');
    const accordionContainer = document.getElementById('accordion-container');
    const emptyState = document.getElementById('empty-state');
    const schoolNameEl = document.getElementById('banner-school-name');
    const generalScoreEl = document.getElementById('banner-general-score');
    const schoolIconEl = document.getElementById('banner-school-icon');

    const db = window.oaeCutOffData;

    // Populate School Dropdown
    schoolSelect.innerHTML = '<option value="" disabled selected>Select Institution...</option>';
    for (const key in db) {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = db[key].name;
        schoolSelect.appendChild(opt);
    }

    schoolSelect.addEventListener('change', () => {
        const school = db[schoolSelect.value];
        if (!school) return;
        yearSelect.innerHTML = '';
        Object.keys(school.years).sort((a,b) => b.localeCompare(a)).forEach(y => {
            const opt = document.createElement('option');
            opt.value = y; opt.textContent = y;
            yearSelect.appendChild(opt);
        });
        yearSelect.disabled = false;
        searchInput.disabled = false;
        renderData();
    });

    yearSelect.addEventListener('change', renderData);
    searchInput.addEventListener('input', renderData);

    function renderData() {
        const schoolKey = schoolSelect.value;
        const yearKey = yearSelect.value;
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!schoolKey || !yearKey) return;

        const school = db[schoolKey];
        const yearData = school.years[yearKey];

        emptyState.style.display = 'none';
        bannerSection.style.display = 'flex';
        accordionContainer.style.display = 'flex';

        schoolNameEl.textContent = `${school.name} (${yearKey})`;
        generalScoreEl.textContent = `${school.general_jamb}+`;
        schoolIconEl.className = `fas ${school.logoIcon || 'fa-university'}`;

        // Add WhatsApp Channel Message
        const channelUrl = school.channel || 'https://whatsapp.com/channel/0029VakYvdGBPzja0pE8OC3G';
        const existingChannelMessage = document.querySelector('.channel-join-banner');
        if (existingChannelMessage) {
            existingChannelMessage.remove();
        }
        
        const channelBanner = document.createElement('div');
        channelBanner.className = 'channel-join-banner';
        channelBanner.style.cssText = `
            background: linear-gradient(135deg, #0a8a2f 0%, #066426 100%);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            margin: 20px 0;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 4px 15px rgba(10, 138, 47, 0.2);
            flex-wrap: wrap;
        `;
        
        channelBanner.innerHTML = `
            <div style="font-size: 24px;"><i class="fas fa-mobile-alt" style="color: white;"></i></div>
            <div style="flex: 1; min-width: 200px;">
                <p style="margin: 0; font-weight: 600; font-size: 15px;"><i class="fas fa-graduation-cap"></i> Join ${school.name} Channel</p>
                <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.95;">Get real-time updates on admissions, results, and important notices</p>
            </div>
            <a href="${channelUrl}" target="_blank" style="
                background: white;
                color: #0a8a2f;
                padding: 10px 20px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                font-size: 13px;
                white-space: nowrap;
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                <i class="fas fa-bullhorn"></i> Join Now
            </a>
        `;
        
        // Insert the channel banner after the school banner
        bannerSection.parentNode.insertBefore(channelBanner, bannerSection.nextSibling);

        accordionContainer.innerHTML = '';
        let hasVisibleData = false;

        // Detect columns from first course in first faculty
        const sampleCourse = Object.values(yearData)[0]?.[0];
        const hasCatchment = sampleCourse && sampleCourse.catchment;
        const catchmentStates = hasCatchment ? Object.keys(sampleCourse.catchment) : [];

        for (const faculty in yearData) {
            const courses = yearData[faculty];
            const filtered = courses.filter(c => c.course.toLowerCase().includes(searchTerm));
            if (filtered.length === 0) continue;

            hasVisibleData = true;
            const item = document.createElement('div');
            item.className = 'accordion-item' + (searchTerm ? ' active' : '');

            // Build table headers
            let thHtml = `<th class="col-course">Programme</th><th class="col-merit">Merit</th>`;
            if (hasCatchment) {
                catchmentStates.forEach(s => { thHtml += `<th class="col-state">${s}</th>`; });
            }

            // Build table rows
            const rows = filtered.map(c => {
                let tds = `<td class="course-name">${c.course}</td><td class="course-score">${c.mark === 'NIL' ? '<span class="nil-badge">NIL</span>' : c.mark}</td>`;
                if (hasCatchment && c.catchment) {
                    catchmentStates.forEach(s => {
                        const val = c.catchment[s];
                        tds += `<td class="state-score">${(!val || val === 'NIL') ? '<span class="nil-badge">NIL</span>' : val}</td>`;
                    });
                }
                return `<tr>${tds}</tr>`;
            }).join('');

            item.innerHTML = `
                <div class="accordion-header">
                    <div class="accordion-title"><i class="fas fa-layer-group"></i> ${faculty}</div>
                    <i class="fas fa-chevron-down accordion-icon"></i>
                </div>
                <div class="accordion-content">
                    <div class="table-scroll-wrapper">
                        <table class="course-table">
                            <thead><tr>${thHtml}</tr></thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                </div>`;

            item.querySelector('.accordion-header').addEventListener('click', () => item.classList.toggle('active'));
            accordionContainer.appendChild(item);
        }

        if (!searchTerm && hasVisibleData) {
            accordionContainer.querySelector('.accordion-item')?.classList.add('active');
        }

        if (!hasVisibleData) {
            accordionContainer.innerHTML = `
                <div class="empty-state" style="display:block; margin-top:20px;">
                    <i class="fas fa-search-minus"></i>
                    <h3>No Courses Found</h3>
                    <p>No course matching "<strong>${searchTerm}</strong>" was found in this school.</p>
                </div>`;
        }
    }
});
