"""
Normalize topics for Biology, Economics, Government, Physics, Chemistry, Literature, CRS.
"""
import json, re, sys, os
sys.stdout.reconfigure(encoding='utf-8')

DATA_PATH = 'Quizzes/data'

# ── Subject-specific canonical topic maps ──────────────────────────────────────

BIOLOGY_MAP = {
    # Exact overrides
    'Cell Biology': 'Cell Biology',
    'Genetics': 'Genetics',
    'Evolution': 'Evolution',
    'Ecology': 'Ecology',
    'Nutrition': 'Nutrition & Digestion',
    'Digestion': 'Nutrition & Digestion',
    'Respiration': 'Respiration',
    'Circulation': 'Circulatory System',
    'Excretion': 'Excretion',
    'Reproduction': 'Reproduction',
    'Growth': 'Growth & Development',
    'Nervous System': 'Nervous System',
    'Endocrine System': 'Endocrine System',
    'Support & Movement': 'Support & Movement',
    'Transport': 'Transport in Living Things',
    'Photosynthesis': 'Photosynthesis',
    'Classification': 'Classification of Living Things',
    'Microorganisms': 'Microorganisms & Disease',
    'Biotechnology': 'Biotechnology',
    'Variation': 'Genetics',
}

BIOLOGY_PATTERNS = [
    (r'(?i)cell|organelle|membrane|mitosis|meiosis|chromosome', 'Cell Biology'),
    (r'(?i)genetic|heredit|mendel|DNA|RNA|mutation|dominant|recessive|allele|gene|chromosome|variation|sex.link|blood.group', 'Genetics'),
    (r'(?i)evolution|natural selection|darwin|adaptation|speciation', 'Evolution'),
    (r'(?i)ecology|ecosystem|food chain|food web|biome|habitat|population|community|energy flow|carbon cycle|nitrogen cycle|water cycle', 'Ecology'),
    (r'(?i)nutrition|digest|alimentary|enzyme|stomach|intestine|absorption|assimilation|food test|starch|protein|fat|vitamin|mineral', 'Nutrition & Digestion'),
    (r'(?i)respirat|aerobic|anaerobic|ATP|breathing|lung|gaseous exchange|photosynthesis and respiration', 'Respiration'),
    (r'(?i)circulat|heart|blood|artery|vein|capillary|haemoglobin|plasma|lymph', 'Circulatory System'),
    (r'(?i)excret|kidney|urine|liver|skin|nitrogen.*waste|osmoregulat', 'Excretion'),
    (r'(?i)reproduct|fertiliz|pollination|germination|seed|flower|ovary|testes|menstrual', 'Reproduction'),
    (r'(?i)growth|development|metamorphosis|ageing|regeneration', 'Growth & Development'),
    (r'(?i)nervous|neuron|reflex|brain|spinal|synapse|receptor|effector|sense organ|eye|ear|skin', 'Nervous System'),
    (r'(?i)hormone|endocrine|insulin|adrenaline|thyroid|pituitary|oestrogen|testosterone|gland', 'Endocrine System'),
    (r'(?i)support|skeleton|bone|muscle|movement|locomotion|joint|tendons|ligament', 'Support & Movement'),
    (r'(?i)transport|xylem|phloem|transpiration|osmosis|diffusion|active transport|root|stem|leaf', 'Transport in Living Things'),
    (r'(?i)photosynthes|chlorophyll|chloroplast|light reaction|dark reaction|stomata', 'Photosynthesis'),
    (r'(?i)classif|taxonomy|kingdom|phylum|genus|species|vertebrate|invertebrate|mammal|reptile|amphibian|fish|bird|insect|fungi|bacteria|algae|moss|fern|bryophyte|gymnosperm|angiosperm|dicot|monocot', 'Classification of Living Things'),
    (r'(?i)microorganism|bacteria|virus|disease|infection|immunity|antibody|pathogen|protozoa', 'Microorganisms & Disease'),
    (r'(?i)biotechnol|fermentation|genetic engineering|cloning|tissue culture|antibiotic', 'Biotechnology'),
]

ECONOMICS_MAP = {
    'Demand': 'Demand & Supply',
    'Supply': 'Demand & Supply',
    'Demand and Supply': 'Demand & Supply',
    'Price Determination': 'Demand & Supply',
    'Elasticity': 'Elasticity',
    'Market Structure': 'Market Structures',
    'National Income': 'National Income',
    'Money and Banking': 'Money & Banking',
    'Public Finance': 'Public Finance',
    'International Trade': 'International Trade',
    'Economic Development': 'Development Economics',
    'Population': 'Population',
    'Labour': 'Labour & Wages',
    'Production': 'Production & Costs',
    'Cost and Revenue': 'Production & Costs',
}

