// Post-JAMB Page Interactions

document.addEventListener('DOMContentLoaded', function() {
    
    // Check What To Do Next Button - Smooth scroll to next section
    const checkWhatNextBtn = document.getElementById('checkWhatNextBtn');
    if (checkWhatNextBtn) {
        checkWhatNextBtn.addEventListener('click', function() {
            // Scroll to next section (when created, update this selector)
            const nextSection = document.querySelector('.what-to-do-section');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Placeholder: scroll down by viewport height
                window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
            }
        });
    }

    // View School Guides Button - Navigate to schools page
    const viewSchoolGuidesBtn = document.getElementById('viewSchoolGuidesBtn');
    if (viewSchoolGuidesBtn) {
        viewSchoolGuidesBtn.addEventListener('click', function() {
            // Placeholder: update this URL when schools page is ready
            window.location.href = '../../Universities/index.htm';
        });
    }

    // Check Next Steps Button - Smooth scroll to What To Do section
    const checkStepsBtn = document.getElementById('checkStepsBtn');
    if (checkStepsBtn) {
        checkStepsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.getElementById('what-to-do-section');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
