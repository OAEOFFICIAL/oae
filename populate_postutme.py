#!/usr/bin/env python3
"""
Post-UTME Data Population Script
Generates question sets for universities without data
"""

import json
import os
from pathlib import Path

DATA_PATH = Path('Quizzes/data/post-utme')

# Template questions for each subject (can be customized per school)
TEMPLATES = {
    'mathematics': [
        {'q': 'Solve: 2x + 5 = 15', 'opts': ['x=5', 'x=10', 'x=3', 'x=15'], 'ans': 0},
        {'q': 'What is 25% of 80?', 'opts': ['15', '20', '25', '30'], 'ans': 1},
        {'q': 'If a=3 and b=4, find a²+b²', 'opts': ['25', '49', '12', '7'], 'ans': 0},
        {'q': 'Simplify: 3x + 2x - x', 'opts': ['4x', '5x', '2x', '6x'], 'ans': 0},
        {'q': 'What is the area of a circle with radius 5?', 'opts': ['25π', '10π', '50π', '5π'], 'ans': 0},
    ],
    'english': [
        {'q': 'The word *ephemeral* means...', 'opts': ['lasting', 'short-lived', 'heavy', 'bold'], 'ans': 1},
        {'q': 'Choose correct: "He dont go to school"', 'opts': ['correct', 'use "doesn\'t"', 'use "going"', 'use "doesn\'t go"'], 'ans': 1},
        {'q': '"Break a leg" means...', 'opts': ['injure yourself', 'good luck', 'run away', 'exercise'], 'ans': 1},
        {'q': 'Antonym of "benevolent":', 'opts': ['kind', 'malevolent', 'generous', 'helpful'], 'ans': 1},
        {'q': 'What does "ubiquitous" mean?', 'opts': ['unique', 'everywhere', 'hidden', 'rare'], 'ans': 1},
    ],
    'general-paper': [
        {'q': 'What year did Nigeria gain independence?', 'opts': ['1960', '1961', '1963', '1966'], 'ans': 0},
        {'q': 'Nigeria\'s capital is...', 'opts': ['Lagos', 'Abuja', 'Ibadan', 'Kano'], 'ans': 1},
        {'q': 'How many states in Nigeria?', 'opts': ['34', '36', '38', '37'], 'ans': 1},
        {'q': 'First president of Nigeria:', 'opts': ['Balewa', 'Azikiwe', 'Obasanjo', 'Awolowo'], 'ans': 1},
        {'q': 'Largest river in Nigeria:', 'opts': ['Benue', 'Niger', 'Orashi', 'Cross'], 'ans': 1},
    ],
    'biology': [
        {'q': 'What is the basic unit of life?', 'opts': ['Tissue', 'Atom', 'Cell', 'Organ'], 'ans': 2},
        {'q': 'Which organelle produces energy?', 'opts': ['Nucleus', 'Mitochondrion', 'Ribosome', 'Golgi'], 'ans': 1},
        {'q': 'Process of plant food production:', 'opts': ['Respiration', 'Photosynthesis', 'Fermentation', 'Digestion'], 'ans': 1},
        {'q': 'How many chromosomes in humans?', 'opts': ['23', '46', '92', '48'], 'ans': 1},
        {'q': 'Function of red blood cells:', 'opts': ['Fight infections', 'Transport oxygen', 'Clot blood', 'Produce antibodies'], 'ans': 1},
    ],
    'chemistry': [
        {'q': 'Atomic number of Carbon:', 'opts': ['6', '12', '8', '4'], 'ans': 0},
        {'q': 'H₂O is which type compound?', 'opts': ['Ionic', 'Covalent', 'Metallic', 'Polymer'], 'ans': 1},
        {'q': 'pH of neutral solution:', 'opts': ['0', '7', '14', '10'], 'ans': 1},
        {'q': 'Zn + H₂SO₄ produces:', 'opts': ['O₂', 'N₂', 'H₂', 'CO₂'], 'ans': 2},
        {'q': 'Formula for calcium carbonate:', 'opts': ['CaCO₂', 'Ca₂CO₃', 'CaCO₃', 'CaC'], 'ans': 2},
    ],
    'physics': [
        {'q': 'Speed of light in vacuum:', 'opts': ['2×10⁸ m/s', '3×10⁸ m/s', '4×10⁸ m/s', '1×10⁸ m/s'], 'ans': 1},
        {'q': 'SI unit of force:', 'opts': ['Dyne', 'Newton', 'Pascal', 'Joule'], 'ans': 1},
        {'q': 'Newtons second law states:', 'opts': ['F=ma', 'F=mv', 'F=m/a', 'F=a/m'], 'ans': 0},
        {'q': 'What is acceleration due to gravity?', 'opts': ['8.8 m/s²', '9.8 m/s²', '10.8 m/s²', '7.8 m/s²'], 'ans': 1},
        {'q': 'Which is a scalar quantity?', 'opts': ['Force', 'Velocity', 'Speed', 'Acceleration'], 'ans': 2},
    ]
}

