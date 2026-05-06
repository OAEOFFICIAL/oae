#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
from pathlib import Path

schools_dir = 'admission/schools'

# Template for all school pages
template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OAE - Oluwatosin Academy of Excellence</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/remixicon.css" >
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/Assets/css/post-jamb-navbar.css">
    <link rel="stylesheet" href="/Assets/css/footer.css">
    <link rel="stylesheet" href="/Assets/css/school-guide.css">
</head>
<body>
    <!-- OAE Navbar - WHITE BACKGROUND (Global Design System) -->
    <nav class="oae-navbar">
        <!-- Logo (acts as HOME) -->
        <div class="oae-logo">
            <a href="../../Index.htm">
               <img class="logo-quiz" src="../../oae.png" alt="OAE">
            </a>
        </div>

        <!-- Search Bar - Visible on ALL devices with proper input field -->
        <div class="oae-search-section">
            <div class="oae-search-container">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search JAMB, schools, courses...">
                <button class="oae-search-btn">Search</button>
            </div>
        </div>

        <!-- Navigation Links (Desktop) - Post-JAMB, Admission, Schools, Updates -->
        <ul class="oae-nav-links">
            <li><a href="#">Post-JAMB</a></li>
            <li><a href="#">Admission</a></li>
            <li><a href="#">Schools</a></li>
            <li><a href="#">Updates</a></li>
        </ul>

        <!-- Join/Dashboard Button (Desktop) -->
        <button class="oae-join-btn" id="oaeJoinBtn">Join OAE</button>
        
        <!-- Hamburger Menu (Mobile) -->
        <button class="oae-hamburger" id="oaeHamburger">
            <i class="fas fa-bars"></i>
        </button>

        <!-- Mobile Menu (contains Post-JAMB, Admission, Schools, Updates) -->
        <div class="oae-mobile-menu" id="oaeMobileMenu">
            <ul class="oae-mobile-links">
                <li><a href="#">Post-JAMB</a></li>
                <li><a href="#">Admission</a></li>
                <li><a href="#">Schools</a></li>
                <li><a href="#">Updates</a></li>
                <li>
                    <button class="oae-join-mobile" id="oaeJoinMobile">
                        <i class="fas fa-user-plus"></i> Join OAE
                    </button>
                </li>
                <li>
                    <button class="oae-demo" id="oaeDemo">
                        <i class="fas fa-user-circle"></i> Demo: User Dashboard
                    </button>
                </li>
            </ul>
        </div>
    </nav>

    <!-- School Content -->
    {{SCHOOL_CONTENT}}

    <!-- FOOTER -->
    <footer class="oae-footer">
      <!-- CONNECT WITH US BAR -->
      <div class="footer-connect">
        <h3>Connect With Us</h3>
        <hr>
        <div class="socials-bar">
          <a href="#"><i class="fab fa-linkedin"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-youtube"></i></a>
          <a href="#"><i class="fab fa-facebook"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-tiktok"></i></a>
          <a href="https://t.me/OAECONNECT"><i class="fab fa-telegram"></i></a>
          <a href="mailto:oaeofficial123@gmail.com"><i class="fas fa-envelope"></i></a>
        </div>
      </div>

      <!-- TOP SECTION: Mission, Vision, Ambition (Summarized) -->
      <div class="footer-top">
        <div class="mission-container">
          <img src="/oaepic2.png" alt="OAE Mission" class="mission-img">
          <div class="mission-text">
            <p class="footer-mission-summary">
              OAE is committed to delivering high-quality digital education from Nigeria to learners across Africa and the world. We provide verified exam preparation resources, tech tutorials, AI-enabled learning tools, and Web3-ready career pathways, helping students succeed academically and develop practical skills for the future.
            </p>
          </div>
        </div>

        <p class="short-about">
          Oluwatosin Academy of Excellence (OAE) is a Nigerian EdTech organisation delivering exam preparation, tech tutorials, and learning tools to students in Nigeria, across Africa, and worldwide.
        </p>

        <!-- Newsletter -->
        <div class="newsletter">
          <input type="email" placeholder="Enter your email for updates">
          <button>Subscribe</button>
        </div>
      </div>

      <!-- GRID SECTION: Clean links without bullets -->
      <div class="footer-grid">
        <div class="footer-col">
          <h3>About OAE</h3>
          <a href="#">Who We Are</a>
          <a href="#">Our Mission</a>
          <a href="#">Our Team</a>
          <a href="#">Our Story</a>
          <a href="#">Careers</a>
        </div>

        <div class="footer-col">
          <h3>Navigation</h3>
          <a href="#">News & Updates</a>
          <a href="#">Past Questions</a>
          <a href="#">Exam Tips</a>
          <a href="#">Tutorials</a>
          <a href="#">Coding Lessons</a>
        </div>

        <div class="footer-col">
          <h3>Exam Categories</h3>
          <a href="#">JAMB Resources</a>
          <a href="#">WAEC Materials</a>
          <a href="#">NECO Guides</a>
          <a href="#">Post-UTME</a>
          <a href="#">Mock Exams</a>
        </div>

        <div class="footer-col">
          <h3>Contact</h3>
          <div class="contact-item"><i class="ri-map-pin-line"></i> Lagos, Nigeria</div>
          <div class="contact-item"><i class="ri-mail-line"></i> oaeofficial123@gmail.com</div>
          <div class="contact-item"><i class="ri-phone-line"></i> +234 705 176 3835</div>
          <div class="contact-item"><i class="ri-whatsapp-line"></i> WhatsApp Available</div>
        </div>
      </div>

      <!-- BOTTOM -->
      <div class="footer-bottom">
        <p>🌍 Trusted by <strong>15,000+ learners</strong> across Nigeria, Africa, and the world.</p>
        <p>© 2025 OAE — Oluwatosin Academy of Excellence. All rights reserved.</p>

        <div class="legal-links">
          <a href="#">Terms of Use</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookie Notice</a>
          <a href="#">Accessibility</a>
        </div>
      </div>
    </footer>
    <script src="/Assets/js/post-jamb-navbar.js"></script>
    <script src="/Assets/js/navbar.js"></script>
</body>
</html>'''

# Get all HTML files in schools directory
html_files = sorted([f for f in os.listdir(schools_dir) if f.endswith('.html')])
print(f'Found {len(html_files)} school HTML files')

# Process each file
successful = 0
failed = 0

for filename in html_files:
    filepath = os.path.join(schools_dir, filename)
    try:
        # Read existing file
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract school content (from school-header to end of school-content section)
        # Pattern: <section class="school-header">...any content...</section> ... <section class="school-content">...any content...</section>
        school_match = re.search(r'(<section class="school-header">.*?<section class="school-content">.*?</section>)', content, re.DOTALL)
        
        if school_match:
            school_content = school_match.group(1)
            
            # Replace template placeholder with actual school content
            new_content = template.replace('{{SCHOOL_CONTENT}}', school_content)
            
            # Write updated file
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            successful += 1
            print(f'✓ Updated: {filename}')
        else:
            print(f'✗ Skipped {filename}: Could not extract school content')
            failed += 1
            
    except Exception as e:
        print(f'✗ Error processing {filename}: {e}')
        failed += 1

print(f'\n✅ Summary: {successful} files updated, {failed} failed')
