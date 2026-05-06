import os
import json

schools_data = {
    # Federal Universities (28 remaining)
    "oau": {"name": "Obafemi Awolowo University", "location": "Ile-Ife, Osun", "type": "Federal University", "competition": "Very High", "cutoff": "200+"},
    "uniben": {"name": "University of Benin", "location": "Benin, Edo", "type": "Federal University", "competition": "High", "cutoff": "190+"},
    "unn": {"name": "University of Nigeria, Nsukka", "location": "Nsukka, Enugu", "type": "Federal University", "competition": "High", "cutoff": "190+"},
    "abu": {"name": "Ahmadu Bello University", "location": "Zaria, Kaduna", "type": "Federal University", "competition": "High", "cutoff": "190+"},
    "unilorin": {"name": "University of Ilorin", "location": "Ilorin, Kwara", "type": "Federal University", "competition": "High", "cutoff": "185+"},
    "lasu": {"name": "Lagos State University", "location": "Lagos", "type": "State University", "competition": "High", "cutoff": "160+"},
    "futa": {"name": "Federal University of Technology, Akure", "location": "Akure, Ondo", "type": "Federal University", "competition": "High", "cutoff": "190+"},
    "futminna": {"name": "Federal University of Technology, Minna", "location": "Minna, Niger", "type": "Federal University", "competition": "Medium-High", "cutoff": "180+"},
    "uniport": {"name": "University of Port Harcourt", "location": "Port Harcourt, Rivers", "type": "Federal University", "competition": "High", "cutoff": "185+"},
    "fuoye": {"name": "Federal University of Oye-Ekiti", "location": "Oye-Ekiti, Ekiti", "type": "Federal University", "competition": "Medium", "cutoff": "170+"},
    "fulafia": {"name": "Federal University, Lafia", "location": "Lafia, Nasarawa", "type": "Federal University", "competition": "Medium", "cutoff": "170+"},
    "fulokoja": {"name": "Federal University, Lokoja", "location": "Lokoja, Kogi", "type": "Federal University", "competition": "Medium", "cutoff": "170+"},
    "fuotuoke": {"name": "Federal University, Otuoke", "location": "Otuoke, Bayelsa", "type": "Federal University", "competition": "Medium", "cutoff": "165+"},
    "fukashere": {"name": "Federal University, Kashere", "location": "Kashere, Gombe", "type": "Federal University", "competition": "Medium", "cutoff": "165+"},
    "uniuyo": {"name": "University of Uyo", "location": "Uyo, Akwa Ibom", "type": "Federal University", "competition": "High", "cutoff": "185+"},
    "unijos": {"name": "University of Jos", "location": "Jos, Plateau", "type": "Federal University", "competition": "Medium-High", "cutoff": "175+"},
    "unimaid": {"name": "University of Maiduguri", "location": "Maiduguri, Borno", "type": "Federal University", "competition": "Medium", "cutoff": "160+"},
    "buk": {"name": "Bayero University Kano", "location": "Kano", "type": "Federal University", "competition": "Medium-High", "cutoff": "180+"},
    "unizik": {"name": "Nnamdi Azikiwe University", "location": "Awka, Anambra", "type": "Federal University", "competition": "High", "cutoff": "185+"},
    "fubk": {"name": "Federal University, Birnin Kebbi", "location": "Birnin Kebbi, Kebbi", "type": "Federal University", "competition": "Low-Medium", "cutoff": "160+"},
    "fuwukari": {"name": "Federal University, Wukari", "location": "Wukari, Taraba", "type": "Federal University", "competition": "Low-Medium", "cutoff": "155+"},
    "fugus": {"name": "Federal University, Gusau", "location": "Gusau, Zamfara", "type": "Federal University", "competition": "Low-Medium", "cutoff": "155+"},
    "fud": {"name": "Federal University, Dutse", "location": "Dutse, Jigawa", "type": "Federal University", "competition": "Low-Medium", "cutoff": "155+"},
    "fudma": {"name": "Federal University, Dutsin-Ma", "location": "Dutsin-Ma, Katsina", "type": "Federal University", "competition": "Low-Medium", "cutoff": "155+"},
    "fugashua": {"name": "Federal University, Gashua", "location": "Gashua, Yobe", "type": "Federal University", "competition": "Low-Medium", "cutoff": "155+"},
    "funai": {"name": "Federal University Ndifu-Alike", "location": "Ndifu-Alike, Ebonyi", "type": "Federal University", "competition": "Medium", "cutoff": "165+"},
    "mouau": {"name": "Michael Okpara Agric University", "location": "Umudike, Abia", "type": "Federal University", "competition": "Medium-High", "cutoff": "180+"},
    "futo": {"name": "Federal University of Technology, Owerri", "location": "Owerri, Imo", "type": "Federal University", "competition": "High", "cutoff": "190+"},
    
    # State Universities (30)
    "ogustate": {"name": "Ogun State University", "location": "Abeokuta, Ogun", "type": "State University", "competition": "Medium", "cutoff": "160+"},
    "uniosun": {"name": "Osun State University", "location": "Osogbo, Osun", "type": "State University", "competition": "Medium", "cutoff": "155+"},
    "eksu": {"name": "Ekiti State University", "location": "Ado-Ekiti, Ekiti", "type": "State University", "competition": "Medium", "cutoff": "155+"},
    "onsu": {"name": "Ondo State University", "location": "Akungba, Ondo", "type": "State University", "competition": "Low-Medium", "cutoff": "150+"},
    "crutech": {"name": "Cross River University", "location": "Calabar, Cross River", "type": "State University", "competition": "Medium", "cutoff": "160+"},
    "esut": {"name": "Enugu State University", "location": "Enugu", "type": "State University", "competition": "Medium", "cutoff": "160+"},
    "ebsu": {"name": "Ebonyi State University", "location": "Abakaliki, Ebonyi", "type": "State University", "competition": "Low-Medium", "cutoff": "150+"},
    "ansu": {"name": "Anambra State University", "location": "Awka, Anambra", "type": "State University", "competition": "Medium", "cutoff": "155+"},
    "delsu": {"name": "Delta State University", "location": "Abraka, Delta", "type": "State University", "competition": "Medium", "cutoff": "160+"},
    "rivsu": {"name": "Rivers State University", "location": "Port Harcourt, Rivers", "type": "State University", "competition": "Medium", "cutoff": "160+"},
    "aksu": {"name": "Akwa Ibom State University", "location": "Uyo, Akwa Ibom", "type": "State University", "competition": "Medium", "cutoff": "155+"},
    "baysu": {"name": "Bayelsa State University", "location": "Yenagoa, Bayelsa", "type": "State University", "competition": "Low-Medium", "cutoff": "145+"},
    "edsu": {"name": "Edo State University", "location": "Benin, Edo", "type": "State University", "competition": "Medium", "cutoff": "155+"},
    "plasu": {"name": "Plateau State University", "location": "Jos, Plateau", "type": "State University", "competition": "Medium", "cutoff": "155+"},
    "nassarau": {"name": "Nasarawa State University", "location": "Keffi, Nasarawa", "type": "State University", "competition": "Low-Medium", "cutoff": "150+"},
    "benue": {"name": "Benue State University", "location": "Makurdi, Benue", "type": "State University", "competition": "Medium", "cutoff": "155+"},
    "tarsu": {"name": "Taraba State University", "location": "Jalingo, Taraba", "type": "State University", "competition": "Low-Medium", "cutoff": "150+"},
    "adsu": {"name": "Adamawa State University", "location": "Mubi, Adamawa", "type": "State University", "competition": "Low-Medium", "cutoff": "150+"},
    "yobsu": {"name": "Yobe State University", "location": "Damaturu, Yobe", "type": "State University", "competition": "Low-Medium", "cutoff": "145+"},
    "ksu": {"name": "Kano State University", "location": "Kano", "type": "State University", "competition": "Medium", "cutoff": "155+"},
    "soksu": {"name": "Sokoto State University", "location": "Sokoto", "type": "State University", "competition": "Low-Medium", "cutoff": "145+"},
    "ngersu": {"name": "Niger State University", "location": "Minna, Niger", "type": "State University", "competition": "Low-Medium", "cutoff": "150+"},
    "gomsu": {"name": "Gombe State University", "location": "Gombe", "type": "State University", "competition": "Low-Medium", "cutoff": "145+"},
    "kwasu": {"name": "Kwara State University", "location": "Ilorin, Kwara", "type": "State University", "competition": "Medium", "cutoff": "155+"},
    "kansu": {"name": "Katsina State University", "location": "Katsina", "type": "State University", "competition": "Low-Medium", "cutoff": "145+"},
    "jigsu": {"name": "Jigawa State University", "location": "Dutse, Jigawa", "type": "State University", "competition": "Low", "cutoff": "140+"},
    "katsu": {"name": "Katsina State University", "location": "Katsina", "type": "State University", "competition": "Low-Medium", "cutoff": "145+"},
    "zamsu": {"name": "Zamfara State University", "location": "Gusau, Zamfara", "type": "State University", "competition": "Low", "cutoff": "140+"},
    "imsu": {"name": "Imo State University", "location": "Owerri, Imo", "type": "State University", "competition": "Medium", "cutoff": "160+"},
    "kassu": {"name": "Kaduna State University", "location": "Kaduna", "type": "State University", "competition": "Medium", "cutoff": "155+"},
    
    # Polytechnics (30)
    "yabatech": {"name": "Yaba College of Technology", "location": "Lagos", "type": "Polytechnic", "competition": "High", "cutoff": "120+"},
    "fedpolyilaro": {"name": "Federal Polytechnic, Ilaro", "location": "Ilaro, Ogun", "type": "Polytechnic", "competition": "Medium", "cutoff": "100+"},
    "fedpolyede": {"name": "Federal Polytechnic, Ede", "location": "Ede, Osun", "type": "Polytechnic", "competition": "Medium", "cutoff": "100+"},
    "kadpoly": {"name": "Kaduna Polytechnic", "location": "Kaduna", "type": "Polytechnic", "competition": "Medium-High", "cutoff": "110+"},
    "auchipoly": {"name": "Auchi Polytechnic", "location": "Auchi, Edo", "type": "Polytechnic", "competition": "Medium", "cutoff": "100+"},
    "edopoly": {"name": "Edo State Polytechnic", "location": "Benin, Edo", "type": "Polytechnic", "competition": "Low-Medium", "cutoff": "90+"},
    "delpoly": {"name": "Delta State Polytechnic", "location": "Ozoro, Delta", "type": "Polytechnic", "competition": "Low-Medium", "cutoff": "90+"},
    "osunpoly": {"name": "Osun State Polytechnic", "location": "Iree, Osun", "type": "Polytechnic", "competition": "Low-Medium", "cutoff": "90+"},
    "ogunpoly": {"name": "Ogun State Polytechnic", "location": "Abeokuta, Ogun", "type": "Polytechnic", "competition": "Low-Medium", "cutoff": "95+"},
    "lasupoly": {"name": "Lagos State Polytechnic", "location": "Ikorodu, Lagos", "type": "Polytechnic", "competition": "Medium", "cutoff": "105+"},
    "imopoly": {"name": "Imo State Polytechnic", "location": "Owerri, Imo", "type": "Polytechnic", "competition": "Low-Medium", "cutoff": "90+"},
    "enugupoly": {"name": "Enugu State Polytechnic", "location": "Enugu", "type": "Polytechnic", "competition": "Low-Medium", "cutoff": "90+"},
    "akpoly": {"name": "Akwa Ibom Polytechnic", "location": "Uyo, Akwa Ibom", "type": "Polytechnic", "competition": "Low-Medium", "cutoff": "85+"},
    "rivpoly": {"name": "Rivers State Polytechnic", "location": "Port Harcourt, Rivers", "type": "Polytechnic", "competition": "Low-Medium", "cutoff": "95+"},
    "unipoly": {"name": "University of Port Harcourt Polytechnic", "location": "Port Harcourt, Rivers", "type": "Polytechnic", "competition": "Low-Medium", "cutoff": "90+"},
    "kanopoly": {"name": "Kano Polytechnic", "location": "Kano", "type": "Polytechnic", "competition": "Low-Medium", "cutoff": "90+"},
    "kadunapoly": {"name": "Kaduna Polytechnic", "location": "Kaduna", "type": "Polytechnic", "competition": "Medium", "cutoff": "105+"},
    "abupoly": {"name": "Abubakar Tatari Ali Polytechnic", "location": "Bauchi, Bauchi", "type": "Polytechnic", "competition": "Low", "cutoff": "80+"},
    "sokpoly": {"name": "Sokoto Polytechnic", "location": "Sokoto", "type": "Polytechnic", "competition": "Low", "cutoff": "80+"},
    "nigerpoly": {"name": "Niger State Polytechnic", "location": "Minna, Niger", "type": "Polytechnic", "competition": "Low", "cutoff": "85+"},
    "gomepoly": {"name": "Gombe State Polytechnic", "location": "Gombe", "type": "Polytechnic", "competition": "Low", "cutoff": "80+"},
    "adamapoly": {"name": "Adamawa Polytechnic", "location": "Yola, Adamawa", "type": "Polytechnic", "competition": "Low", "cutoff": "80+"},
    "yobepoly": {"name": "Yobe State Polytechnic", "location": "Damaturu, Yobe", "type": "Polytechnic", "competition": "Low", "cutoff": "75+"},
    "bauchipoly": {"name": "Bauchi State Polytechnic", "location": "Bauchi", "type": "Polytechnic", "competition": "Low", "cutoff": "80+"},
    "plaspoly": {"name": "Plateau State Polytechnic", "location": "Jos, Plateau", "type": "Polytechnic", "competition": "Low-Medium", "cutoff": "90+"},
    "tarpoly": {"name": "Taraba State Polytechnic", "location": "Jalingo, Taraba", "type": "Polytechnic", "competition": "Low", "cutoff": "80+"},
    "benupoly": {"name": "Benue State Polytechnic", "location": "Makurdi, Benue", "type": "Polytechnic", "competition": "Low", "cutoff": "85+"},
    "kwarapoly": {"name": "Kwara State Polytechnic", "location": "Ilorin, Kwara", "type": "Polytechnic", "competition": "Low-Medium", "cutoff": "90+"},
    "ekpoly": {"name": "Ekiti State Polytechnic", "location": "Ado-Ekiti, Ekiti", "type": "Polytechnic", "competition": "Low-Medium", "cutoff": "90+"},
    "fedpolybauchi": {"name": "Federal Polytechnic, Bauchi", "location": "Bauchi", "type": "Polytechnic", "competition": "Low-Medium", "cutoff": "95+"},
}

