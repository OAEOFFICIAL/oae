import json
import re

table = """
| Accounting / Accountancy                      | Mathematics, Economics, plus any Social Science subject               |
| Actuarial Science                             | Mathematics, Economics, and any other Social Science subject          |
| Adult Education                               | Government/History, one Social Science subject, and any other subject |
| Agricultural Economics                        | Chemistry, Biology/Agricultural Science, and Mathematics or Physics   |
| Agricultural Engineering                      | Mathematics, Physics, and Chemistry                                   |
| Agricultural Extension                        | Chemistry, Biology or Agriculture, and Physics or Mathematics         |
| Agricultural Science Education                | Any three from Chemistry, Biology, Agriculture, Physics, Economics, Geography, and Mathematics |
| Agriculture                                   | Chemistry, Biology/Agricultural Science, and any of Physics or Mathematics |
| Agronomy                                      | Chemistry, Biology or Agriculture, and Physics or Mathematics         |
| Anatomy / Human Anatomy                       | Biology, Physics, and Chemistry                                       |
| Animal Production and Science                 | Chemistry, Biology/Agriculture, and Mathematics or Physics            |
| Applied Biology                               | Biology, Chemistry, and Physics or Mathematics                        |
| Applied Chemistry                             | Chemistry, Mathematics, and any of Physics/Biology/Agricultural Sci.  |
| Applied Geophysics                            | Physics, Mathematics, and Chemistry or Geography                      |
| Applied Microbiology                          | Biology, Chemistry, and Physics                                       |
| Architecture                                  | Physics, Mathematics, and one of Chemistry, Geography, Art, Biology, Economics |
| Arts (Combined Honours)                       | Any three Arts or Social Science subjects                             |
| Banking and Finance                           | Mathematics, Economics, plus one of Government and Geography          |
| Biochemistry                                  | Biology, Physics, and Chemistry                                       |
| Biological Sciences                           | Biology, Chemistry, and Physics or Mathematics                        |
| Biomedical Engineering                        | Mathematics, Physics, and Chemistry                                   |
| Biomedical Technology                         | Biology, Physics, and Chemistry                                       |
| Botany                                        | Biology, Chemistry, and any other Science subject                     |
| Building                                      | Physics, Mathematics, and any of Chemistry, Geography, Economics      |
| Building Technology                           | Physics, Mathematics, and any of Chemistry, Geography, Economics      |
| Business Administration                       | Mathematics, Economics, plus one of Government and Geography          |
| Business Education                            | Mathematics, Economics, and one other subject                         |
| Business Management                           | Mathematics, Economics, plus one of Government and Geography          |
| Chemical Engineering                          | Mathematics, Physics, and Chemistry                                   |
| Chemistry                                     | Chemistry and two of Physics, Biology, and Mathematics                |
| Christian Religious Studies (CRS)             | Two Arts subjects including CRK and any other subject                 |
| Civil Engineering                             | Mathematics, Physics, and Chemistry                                   |
| Computer Engineering                          | Mathematics, Physics, and Chemistry                                   |
| Computer Science                              | Mathematics, Physics, and one of Biology, Chemistry, Agric Science, Economics, Geography |
| Cooperative and Rural Development             | Mathematics, Economics, and one other subject                         |
| Creative Arts                                 | Fine Art and two other Arts or Social Science subjects                |
| Criminology and Security Studies              | Economics, Government, and any other Social Science subject           |
| Crop Production and Science                   | Chemistry, Biology/Agriculture, and Mathematics or Physics            |
| Dentistry and Dental Technology               | Biology, Physics, and Chemistry                                       |
| Economics                                     | Mathematics, Economics, and any of Government, History, Geography, Literature in English, French, CRS, Islamic Studies |
| Education & Biology                           | Biology and two other subjects from Chemistry, Physics, Mathematics   |
| Education & Chemistry                         | Chemistry and two other subjects from Physics, Biology, Mathematics   |
| Education & Computer Science                  | Mathematics, Physics, and one of Chemistry, Biology, Economics        |
| Education & Economics                         | Economics, Mathematics, and one of Government, History, Geography     |
| Education & English Language                  | Literature in English and one Arts subject plus any other subject     |
| Education & Geography                         | Geography and two other Social Science or Science subjects            |
| Education & History                           | History/Government and any two Arts or Social Science subjects        |
| Education & Integrated Science                | Any three of Biology, Chemistry, Physics, Mathematics, Agric Science  |
| Education & Mathematics                       | Mathematics and any two of Physics, Chemistry, Economics              |
| Education & Physics                           | Physics, Mathematics, and Chemistry or Biology                        |
| Education & Political Science                 | Government/History and two other Arts or Social Science subjects      |
| Education & Social Studies                    | Any three of Government, Economics, Geography, History, CRS, IRS      |
| Educational Management                        | Economics, Mathematics, and one of Government, History, Geography     |
| Electrical/Electronics Engineering            | Mathematics, Physics, and Chemistry                                   |
| English and Literary Studies                  | Literature in English, one other Arts subject, and another Arts or Social Science subject |
| English Language                              | Literature in English and any two Arts or Social Science subjects     |
| Entrepreneurship                              | Mathematics, Economics, and one other Social Science subject          |
| Environmental Biology                         | Biology, Chemistry, and any other Science subject                     |
| Environmental Management                      | Biology, Chemistry, and Geography or Physics                          |
| Estate Management                             | Mathematics, Economics, and one of Geography, Physics, Chemistry      |
| Film Arts                                     | Literature in English and any two Arts subjects                       |
| Finance                                       | Mathematics, Economics, plus one of Government and Geography          |
| Fine and Applied Arts                         | Fine Art and two other Arts or Social Science subjects                |
| Fisheries                                     | Chemistry, Biology/Agricultural Science, and any other Science subject|
| Fisheries and Aquaculture                     | Biology, Chemistry, and Agricultural Science or Physics               |
| Food Science and Technology                   | Chemistry, Mathematics or Physics, and Agricultural Science           |
| Forestry                                      | Chemistry, Biology or Agriculture, and Physics or Mathematics         |
| Forestry and Wildlife Management              | Biology, Chemistry, and Agricultural Science or Mathematics           |
| French                                        | French and any other two subjects from Arts and Social Sciences       |
| Geography                                     | Geography and any two of Mathematics, Biology, Chemistry, Physics, Agricultural Science |
| Geology                                       | Any three of Chemistry, Physics, Mathematics, Biology, Geography      |
| Geophysics                                    | Physics, Mathematics, and Chemistry or Geography                      |
| Guidance and Counselling                      | Any three Arts or Social Science subjects                             |
| Hausa                                         | Hausa, and any two subjects from Arts and Social Sciences             |
| Health Education                              | Biology and any two relevant subjects                                 |
| History and International Studies             | History/Government and any two Arts or Social Science subjects        |
| Home Economics                                | Chemistry, Biology, and Economics or Agricultural Science             |
| Home Science                                  | Chemistry, Biology or Agriculture, and Mathematics or Physics         |
| Hospitality and Tourism Management            | Mathematics, Economics, and Geography or Biology                      |
| Human Kinetics / Physical & Health Education  | Biology and any two relevant subjects                                 |
| Human Nutrition and Dietetics                 | Biology, Physics, and Chemistry                                       |
| Human Resources Management                    | Economics, Government, and any other relevant subject                 |
| Igbo                                          | Igbo, and any two subjects from Arts and Social Sciences              |
| Industrial Chemistry                          | Chemistry, Mathematics, and any of Physics, Biology, Agric Science    |
| Industrial Mathematics                        | Mathematics, Physics, and one of Chemistry, Economics, Geography      |
| Industrial Physics                            | Physics, Mathematics, and Chemistry or Biology                        |
| Industrial Relations                          | Mathematics, Economics, plus one other relevant subject               |
| Information and Communication Technology      | Mathematics, Physics, and one of Chemistry, Biology, Economics        |
| Insurance                                     | Mathematics, Economics, and one other subject                         |
| International Relations                       | Literature in English, Economics, and Geography/Government/History    |
| Islamic Studies                               | Islamic Religious Studies plus two other Arts subjects                |
| Journalism                                    | Literature in English, Economics, and Government                      |
| Languages and Linguistics                     | One Arts subject and two other subjects                               |
| Law                                           | Literature in English, and any two from Economics, Government, History|
| Library and Information Science               | Any three Arts or Social Science subjects                             |
| Linguistics                                   | Any three Arts or Social Science subjects                             |
| Literature in English                         | Literature in English, one other Arts subject, and another Arts or Social Science subject |
| Marine Biology                                | Biology, Chemistry, and any other Science subject                     |
| Marketing                                     | Mathematics, Economics, and one other relevant subject                |
| Mass Communication                            | Literature in English, Economics, and Government                      |
| Mathematics                                   | Mathematics, and any two of Physics, Chemistry, Economics, Biology, Agricultural Science |
| Mechanical Engineering                        | Mathematics, Physics, and Chemistry                                   |
| Mechatronics Engineering                      | Mathematics, Physics, and Chemistry                                   |
| Medical Biochemistry                          | Biology, Physics, and Chemistry                                       |
| Medical Laboratory Science                    | Biology, Physics, and Chemistry                                       |
| Medical Rehabilitation                        | Biology, Physics, and Chemistry                                       |
| Medicine and Surgery                          | Biology, Physics, and Chemistry                                       |
| Metallurgical and Materials Engineering       | Mathematics, Physics, and Chemistry                                   |
| Microbiology                                  | Biology, Chemistry, and Physics                                       |
| Music                                         | Music, and any two Arts or Social Science subjects                    |
| Nursing Science                               | Biology, Physics, and Chemistry                                       |
| Nutrition and Dietetics                       | Chemistry, Biology/Agriculture, and Mathematics/Physics               |
| Optometry                                     | Biology, Physics, and Chemistry                                       |
| Peace Studies and Conflict Resolution         | Government, Economics, and any other Social Science subject           |
| Petroleum Engineering                         | Mathematics, Physics, and Chemistry                                   |
| Pharmacy                                      | Biology, Physics, and Chemistry                                       |
| Philosophy                                    | Any three Arts or Social Science subjects                             |
| Physical Education                            | Biology and any two relevant subjects                                 |
| Physics                                       | Physics, Mathematics, and Chemistry or Biology                        |
| Physiology                                    | Biology, Physics, and Chemistry                                       |
| Physiotherapy                                 | Biology, Physics, and Chemistry                                       |
| Plant Science                                 | Biology, Chemistry, and any other Science subject                     |
| Political Science                             | Government or History, and any two of Economics, Geography, Literature|
| Prosthesis and Orthopedic Technology          | Biology, Physics, and Chemistry                                       |
| Psychology                                    | Any three Arts or Social Science subjects                             |
| Public Administration                         | Government, Economics, and any other Social Science subject           |
| Public Health                                 | Biology, Chemistry, and Physics                                       |
| Pure and Applied Mathematics                  | Mathematics, Physics, and Chemistry or Economics                      |
| Quantity Surveying                            | Mathematics, Physics, and Economics or Chemistry                      |
| Radiography                                   | Biology, Physics, and Chemistry                                       |
| Religious Studies                             | Two Arts subjects including Religious Knowledge and any other subject |
| Science Laboratory Technology                 | Biology, Chemistry, and Physics or Mathematics                        |
| Social Work                                   | Any three Arts or Social Science subjects                             |
| Sociology                                     | Any three Arts or Social Science subjects                             |
| Soil Science                                  | Chemistry, Biology or Agricultural Science, and any of Mathematics or Physics |
| Special Education                             | Any three Arts or Social Science subjects                             |
| Sports Science                                | Biology, Physics, and any other Science subject                       |
| Statistics                                    | Mathematics, and any two of Physics, Chemistry, Economics             |
| Surveying and Geoinformatics                  | Physics, Mathematics, and any of Chemistry, Geography, Art, Biology, Economics |
| Taxation                                      | Mathematics, Economics, plus any Social Science subject               |
| Teacher Education Science                     | Any three of Biology, Chemistry, Physics, Mathematics, Agric Science  |
| Theatre Arts                                  | Literature in English and any two Arts subjects                       |
| Tourism                                       | Mathematics, Economics, and any other subject                         |
| Urban and Regional Planning                   | Mathematics, Geography, and Economics                                 |
| Veterinary Medicine                           | Biology, Physics, and Chemistry                                       |
| Vocational and Technical Education            | Mathematics, Physics, and one other subject                           |
| Water Resources and Environmental Engineering | Mathematics, Physics, and Chemistry                                   |
| Yoruba                                        | Yoruba, and any two subjects from Arts and Social Sciences            |
| Zoology                                       | Biology, Chemistry, and any other Science subject                     |
"""

