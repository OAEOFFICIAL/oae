# OAE Website: AI Coding Agent Instructions

## Project Overview
OAE (Oluwatosin Academy of Excellence) is an educational platform for Nigerian exam preparation (JAMB, WAEC, NECO, GCE) and tech career training. It's a vanilla HTML/CSS/JavaScript website with no build system or package manager.

## Architecture

### Core Components
- **Quiz Engine** ([Assets/js/quiz-engine.js](Assets/js/quiz-engine.js)): Central question-serving system supporting both **study mode** (flexible, instant feedback) and **exam mode** (strict, timed, no review). Handles per-subject question selection, answer tracking, and server integration.
- **Data Layer** ([Quizzes/data/](Quizzes/data/)): JSON-based question databases per subject (e.g., `english.json`, `biology.json`). English is special: pulls from `grammar.json`, `comprehension.json`, and optional `novel/jambNovel/*.json` for prescribed literature extracts.
- **Navigation** ([Assets/js/navbar.js](Assets/js/navbar.js)): Responsive navbar with mobile hamburger menu and keyboard-accessible dropdowns.
- **Template System** ([Assets/NAVBAR-FOOTER-TEMPLATE.htm](Assets/NAVBAR-FOOTER-TEMPLATE.htm), [Assets/quiz-navbar-template.htm](Assets/quiz-navbar-template.htm)): Reusable header/footer components; manually synced across pages.

### Key Files by Purpose
| Purpose | Files |
|---------|-------|
| **Quiz Selection & Execution** | [Quizzes/index.htm](Quizzes/index.htm), [Quizzes/quiz.htm](Quizzes/quiz.htm), [Assets/js/quiz-engine.js](Assets/js/quiz-engine.js), [Assets/js/quiz.js](Assets/js/quiz.js) |
| **Home & Main Pages** | [Index.htm](Index.htm), [About.htm](About.htm), [contact.htm](contact.htm) |
| **Exam-Specific Pages** | [Exams/JAMB/index.htm](Exams/JAMB/index.htm), [Exams/WAEC/](Exams/WAEC/), [Exams/NECO/](Exams/NECO/) |
| **Styling (CSS Variables)** | [Assets/css/colors.css](Assets/css/colors.css) (defines `--green`, `--darkgreen`, `--muted`, etc.), [Assets/css/quiz.css](Assets/css/quiz.css), [Assets/css/navbar-footer.css](Assets/css/navbar-footer.css) |

## Data Flow Patterns