ECONOMICS_PATTERNS = [
    (r'(?i)demand|supply|equilibrium|price.*determination|quantity.*demanded|law of demand|elasticity of demand', 'Demand & Supply'),
    (r'(?i)elasticity|PED|YED|CED|PES|elastic|inelastic', 'Elasticity'),
    (r'(?i)market.structure|monopoly|oligopoly|duopoly|perfect.competition|imperfect|monopsony', 'Market Structures'),
    (r'(?i)national income|GDP|GNP|NNP|GNI|per capita|standard of living|circular flow', 'National Income'),
    (r'(?i)money|banking|bank|credit|monetary|interest rate|inflation|deflation|exchange rate|currency|central bank|commercial bank', 'Money & Banking'),
    (r'(?i)public.finance|government.*expenditure|taxation|tax|budget|fiscal|deficit|surplus|national debt|public.*debt', 'Public Finance'),
    (r'(?i)international trade|balance of payment|balance of trade|tariff|import|export|foreign exchange|protectionism|comparative advantage', 'International Trade'),
    (r'(?i)economic development|economic growth|developing|underdevelopment|industrializ|capital formation|savings|investment', 'Development Economics'),
    (r'(?i)population|census|birth rate|death rate|migration|urbanization|demographic|labour force|workforce', 'Population'),
    (r'(?i)labour|wages|trade union|employment|unemployment|wage determination|minimum wage|collective bargaining', 'Labour & Wages'),
    (r'(?i)production|cost|revenue|profit|loss|average cost|marginal cost|fixed cost|variable cost|returns to scale|economies of scale|factors of production', 'Production & Costs'),
    (r'(?i)agriculture|farming|land reform|peasant|crop|livestock|food production', 'Agriculture'),
    (r'(?i)utility|consumer|consumption|budget constraint|indifference|marginal utility', 'Consumer Theory'),
    (r'(?i)firm|entrepreneur|business|company|enterprise|corporation|partnership|sole trader', 'Theory of the Firm'),
    (r'(?i)cooperative|cooperative society|type of cooperative', 'Cooperatives'),
    (r'(?i)insurance|risk|premium|policy|assurance', 'Insurance'),
    (r'(?i)stock exchange|capital market|shares|bonds|securities|stock market', 'Capital Market'),
    (r'(?i)scarcity|choice|opportunity cost|scale of preference|economic problem|production possibility', 'Basic Concepts'),
]

GOVERNMENT_PATTERNS = [
    (r'(?i)constitution|constitutional|fundamental rights|bill of rights|supremacy|amendment|entrenchment', 'Constitution'),
    (r'(?i)democracy|dictatorship|totalitarian|autocracy|oligarchy|monarchy|republic|system of government|unitary|federal|confederation', 'Systems of Government'),
    (r'(?i)legislature|parliament|congress|national assembly|senate|house of rep|lawmaking|bicameral|unicameral|bill|act of parliament', 'Legislature'),
    (r'(?i)executive|president|prime minister|cabinet|government|minister|governor|administration', 'Executive'),
    (r'(?i)judiciary|court|judge|law|justice|supreme court|appeal|magistrate|separation of powers', 'Judiciary'),
    (r'(?i)political party|party system|election|electoral|voting|suffrage|franchise|electorate|INEC|constituency|proportional representation|first past the post', 'Political Parties & Elections'),
    (r'(?i)federalism|federal|state government|local government|devolution|fiscal federalism|revenue allocation|intergovernmental', 'Federalism'),
    (r'(?i)colonialism|colonial|independence|nationalism|decolonization|self-rule|british|protectorate|amalgamation', 'Colonialism & Nationalism'),
    (r'(?i)citizenship|rights|duties|obligations|civil rights|human rights|freedom|liberty', 'Citizenship & Rights'),
    (r'(?i)foreign policy|international relations|diplomacy|treaty|sovereignty|international organization|UN|AU|ECOWAS|NATO|Commonwealth', 'Foreign Policy & International Relations'),
    (r'(?i)public administration|civil service|bureaucracy|public servant|government official|administrative|policy implementation', 'Public Administration'),
    (r'(?i)local government|council|chieftaincy|traditional ruler|traditional|ward|LGA|LCDA', 'Local Government'),
    (r'(?i)pressure group|interest group|lobby|trade union|NGO|civil society', 'Pressure Groups'),
    (r'(?i)military|coup|armed forces|martial law|junta|military rule|army|AFRC|SMC', 'Military & Military Rule'),
    (r'(?i)Nigeria|Nigerian history|NCNC|NPC|AG|Second Republic|First Republic|colonial|amalgamation|1914|1960|1963|1966|1979|1983|1993|1999', 'Nigerian Political History'),
    (r'(?i)communism|socialism|capitalism|liberal|conservative|ideology|marxism|fascism', 'Political Ideologies'),
    (r'(?i)public opinion|propaganda|mass media|press|censorship|communication', 'Public Opinion & Media'),
]

