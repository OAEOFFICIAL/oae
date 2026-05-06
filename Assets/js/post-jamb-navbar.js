// OAE Mobile Menu Toggle
        const oaeHamburger = document.getElementById('oaeHamburger');
        const oaeMobileMenu = document.getElementById('oaeMobileMenu');
        
        if (oaeHamburger && oaeMobileMenu) {
            oaeHamburger.addEventListener('click', function() {
                oaeMobileMenu.classList.toggle('active');
                
                // Change hamburger icon
                const icon = this.querySelector('i');
                if (oaeMobileMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }
        
        // Global Site Search Functionality
        (function(){
            const oaeSearchBtn = document.querySelector('.oae-search-btn');
            const oaeSearchInput = document.querySelector('.oae-search-container input');
            
            if (!oaeSearchBtn && !oaeSearchInput) return;

            if (oaeSearchInput) {
                oaeSearchInput.setAttribute('autocomplete', 'off');
            }

            // Define our global searchable database
            const searchDatabase = [
                { title: "JAMB Past Questions & Preparation", keywords: "jamb utme past questions cbt exam practice", url: "/Service/JAMB/Index.htm", type: "Exam Hub" },
                { title: "WAEC Resources", keywords: "waec weac past questions theory objective", url: "/Service/WAEC/Index.htm", type: "Exam Hub" },
                { title: "NECO Preparation", keywords: "neco exams past questions secondary", url: "/Service/NECO/Index.htm", type: "Exam Hub" },
                { title: "Post-UTME Guide & Resources", keywords: "post utme post-jamb screening guide admission", url: "/admission/post-jamb/index.html", type: "Admission" },
                { title: "Aggregate Score Calculator", keywords: "aggregate calculator calculate score chances ui unilag oau", url: "/admission/aggregate-calculator/index.html", type: "Tool" },
                { title: "Subject Combination Verifier", keywords: "subject combination jamb subjects course requirements", url: "/admission/subject-combinations/index.html", type: "Tool" },
                { title: "Admission News & Updates", keywords: "news updates admission list forms board", url: "/admission/updates/index.html", type: "News" },
                { title: "University of Ibadan (UI)", keywords: "ui ibadan university of ibadan post utme aggregate", url: "/admission/schools/ui.html", type: "University" },
                { title: "University of Lagos (UNILAG)", keywords: "unilag lagos university of lagos akoka", url: "/admission/schools/unilag.html", type: "University" },
                { title: "Obafemi Awolowo University (OAU)", keywords: "oau obafemi awolowo ile-ife ife", url: "/admission/schools/oau.html", type: "University" },
                { title: "Nnamdi Azikiwe University (UNIZIK)", keywords: "unizik nnamdi azikiwe awka anambra", url: "/admission/schools/unizik.html", type: "University" },
                { title: "Osun State University (UNIOSUN)", keywords: "uniosun osun state university osogbo", url: "/admission/schools/uniosun.html", type: "University" },
                { title: "Lagos State University (LASU)", keywords: "lasu lagos state university ojo", url: "/admission/schools/lasu.html", type: "University" },
                { title: "Ahmadu Bello University (ABU)", keywords: "abu ahmadu bello zaria", url: "/admission/schools/abu.html", type: "University" },
                { title: "Smart Quiz Arena", keywords: "quiz test cbt exam practice", url: "/Quizzes/index.html", type: "Practice" },
                { title: "Coding Lessons & Tech", keywords: "tech coding programming html css javascript", url: "/Tech/index.html", type: "Tech" }
            ];

            let resultsContainer = null;
            let debounceTimer = null;

            function createResultsUI(){
                if(resultsContainer) return resultsContainer;
                resultsContainer = document.createElement('div');
                resultsContainer.id = 'navbar-search-results';
                resultsContainer.style.cssText = 'position:absolute;top:calc(100% + 5px);left:50%;transform:translateX(-50%);width:100%;min-width:300px;max-width:calc(100vw - 20px);background:white;border:1px solid #e0e0e0;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,0.15);max-height:360px;overflow-y:auto;z-index:9999;display:none;text-align:left;';
                
                // Find parent container
                let searchSection = document.querySelector('.oae-search-container');
                if (searchSection) {
                    searchSection.style.position = 'relative';
                    searchSection.appendChild(resultsContainer);
                }
                return resultsContainer;
            }

            function showSuggestions(q){
                if(!resultsContainer) resultsContainer = createResultsUI();
                if(!resultsContainer) return; 
                
                // Rank matches
                const results = searchDatabase.map(item => {
                    let score = 0;
                    const titleLower = item.title.toLowerCase();
                    if (titleLower.includes(q)) score += 5;
                    if (titleLower.startsWith(q)) score += 10;
                    if (item.keywords.includes(q)) score += 2;
                    return {...item, score};
                }).filter(r => r.score > 0).sort((a,b) => b.score - a.score).slice(0, 6);

                if(results.length === 0){
                    resultsContainer.innerHTML = '<div style="padding:12px;color:#999;font-size:0.9rem">No exact matches found.</div>';
                } else {
                    resultsContainer.innerHTML = results.map(r => `
                        <a href="${r.url}" style="display:block;padding:14px 16px;border-bottom:1px solid #f5f5f5;text-decoration:none;color:#333;transition:background 0.2s">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span style="font-weight:600;color:#0a8a2f;font-size:0.95rem">${r.title}</span>
                                <span style="font-size:0.75rem;background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:12px;">${r.type}</span>
                            </div>
                        </a>
                    `).join('');
                    
                    Array.from(resultsContainer.querySelectorAll('a')).forEach(a=>{
                        a.addEventListener('mouseenter', ()=>a.style.background='#f9f9f9');
                        a.addEventListener('mouseleave', ()=>a.style.background='transparent');
                    });
                }
                resultsContainer.style.display = 'block';
            }

            function performSearch(){
                const q = (oaeSearchInput ? oaeSearchInput.value : '').trim().toLowerCase();
                if(!q) return;
                
                if(resultsContainer) resultsContainer.style.display = 'none';
                
                const results = searchDatabase.map(item => {
                    let score = 0;
                    if (item.title.toLowerCase().includes(q)) score += 5;
                    if (item.keywords.includes(q)) score += 2;
                    return {...item, score};
                }).filter(r => r.score > 0).sort((a,b) => b.score - a.score);
                
                if (results.length > 0) {
                    window.location.href = results[0].url;
                } else {
                    alert("No matching page found for: " + q);
                }
            }

            if (oaeSearchInput) {
                oaeSearchInput.addEventListener('input', function(e){
                    clearTimeout(debounceTimer);
                    const q = (this.value||'').trim().toLowerCase();
                    if(!q){ if(resultsContainer) resultsContainer.style.display = 'none'; return; }
                    debounceTimer = setTimeout(()=>{ showSuggestions(q); }, 150);
                });

                oaeSearchInput.addEventListener('keypress', (e)=>{ 
                    if(e.key === 'Enter'){ 
                        e.preventDefault(); 
                        performSearch(); 
                    } 
                });
                
                document.addEventListener('click', (e) => {
                    if (resultsContainer && !resultsContainer.contains(e.target) && e.target !== oaeSearchInput) {
                        resultsContainer.style.display = 'none';
                    }
                });
            }

            if (oaeSearchBtn) {
                oaeSearchBtn.addEventListener('click', (e)=>{ 
                    e.preventDefault(); 
                    performSearch(); 
                });
            }

        })();
        
        // Global Auth State for Post-JAMB Navbar
        const oaeJoinBtn = document.querySelector('.oae-join-btn');
        const oaeJoinMobile = document.querySelector('.oae-join-mobile');
        
        const userDataStr = localStorage.getItem('oae_user');
        
        function updateJoinUI() {
            if (userDataStr) {
                if(oaeJoinBtn) {
                    oaeJoinBtn.textContent = 'Dashboard';
                    oaeJoinBtn.style.background = '#059669'; // Green dashboard color
                }
                if(oaeJoinMobile) {
                    oaeJoinMobile.innerHTML = '<i class="fas fa-tachometer-alt"></i> Dashboard';
                    oaeJoinMobile.style.background = '#059669';
                }
            }
        }
        updateJoinUI();
        
        if (oaeJoinBtn) {
            oaeJoinBtn.addEventListener('click', function() {
                if (!userDataStr) {
                    window.location.href = '/login.htm';
                } else {
                    window.location.href = '/dashboard.html';
                }
            });
        }
        
        if (oaeJoinMobile) {
            oaeJoinMobile.addEventListener('click', function() {
                if (!userDataStr) {
                    window.location.href = '/login.htm';
                } else {
                    window.location.href = '/dashboard.html';
                }
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (oaeMobileMenu && !event.target.closest('.oae-navbar') && oaeMobileMenu.classList.contains('active')) {
                oaeMobileMenu.classList.remove('active');
                if (oaeHamburger && oaeHamburger.querySelector('i')) {
                    oaeHamburger.querySelector('i').classList.remove('fa-times');
                    oaeHamburger.querySelector('i').classList.add('fa-bars');
                }
            }
        });