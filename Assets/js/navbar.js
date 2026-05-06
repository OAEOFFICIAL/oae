        // Toggle mobile menu
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
                
                // Change hamburger icon
                const icon = this.querySelector('i');
                if (mobileMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }
        
        // Toggle mobile dropdowns
        document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = this.nextElementSibling;
                const icon = this.querySelector('.fa-chevron-down');
                
                // Close other dropdowns
                document.querySelectorAll('.mobile-dropdown').forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                        other.previousElementSibling.querySelector('.fa-chevron-down').style.transform = 'rotate(0deg)';
                    }
                });
                
                dropdown.classList.toggle('active');
                
                if (dropdown.classList.contains('active')) {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });
        
        // Toggle nested mobile dropdowns
        document.querySelectorAll('.mobile-nested-toggle').forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Prevent parent dropdown from closing
                const nestedDropdown = this.nextElementSibling;
                const icon = this.querySelector('.fa-chevron-down');
                
                // Close other nested dropdowns in same parent
                const parent = this.closest('.mobile-dropdown');
                if (parent) {
                    parent.querySelectorAll('.mobile-nested-dropdown').forEach(other => {
                        if (other !== nestedDropdown) {
                            other.classList.remove('active');
                            other.previousElementSibling.querySelector('.fa-chevron-down').style.transform = 'rotate(0deg)';
                        }
                    });
                }
                
                nestedDropdown.classList.toggle('active');
                
                if (nestedDropdown.classList.contains('active')) {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });
        
        // Global Site Search Functionality
        (function(){
            const searchBtn = document.querySelector('.search-btn');
            const searchInput = document.querySelector('.search-section input, #site-search');
            
            if (!searchBtn && !searchInput) return;

            if (searchInput) {
                searchInput.setAttribute('autocomplete', 'off');
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
                let searchSection = document.querySelector('.search-section');
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
                const q = (searchInput ? searchInput.value : '').trim().toLowerCase();
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

            if (searchInput) {
                searchInput.addEventListener('input', function(e){
                    clearTimeout(debounceTimer);
                    const q = (this.value||'').trim().toLowerCase();
                    if(!q){ if(resultsContainer) resultsContainer.style.display = 'none'; return; }
                    debounceTimer = setTimeout(()=>{ showSuggestions(q); }, 150);
                });

                searchInput.addEventListener('keypress', (e)=>{ 
                    if(e.key === 'Enter'){ 
                        e.preventDefault(); 
                        performSearch(); 
                    } 
                });
                
                document.addEventListener('click', (e) => {
                    if (resultsContainer && !resultsContainer.contains(e.target) && e.target !== searchInput) {
                        resultsContainer.style.display = 'none';
                    }
                });
            }

            if (searchBtn) {
                searchBtn.addEventListener('click', (e)=>{ 
                    e.preventDefault(); 
                    performSearch(); 
                });
            }

        })();
        
        // Global Auth State for Main Navbar
        const userDataStr = localStorage.getItem('oae_user');
        const joinBtns = document.querySelectorAll('.cta, .join-btn, .join-btn-mobile');
        
        if (userDataStr) {
            joinBtns.forEach(btn => {
                if (btn.tagName === 'A') {
                    btn.href = '/dashboard.html';
                    btn.textContent = 'Dashboard';
                } else {
                    btn.innerHTML = '<i class="fas fa-tachometer-alt"></i> Dashboard';
                    btn.addEventListener('click', () => { window.location.href = '/dashboard.html'; });
                }
            });
        } else {
            // Unauthenticated
            joinBtns.forEach(btn => {
                if (btn.tagName !== 'A') {
                    btn.addEventListener('click', () => { window.location.href = '/login.htm'; });
                }
            });
        }
        
        // Take Quiz button functionality
        const quizBtnMobile = document.querySelector('.quiz-btn-mobile');
        if (quizBtnMobile) {
            quizBtnMobile.addEventListener('click', function() {
                window.location.href = '/jamb.htm';
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (mobileMenu && !event.target.closest('.navbar') && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                if (hamburger && hamburger.querySelector('i')) {
                    hamburger.querySelector('i').classList.remove('fa-times');
                    hamburger.querySelector('i').classList.add('fa-bars');
                }
                
                // Close all dropdowns
                document.querySelectorAll('.mobile-dropdown, .mobile-nested-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
                
                // Reset all icons
                document.querySelectorAll('.fa-chevron-down').forEach(icon => {
                    icon.style.transform = 'rotate(0deg)';
                });
            }
        });