### Quiz Initialization Flow
1. User selects exam, subjects, topics on [Quizzes/index.htm](Quizzes/index.htm)
2. Selection object passed to `Quiz.buildFromSelection(selection)` in [Assets/js/quiz-engine.js](Assets/js/quiz-engine.js#L65)
3. Quiz engine loads subject JSON files from [Quizzes/data/](Quizzes/data/) using `loadJSON()` helper
4. English subject special case: also loads `grammar.json` + `comprehension.json` + optional novel extracts
5. Questions filtered by selected topics via `topicsForSubject` array
6. Random subset selected (English: 60 questions, other subjects: 40 questions)

### Question Structure
Each question object:
```javascript
{
  id: "unique_identifier",
  question: "Question text",
  options: ["A) ...", "B) ...", "C) ...", "D) ..."],
  correct: 0,  // option index
  explanation: "Why this answer is correct...",
  topic: "Photosynthesis",  // for filtering
  difficulty: "medium"
}
```

### Exam vs Study Mode Differences
- **Study Mode**: User can review answers, see explanations immediately, unlimited time
- **Exam Mode**: Strict timer, no explanations during exam, server validates session JWT, answers submitted all at once

## Development Conventions

### File Organization
- **Do NOT split HTML files**: Entire page (navbar + content + footer) in single `.htm` file
- **CSS imports**: Always use relative paths; link to navbar/footer and subject-specific CSS
- **JS module pattern**: Use closures & IIFE for scoping; no `export`/`import`
- **No build step**: All CSS/JS concatenated manually or via `<link>`/`<script>` tags

### CSS Custom Properties (Variables)
Defined in [Assets/css/colors.css](Assets/css/colors.css):
```css
--green: #0a8a2f;           /* Primary brand */
--darkgreen: #066426;       /* Hover states */
--card: #f8fdf9;            /* Card backgrounds */
--card-border: #e6e6e6;     /* Borders */
--oae-dark: #333;           /* Text */
--shadow: 0 8px 24px rgba(8,22,16,0.04);
```
**Always use CSS variables** for colors—never hardcode hex values.

### Naming Conventions
- **Class names**: kebab-case (`.quiz-container`, `.quiz-navbar`)
- **IDs**: descriptive, single use per page (`#mobileMenu`, `#oae-modal`)
- **Data attributes**: `data-subject`, `data-exam`, `data-action` for routing and click handling
- **JS function names**: camelCase; Quiz engine functions prefix with `Quiz.` object

### Question Data Sources
- **Base questions**: [Quizzes/data/{subject}.json](Quizzes/data/)
- **English grammar (1978)**: [Quizzes/data/grammar.json](Quizzes/data/grammar.json)
- **English grammar (1979)**: [Quizzes/data/1979-grammar.json](Quizzes/data/1979-grammar.json)
- **English comprehension**: [Quizzes/data/comprehension.json](Quizzes/data/comprehension.json)
- **Literature extracts**: [novel/jambNovel/{novelName}.json](novel/jambNovel/)

## Common Tasks

### Adding a New Quiz Question
1. Open subject JSON in [Quizzes/data/](Quizzes/data/) (e.g., `biology.json`)
2. Add object to `questions` array with `id`, `question`, `options` (array of 4), `correct` (index 0-3), `explanation`, `topic`
3. Verify JSON syntax—test with `JSON.parse()` in browser console
4. Reload quiz to test

### Updating Navigation
1. Edit both desktop version in navbar template ([Assets/NAVBAR-FOOTER-TEMPLATE.htm](Assets/NAVBAR-FOOTER-TEMPLATE.htm))
2. Edit mobile version similarly  
3. Test hamburger menu and dropdown toggles
4. Manually sync navigation across all pages ([Index.htm](Index.htm), [Quizzes/index.htm](Quizzes/index.htm), etc.)

### Fixing Modal Dialogs
- Modal helper functions in [Assets/js/quiz-engine.js](Assets/js/quiz-engine.js#L15): `createModal()`, `removeModal()`, `showConfirm()`
- Modal styling in [Assets/css/quiz.css](Assets/css/quiz.css)
- Z-index: 99999 for modals, 9999 for dropdowns/overlays

### Subject-Specific Quiz Pages
Each exam type has dedicated quiz JS file. Example: [Assets/js/jamb-quiz-subject-biology.js](Assets/js/jamb-quiz-subject-biology.js) handles JAMB Biology quiz UI logic specific to that subject.

## Critical Decisions & Why

1. **No Framework/Build**: Server-side rendering simplicity; direct browser caching of static assets
2. **Strict Question Caps** (English 60, others 40): Designed to match JAMB/WAEC/NECO exam time constraints
3. **Per-Subject CSS Files**: Allows independent styling tweaks; quiz-specific files for each subject exam format
4. **Separate Grammar/Comprehension JSONs**: English has ~130+ questions; splitting improves maintainability and lazy-loading
5. **Template Files Not Auto-Injected**: Manual sync required; ensures explicit control over page structure and SEO

## Testing & Debugging
- **Quiz engine**: Open browser DevTools → Console. Check `Quiz` object state: `Quiz.currentSubject`, `Quiz.answers`, `Quiz.secondsLeft`
- **Modal appearance**: Search `createModal` calls; check z-index and overlay opacity in CSS
- **Data load failures**: Check Network tab; verify JSON file paths use `/Quizzes/data/{subject}.json`
- **Navbar sync issues**: Manually verify all pages use identical navbar HTML structure