PHYSICS_PATTERNS = [
    (r'(?i)mechanics|force|newton|motion|velocity|acceleration|momentum|work|energy|power|friction|inertia|torque|equilibrium|projectile|circular motion', 'Mechanics'),
    (r'(?i)heat|temperature|thermometer|thermodynamics|thermal|expansion|conduction|convection|radiation|calorimetry|latent heat|specific heat|gas law|boyle|charles|pressure.*gas', 'Heat & Thermodynamics'),
    (r'(?i)wave|sound|light|optics|reflection|refraction|diffraction|interference|superposition|resonance|frequency|wavelength|amplitude|transverse|longitudinal', 'Waves & Optics'),
    (r'(?i)electric|current|voltage|resistance|ohm|circuit|capacitor|battery|EMF|watt|power.*electric|series.*parallel|kirchhoff', 'Electricity & Magnetism'),
    (r'(?i)magnetic|magnet|electromagnetic|induction|faraday|lenz|transformer|generator|motor|flux', 'Electricity & Magnetism'),
    (r'(?i)atom|nucleus|radioactiv|nuclear|proton|neutron|electron|decay|fission|fusion|isotope|half.life|radiation.*alpha|beta|gamma', 'Atomic & Nuclear Physics'),
    (r'(?i)measurement|SI unit|dimension|error|significant figure|scalar|vector|physical quantities|derived unit|base unit', 'Measurement & Units'),
    (r'(?i)fluid|pressure.*fluid|archimedes|density|upthrust|surface tension|viscosity|pascal|hydraulic|buoyancy|floating', 'Fluid Mechanics'),
    (r'(?i)electrostatic|coulomb|electric field|electric potential|capacitance|dielectric', 'Electrostatics'),
    (r'(?i)simple machine|pulley|lever|inclined plane|mechanical advantage|velocity ratio|efficiency', 'Simple Machines'),
    (r'(?i)satellite|gravity|gravitational|orbit|universal gravitation|escape velocity|weight|mass', 'Gravitation'),
    (r'(?i)semiconductor|diode|transistor|rectification|electronic|p-n junction', 'Electronics'),
]

CHEMISTRY_PATTERNS = [
    (r'(?i)atomic structure|atom|electron|proton|neutron|orbital|shell|Bohr|quantum|periodic table|element|period|group', 'Atomic Structure'),
    (r'(?i)chemical bond|ionic|covalent|metallic|van der waals|hydrogen bond|electronegativity|Lewis|VSEPR', 'Chemical Bonding'),
    (r'(?i)acid|base|alkali|pH|neutralization|salt|buffer|indicator|titration|strong acid|weak acid', 'Acids, Bases & Salts'),
    (r'(?i)oxidation|reduction|redox|oxidizing agent|reducing agent|electrochemistry|electrolysis|electrode|cell', 'Electrochemistry & Redox'),
    (r'(?i)organic chemistry|hydrocarbon|alkane|alkene|alkyne|benzene|aromatic|aliphatic|isomer|polymer|ester|alcohol|aldehyde|ketone|carboxylic acid|amine|amide|addition|substitution|elimination', 'Organic Chemistry'),
    (r'(?i)kinetics|rate of reaction|catalyst|activation energy|collision theory|order of reaction', 'Chemical Kinetics'),
    (r'(?i)equilibrium|Le Chatelier|reversible reaction|dynamic equilibrium|Kc|Kp', 'Chemical Equilibrium'),
    (r'(?i)thermochemistry|enthalpy|Hess|heat of reaction|calorimetry|exothermic|endothermic|bond energy', 'Thermochemistry'),
    (r'(?i)gas|ideal gas|Boyle|Charles|Avogadro|mole|molar mass|stoichiometry|mole ratio|relative mass', 'Gases & Moles'),
    (r'(?i)metal|non.metal|extraction|alloy|corrosion|rust|steel|iron|copper|aluminium|zinc|sodium|calcium|industrial', 'Metals & Extraction'),
    (r'(?i)water|solution|solubility|concentration|dilution|colligative|osmosis|hard water|soft water', 'Solutions & Water'),
    (r'(?i)periodic|periodicity|trend|atomic radius|ionization energy|electron affinity|electronegativity', 'Periodic Table & Trends'),
    (r'(?i)nuclear|radioactiv|fission|fusion|isotope|half.life|radiation', 'Nuclear Chemistry'),
]