html_template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} - OAE</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/remixicon.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/Assets/css/post-jamb-navbar.css">
    <link rel="stylesheet" href="/Assets/css/footer.css">
    <link rel="stylesheet" href="/Assets/css/school-guide.css">
</head>
<body>
    <nav class="oae-navbar">
        <div class="oae-logo">
            <a href="../../Index.htm"><img class="logo-quiz" src="../../oae.png" alt="OAE"></a>
        </div>
        <div class="oae-search-section">
            <div class="oae-search-container">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search JAMB, schools, courses...">
                <button class="oae-search-btn">Search</button>
            </div>
        </div>
        <ul class="oae-nav-links">
            <li><a href="#">Post-JAMB</a></li>
            <li><a href="#">Admission</a></li>
            <li><a href="#">Schools</a></li>
        </ul>
        <button class="oae-join-btn">Join OAE</button>
        <button class="oae-hamburger"><i class="fas fa-bars"></i></button>
    </nav>

    <section class="school-header">
        <div class="school-header-content">
            <h1>{name}</h1>
            <p>{location}</p>
        </div>
    </section>

    <section class="school-content">
        <div class="school-container">
            <div class="quick-facts">
                <div class="fact-card">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>Institution Type</h3>
                    <p>{type}</p>
                </div>
                <div class="fact-card">
                    <i class="fas fa-map-marker-alt"></i>
                    <h3>Location</h3>
                    <p>{location}</p>
                </div>
                <div class="fact-card">
                    <i class="fas fa-book"></i>
                    <h3>Competition Level</h3>
                    <p>{competition}</p>
                </div>
                <div class="fact-card">
                    <i class="fas fa-chart-line"></i>
                    <h3>Min Cutoff</h3>
                    <p>{cutoff}</p>
                </div>
            </div>

            <div class="section-block">
                <h2>Cut-off Marks</h2>
                <div class="cutoff-table">
                    <div class="cutoff-row">
                        <span class="cutoff-label">General Cutoff:</span>
                        <span class="cutoff-value">{cutoff}</span>
                    </div>
                    <div class="cutoff-row">
                        <span class="cutoff-label">Competitive Courses:</span>
                        <span class="cutoff-value">Higher</span>
                    </div>
                </div>
            </div>

            <div class="section-block">
                <h2>Admission Requirements</h2>
                <ul class="requirements-list">
                    <li>JAMB Score: {cutoff}</li>
                    <li>5 Credits in O-level including English & Maths</li>
                    <li>Post-UTME/Screening Exam</li>
                    <li>Medical clearance</li>
                    <li>Completed application form</li>
                </ul>
            </div>

            <div class="section-block">
                <h2>Post-UTME Details</h2>
                <div class="details-grid">
                    <div class="detail-item">
                        <h4>Format</h4>
                        <p>Computer-Based Test</p>
                    </div>
                    <div class="detail-item">
                        <h4>Duration</h4>
                        <p>1.5 - 2 hours</p>
                    </div>
                    <div class="detail-item">
                        <h4>Registration Fee</h4>
                        <p>₦2,000 - ₦5,000</p>
                    </div>
                </div>
            </div>

            <div class="back-section">
                <a href="../post-jamb/index.html" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Post-JAMB Guide</a>
            </div>
        </div>
    </section>

    <footer class="oae-footer">
        <div class="footer-bottom">
            <p>© 2025 OAE — Oluwatosin Academy of Excellence.</p>
        </div>
    </footer>

    <script src="/Assets/js/post-jamb-navbar.js"></script>
</body>
</html>
'''

base_path = r"c:\Users\USER\Documents\OAE\admission\schools"
os.makedirs(base_path, exist_ok=True)

for code, data in schools_data.items():
    if code not in ["unilag", "ui"]:  # Skip already created ones
        html_content = html_template.format(
            name=data["name"],
            location=data["location"],
            type=data["type"],
            competition=data["competition"],
            cutoff=data["cutoff"]
        )
        
        file_path = os.path.join(base_path, f"{code}.html")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        print(f"Created: {code}.html")

print(f"\nTotal files created: {len(schools_data) - 2}")