courses = []

# Existing courses to avoid duplication
existing_names = ["Medicine and Surgery", "Law", "Computer Science", "Mass Communication", "Accounting", "Nursing Science", "Pharmacy", "Mechanical Engineering", "Economics", "Architecture"]
existing_names_lower = [name.lower() for name in existing_names]

lines = table.strip().split('\n')
for line in lines:
    parts = [p.strip() for p in line.split('|') if p.strip()]
    if len(parts) >= 2:
        course_name = parts[0]
        jamb_req = parts[1]
        
        # Check if course is already in the existing top 10
        if course_name.lower() in existing_names_lower:
            continue
            
        jamb_list = ["Use of English"]
        # Split jamb_req by commas, and, or plus. Actually, let's just make it one string or split by comma logically.
        # It's better to just keep Use of English and then the full requirement string as the second item, or split by comma.
        items = [i.strip() for i in jamb_req.split(',')]
        if items:
             jamb_list.extend(items)
        
        olevel_list = ["English Language", "Mathematics", "Plus three relevant subjects according to your JAMB combination"]
        
        remarks = "O'Level requirement generally includes 5 credit passes in English Language, Mathematics, and other subjects relevant to your course. Consult the official JAMB brochure for specifics."
        
        course_obj = {
            "name": course_name,
            "jamb": jamb_list,
            "olevel": olevel_list,
            "remarks": remarks
        }
        courses.append(course_obj)

with open("c:/Users/USER/Documents/OAE/Assets/js/new_courses.json", "w") as f:
    json.dump(courses, f, indent=4)
print("Saved to new_courses.json")