CRS_PATTERNS = [
    (r'(?i)genesis|creation|adam|eve|cain|abel|noah|abraham|isaac|jacob|joseph|moses|exodus|passover|covenant|old testament|patriarchs', 'Old Testament'),
    (r'(?i)psalms|proverbs|ecclesiastes|wisdom|poetry|lament|praise', 'Wisdom Literature'),
    (r'(?i)isaiah|jeremiah|ezekiel|daniel|amos|hosea|micah|prophet|prophecy|exile|babylonian', 'Prophetic Books'),
    (r'(?i)jesus|christ|gospel|matthew|mark|luke|john|sermon|miracle|parable|nativity|crucifixion|resurrection|baptism|temptation', 'Life of Jesus'),
    (r'(?i)paul|peter|church|acts|apostle|missionary|pentecost|holy spirit|letter|epistle|roman|corinthian|galatian|ephesian|philippian|colossian|thessalonian|timothy|titus|philemon|hebrews|james', 'New Testament Church'),
    (r'(?i)church|worship|prayer|sacrament|baptism|communion|eucharist|liturgy|denomination|catholic|protestant|evangelical|ecumenism', 'Christian Living & Worship'),
    (r'(?i)ethics|moral|justice|love|forgiveness|peace|sin|repentance|holiness|stewardship', 'Christian Ethics'),
    (r'(?i)family|marriage|children|parenting|divorce|sexuality|gender|role of women', 'Family & Marriage'),
    (r'(?i)society|community|citizenship|government|politics|civic|social responsibility', 'Christianity & Society'),
]

def normalize_with_patterns(topic, patterns):
    """Apply pattern rules to normalize a topic."""
    if not topic or topic.strip() == '':
        return 'General'
    for pattern, canonical in patterns:
        if re.search(pattern, topic):
            return canonical
    # Strip subtopic after ' - '
    parent = re.split(r'\s+-\s+', topic)[0].strip()
    return parent if parent else 'General'

def process_subject(filename, patterns, extra_exact=None):
    path = os.path.join(DATA_PATH, filename)
    if not os.path.exists(path):
        print(f'SKIP: {filename} not found')
        return

    with open(path, encoding='utf-8') as f:
        raw = json.load(f)

    qs = raw if isinstance(raw, list) else raw.get('questions', [])
    flat = []
    for item in qs:
        if isinstance(item, list): flat.extend(item)
        elif isinstance(item, dict): flat.append(item)

    changed = 0
    for q in flat:
        old = q.get('topic', '')
        # Check exact map first
        if extra_exact and old in extra_exact:
            new = extra_exact[old]
        else:
            new = normalize_with_patterns(old, patterns)
        if old != new:
            q['topic'] = new
            changed += 1

    from collections import Counter
    topics = sorted(Counter(q.get('topic','') for q in flat).items())
    print(f'\n--- {filename} ({len(flat)} questions) ---')
    print(f'Topics changed: {changed}')
    print(f'Final topics ({len(topics)} unique):')
    for t, c in topics:
        print(f'  {c:4d}x  {t}')

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(flat, f, indent=2, ensure_ascii=False)
    print(f'Saved.')

# Run all subjects
process_subject('biology.json', BIOLOGY_PATTERNS, BIOLOGY_MAP)
process_subject('economics.json', ECONOMICS_PATTERNS, ECONOMICS_MAP)
process_subject('government.json', GOVERNMENT_PATTERNS)
process_subject('physics.json', PHYSICS_PATTERNS)
process_subject('chemistry.json', CHEMISTRY_PATTERNS)
process_subject('crs.json', CRS_PATTERNS)