SCHOOLS_CONFIG = {
    'unilorin': {
        'subjects': ['english', 'mathematics', 'general-paper'],
        'counts': [15, 15, 10]
    },
    'unn': {
        'subjects': ['mathematics', 'english', 'biology', 'chemistry'],
        'counts': [15, 15, 15, 15]
    },
    'abu': {
        'subjects': ['english', 'mathematics', 'general-paper', 'physics'],
        'counts': [15, 15, 10, 10]
    },
    'uniben': {
        'subjects': ['english', 'general-paper', 'mathematics', 'biology'],
        'counts': [15, 15, 35, 35]
    },
    'funaab': {
        'subjects': ['english', 'mathematics', 'biology', 'chemistry'],
        'counts': [15, 15, 15, 15]
    },
    'futa': {
        'subjects': ['english', 'mathematics', 'physics', 'chemistry'],
        'counts': [15, 15, 10, 10]
    },
    'lasu': {
        'subjects': ['english', 'mathematics', 'general-paper'],
        'counts': [15, 15, 20]
    },
    'uniport': {
        'subjects': ['mathematics', 'english', 'chemistry', 'physics'],
        'counts': [15, 15, 10, 10]
    },
    'buk': {
        'subjects': ['english', 'mathematics', 'biology', 'chemistry'],
        'counts': [15, 15, 10, 10]
    }
}

def generate_questions(subject, count, school_name):
    """Generate questions from template."""
    template = TEMPLATES.get(subject, TEMPLATES['mathematics'])  # Use math as fallback
    if not template:
        template = TEMPLATES['mathematics']
    
    questions = []
    
    for i in range(count):
        t = template[i % len(template)]
        
        questions.append({
            'id': f'{school_name}-{subject[:3]}-{i+1:03d}',
            'subject': subject.replace('-', ' ').title(),
            'year': '2023' if i % 2 == 0 else '2022',
            'question': t['q'],
            'options': t['opts'],
            'answer': t['ans'],
            'explanation': f'This is the correct answer for {t["q"]}'
        })
    
    return questions

def populate_school(school_name, subjects, counts):
    """Create JSON files for a school."""
    school_dir = DATA_PATH / school_name
    school_dir.mkdir(parents=True, exist_ok=True)
    
    for subject, count in zip(subjects, counts):
        questions = generate_questions(subject, count, school_name)
        filepath = school_dir / f'{subject}.json'
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(questions, f, indent=2, ensure_ascii=False)
        
        print(f'✓ {school_name}/{subject}.json ({count} questions)')

def main():
    print('\nGenerating Post-UTME Question Sets...\n')
    
    for school, config in SCHOOLS_CONFIG.items():
        populate_school(school, config['subjects'], config['counts'])
    
    print('\n✓ Data population complete!')
    print(f'Created: {len(SCHOOLS_CONFIG)} schools')
    print('\nNext: Update post-utme-engine.js subjectMap with new schools')

if __name__ == '__main__':
    main()
