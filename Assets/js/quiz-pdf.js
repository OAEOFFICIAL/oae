/**
 * OAE Quiz PDF Generator
 * Creates a clean PDF of quiz results.
 */

const QuizPDF = (function() {
  
  function downloadResults(results, questionsBySubject, userAnswers) {
    const container = document.getElementById('results-container');
    if (!container) return;

    // Create a clone
    const clone = container.cloneNode(true);
    
    // CRITICAL FIX: Explicit width, NO margins (fixes left cutoff), NO max-height (fixes vertical cutoff)
    clone.style.cssText = `
      background: white !important;
      color: black !important;
      font-family: Arial, sans-serif !important;
      width: 1000px !important;
      max-width: 1000px !important;
      margin: 0 !important;
      padding: 40px !important;
      box-sizing: border-box !important;
      display: block !important;
    `;

    // Remove buttons
    const buttons = clone.querySelectorAll('button');
    buttons.forEach(btn => btn.remove());

    // Force text colors
    const allElements = clone.querySelectorAll('*');
    allElements.forEach(el => {
      el.style.color = '#000000';
      el.style.background = el.style.background.includes('var(--green)') ? '#0a8a2f' : el.style.background;
    });

    // Style headings
    const headings = clone.querySelectorAll('h2, h3, h4');
    headings.forEach(h => {
      h.style.color = '#0a8a2f';
      h.style.marginTop = '20px';
      h.style.marginBottom = '12px';
    });

    // CRITICAL FIX: Uncap the scrollable div so it renders full height!
    const scrollableDivs = clone.querySelectorAll('[style*="overflow-y"]');
    scrollableDivs.forEach(div => {
      div.style.maxHeight = 'none';
      div.style.overflowY = 'visible';
      div.style.border = 'none';
      div.style.padding = '0';
      div.style.height = 'auto';
    });

    // Header
    const header = document.createElement('div');
    header.style.cssText = `text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #0a8a2f;`;
    header.innerHTML = `
      <h1 style="color: #0a8a2f; margin: 0 0 8px; font-size: 28px;">OAE Smart Quiz Arena</h1>
      <p style="color: #666; margin: 0; font-size: 14px;">Quiz Results - ${new Date().toLocaleDateString('en-GB')}</p>
    `;
    clone.insertBefore(header, clone.firstChild);

    // Footer
    const footer = document.createElement('div');
    footer.style.cssText = `margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #888; font-size: 12px;`;
    footer.innerHTML = 'OAE — Oluwatosin Academy of Excellence | oaeofficial123@gmail.com';
    clone.appendChild(footer);

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `OAE_Quiz_Results_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      pagebreak: { mode: 'css', avoid: 'tr, h3, h4, .option-item' },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1000
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generate PDF natively
    html2pdf().set(opt).from(clone).save().catch(err => {
      console.error(err);
      alert('Error generating PDF.');
    });
  }

  return { downloadResults };
})();