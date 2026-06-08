import sys
import re

file_path = r'c:\Users\USER\Documents\OAE\Quizzes\post-utme.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '<style>'
end_marker = '</style>'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker) + len(end_marker)

if start_idx == -1 or end_idx == -1:
    print('Style tags not found')
    sys.exit(1)

old_style_content = content[start_idx:end_idx]

# Extract from FEATURES to the end
features_idx = old_style_content.find('/* ── FEATURES SECTION ── */')
features_css = ''
if features_idx != -1:
    features_css = old_style_content[features_idx:-8] # exclude </style>

new_style = '''<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
        --primary: #0a8a2f;
        --primary-dark: #05501a;
        --primary-light: #dcfce7;
        --accent: #22c55e;
        --surface: #ffffff;
        --background: #f4f7fb;
        --text-main: #0f172a;
        --text-muted: #64748b;
        --border: #e2e8f0;
        --card-shadow: 0 12px 40px -12px rgba(0,0,0,0.06), 0 4px 12px -4px rgba(0,0,0,0.04);
        --glass-bg: rgba(255, 255, 255, 0.7);
        --glass-border: rgba(255, 255, 255, 0.5);
    }

    body.dark-mode {
        --surface: #111827;
        --background: #030712;
        --text-main: #f8fafc;
        --text-muted: #94a3b8;
        --border: #1f2937;
        --card-shadow: 0 12px 40px -12px rgba(0,0,0,0.4);
        --glass-bg: rgba(17, 24, 39, 0.7);
        --glass-border: rgba(255, 255, 255, 0.05);
        --primary-light: rgba(10, 138, 47, 0.15);
    }

    body {
        background: var(--background);
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        color: var(--text-main);
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
    }

    /* ── ANIMATED BACKGROUND ── */
    body::before {
        content: '';
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: radial-gradient(circle at 15% 50%, rgba(10, 138, 47, 0.04), transparent 25%),
                    radial-gradient(circle at 85% 30%, rgba(34, 197, 94, 0.04), transparent 25%);
        z-index: -1;
        pointer-events: none;
    }

    body.dark-mode::before {
        background: radial-gradient(circle at 15% 50%, rgba(10, 138, 47, 0.08), transparent 30%),
                    radial-gradient(circle at 85% 30%, rgba(34, 197, 94, 0.05), transparent 30%);
    }

    @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }

    /* ── HERO ── */
    .prep-hero {
        background: linear-gradient(-45deg, #022c0f, #0a8a2f, #044d1a, #0a8a2f);
        background-size: 400% 400%;
        animation: gradientBG 12s ease infinite;
        padding: clamp(60px, 10vw, 100px) 20px clamp(70px, 12vw, 110px);
        text-align: center;
        color: #fff;
        position: relative;
        overflow: hidden;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .prep-hero::before, .prep-hero::after {
        content: ''; position: absolute; border-radius: 50%; pointer-events: none;
        filter: blur(40px);
    }
    .prep-hero::before { width: 500px; height: 500px; top: -200px; right: -150px; background: rgba(255,255,255,0.06); animation: float 6s ease-in-out infinite; }
    .prep-hero::after { width: 400px; height: 400px; bottom: -150px; left: -100px; background: rgba(10,138,47,0.4); animation: float 8s ease-in-out infinite reverse; }

    .prep-hero-badge {
        display: inline-flex; align-items: center; gap: 8px;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        padding: 8px 20px; border-radius: 999px;
        font-size: 0.85rem; font-weight: 700; letter-spacing: 0.8px; color: #b9fbc0;
        margin-bottom: 24px; position: relative; z-index: 1;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        text-transform: uppercase;
    }

    .prep-hero h1 {
        font-size: clamp(2.4rem, 6vw, 4.2rem); font-weight: 900; line-height: 1.1;
        letter-spacing: -1.5px; margin-bottom: 20px; position: relative; z-index: 1;
        text-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }
    .prep-hero h1 span {
        background: linear-gradient(to right, #6bffb8, #fff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .prep-hero > p {
        font-size: clamp(1rem, 2.5vw, 1.25rem); max-width: 640px; margin: 0 auto 40px;
        color: rgba(255,255,255,0.9); line-height: 1.7; position: relative; z-index: 1;
        font-weight: 500;
    }

    .prep-hero-stats {
        display: flex; justify-content: center; flex-wrap: wrap;
        position: relative; z-index: 1;
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 20px;
        padding: 24px 32px; max-width: 580px; margin: 0 auto;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2);
    }

    .prep-hero-stat { flex: 1; min-width: 120px; text-align: center; padding: 0 16px; position: relative; }
    .prep-hero-stat + .prep-hero-stat::before {
        content: ''; position: absolute; left: 0; top: 10%; height: 80%; width: 1px;
        background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
    }
    
    .prep-hero-stat strong { display: block; font-size: 2.2rem; font-weight: 900; line-height: 1; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
    .prep-hero-stat span { font-size: 0.75rem; color: rgba(255,255,255,0.8); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 6px; display: block; }

    /* ── MAIN GRID ── */
    .prep-container {
        max-width: 1200px; margin: clamp(-40px, -5vw, -60px) auto 60px; padding: 0 20px;
        display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px, 3vw, 32px);
        position: relative; z-index: 10;
    }

    /* ── PREMIUM CARDS ── */
    .prep-card {
        background: var(--surface);
        border-radius: 24px; padding: clamp(24px, 4vw, 40px);
        box-shadow: var(--card-shadow);
        border: 1px solid var(--border);
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
        position: relative; overflow: hidden;
    }
    .prep-card::after {
        content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px;
        background: linear-gradient(90deg, var(--primary), #6bffb8);
        opacity: 0; transition: opacity 0.3s ease;
    }
    .prep-card:hover { transform: translateY(-4px); box-shadow: 0 24px 60px -15px rgba(10,138,47,0.15); }
    .prep-card:hover::after { opacity: 1; }

    .prep-card h2 {
        font-size: 1.3rem; font-weight: 800; color: var(--text-main);
        display: flex; align-items: center; gap: 14px;
        margin-bottom: 32px; padding-bottom: 20px;
        border-bottom: 2px solid var(--border);
    }
    .prep-card h2 i {
        font-size: 1.2rem; color: var(--primary);
        background: var(--primary-light);
        width: 42px; height: 42px; border-radius: 12px;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 12px rgba(10,138,47,0.1);
    }

    /* ── FORM ELEMENTS ── */
    .form-group { margin-bottom: 24px; }
    .form-group label {
        display: block; font-weight: 700; color: var(--text-muted);
        margin-bottom: 10px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.8px;
    }

    .form-select {
        width: 100%; padding: 16px 20px;
        border: 2px solid var(--border);
        border-radius: 14px; font-size: 1.05rem; color: var(--text-main);
        background: var(--background); outline: none; font-weight: 600;
        transition: all 0.25s ease;
        appearance: none; cursor: pointer;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='10' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230a8a2f' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat; background-position: right 18px center; padding-right: 45px;
    }
    .form-select:hover { border-color: rgba(10,138,47,0.4); }
    .form-select:focus { border-color: var(--primary); background: var(--surface); box-shadow: 0 0 0 5px var(--primary-light); }
    .form-select:disabled { opacity: 0.5; cursor: not-allowed; background: var(--border); }

    /* ── MODE SELECTOR ── */
    .mode-selector { display: none; margin-top: 10px; animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .mode-selector.active { display: block; }
    .mode-cards-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    
    .mode-option {
        border: 2px solid var(--border); border-radius: 16px; padding: 24px 20px;
        cursor: pointer; text-align: center; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: var(--surface); position: relative; overflow: hidden;
    }
    .mode-option::before {
        content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
        background: radial-gradient(circle at center, var(--primary-light) 0%, transparent 70%);
        opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
    }
    .mode-option:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: 0 12px 30px rgba(10,138,47,0.1); }
    .mode-option:hover::before { opacity: 0.5; }
    
    .mode-option.selected {
        border-color: var(--primary); background: var(--primary-light);
        box-shadow: 0 8px 24px rgba(10,138,47,0.15);
    }
    .mode-option.selected::after {
        content: '\\f058'; font-family: 'Font Awesome 6 Free'; font-weight: 900;
        position: absolute; top: 14px; right: 14px; color: var(--primary); font-size: 1.2rem;
        animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes scaleIn { 0% { transform: scale(0); } 100% { transform: scale(1); } }
    
    .mode-option i { font-size: 2.2rem; color: var(--primary); display: block; margin-bottom: 14px; transition: transform 0.3s ease; }
    .mode-option:hover i { transform: scale(1.1); }
    .mode-option h4 { font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin: 0 0 8px; }
    .mode-option p { font-size: 0.85rem; color: var(--text-muted); margin: 0; line-height: 1.5; font-weight: 500; }

    /* ── SUBJECT PICKER ── */
    .subject-picker { display: none; margin-top: 10px; }
    .subject-picker.active { display: block; animation: fadeUp 0.4s ease; }
    .subject-chips { display: flex; flex-wrap: wrap; gap: 10px; }
    .subject-chip {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 12px 20px; border: 2px solid var(--border); border-radius: 12px;
        cursor: pointer; font-size: 0.95rem; font-weight: 700; color: var(--text-main);
        background: var(--surface); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); user-select: none;
    }
    .subject-chip:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); transform: translateY(-2px); }
    .subject-chip.selected {
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        color: #fff; border-color: transparent; box-shadow: 0 6px 16px rgba(10,138,47,0.3);
    }
    .subject-chip i { font-size: 0.9rem; }

    /* ── START BUTTON ── */
    .start-btn {
        width: 100%; padding: 18px 24px; margin-top: 32px;
        background: linear-gradient(135deg, var(--accent), var(--primary-dark));
        color: #fff; border: none; border-radius: 16px;
        font-size: 1.1rem; font-weight: 800; cursor: pointer;
        display: flex; align-items: center; justify-content: center; gap: 12px;
        box-shadow: 0 8px 24px rgba(10,138,47,0.3);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        letter-spacing: 0.5px; position: relative; overflow: hidden;
    }
    .start-btn::before {
        content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s ease;
    }
    .start-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(10,138,47,0.4); }
    .start-btn:hover:not(:disabled)::before { left: 100%; }
    .start-btn:active:not(:disabled) { transform: translateY(0); }
    .start-btn:disabled { background: var(--border); color: var(--text-muted); cursor: not-allowed; box-shadow: none; }

    /* ── CONFIG BOX (Screening Intelligence) ── */
    .config-box { display: none; animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .config-box.active, .config-box[style*="block"] { display: block; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .config-header { display: flex; align-items: center; gap: 24px; margin-bottom: 28px; padding-bottom: 24px; border-bottom: 2px solid var(--border); }

    .config-logo {
        width: 120px; height: 120px; min-width: 120px;
        border-radius: 20px;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        font-size: 2.5rem; font-weight: 900; color: #fff;
        box-shadow: 0 12px 32px rgba(10,138,47,0.3);
        position: relative; overflow: hidden;
    }
    .config-logo::after { content:''; position:absolute; top:0; left:0; right:0; bottom:0; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2); border-radius: 20px; }
    .config-logo img { width: 100%; height: 100%; object-fit: contain; border: none; background: transparent; padding: 10px; }

    .config-title h3 { font-size: 1.4rem; font-weight: 900; color: var(--text-main); margin-bottom: 8px; line-height: 1.2; letter-spacing: -0.5px; }
    .config-title p {
        font-size: 0.95rem; color: var(--primary); font-weight: 800; margin: 0;
        background: var(--primary-light); display: inline-flex; align-items: center; gap: 6px;
        padding: 6px 14px; border-radius: 999px; border: 1px solid rgba(10,138,47,0.1);
    }

    .config-details { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 8px; }

    .detail-item {
        background: var(--background); padding: 18px; border-radius: 16px;
        border: 1px solid var(--border); transition: all 0.2s ease;
        display: flex; flex-direction: column; justify-content: center;
    }
    .detail-item:hover { background: var(--primary-light); border-color: rgba(10,138,47,0.2); transform: translateY(-2px); }

    .detail-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 800; display: block; margin-bottom: 8px; }
    .detail-value { font-size: 1.05rem; color: var(--text-main); font-weight: 800; line-height: 1.4; }

    .config-warning {
        display: flex; align-items: flex-start; gap: 16px;
        background: linear-gradient(135deg, var(--primary-light), rgba(10,138,47,0.02));
        border: 1px solid rgba(10,138,47,0.2); border-radius: 16px;
        padding: 20px; margin-top: 24px; color: var(--primary-dark); font-size: 0.95rem; line-height: 1.6; font-weight: 600;
        box-shadow: 0 4px 12px rgba(10,138,47,0.05);
    }
    body.dark-mode .config-warning { background: rgba(10,138,47,0.1); color: #86efac; border-color: rgba(10,138,47,0.3); }
    .config-warning i { color: var(--primary); font-size: 1.4rem; margin-top: 2px; flex-shrink: 0; }

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--background); }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid var(--background); }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    body.dark-mode ::-webkit-scrollbar-thumb { background: #334155; }

    /* ── RESPONSIVE (MOBILE FIRST APPROACH) ── */
    @media(max-width: 900px) {
        .prep-container { grid-template-columns: 1fr; gap: 24px; margin-top: -30px; }
    }
    
    @media(max-width: 600px) {
        .prep-hero { padding: 60px 16px 80px; }
        .prep-hero-stats { padding: 16px; border-radius: 16px; }
        .prep-hero-stat strong { font-size: 1.6rem; }
        .prep-hero-stat span { font-size: 0.65rem; }
        
        .prep-card { padding: 24px; border-radius: 20px; }
        .config-header { flex-direction: column; text-align: center; gap: 16px; padding-bottom: 16px; }
        .config-logo { width: 90px; height: 90px; min-width: 90px; border-radius: 16px; font-size: 1.8rem; }
        .config-title h3 { font-size: 1.25rem; }
        .mode-cards-row { grid-template-columns: 1fr; }
    }
    
    @media(max-width: 380px) {
        .config-details { grid-template-columns: 1fr; }
        .detail-item { padding: 14px; }
        .subject-chip { padding: 10px 14px; font-size: 0.85rem; }
        .start-btn { padding: 16px; font-size: 1rem; }
        .form-select { padding: 14px 16px; font-size: 0.95rem; }
    }
    
''' + features_css + '''
</style>'''

new_content = content[:start_idx] + new_style + content[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Successfully updated UI styles')
