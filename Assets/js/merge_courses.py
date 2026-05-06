import json

with open("c:/Users/USER/Documents/OAE/Assets/js/new_courses.json", "r") as f:
    new_courses = json.load(f)

# Format to JS objects string. We need to match indentation.
js_objects = json.dumps(new_courses, indent=8)[1:-1] # strip [ and ]

with open("c:/Users/USER/Documents/OAE/Assets/js/subject-combinations.js", "r") as f:
    content = f.read()

# find the exact string of the last object to append a comma
target = """            remarks: "Technical Drawing or Fine Art at O'Level gives a huge advantage during screening in some universities."
        }"""

if target in content:
    new_content = content.replace(target, target + "," + js_objects)
    with open("c:/Users/USER/Documents/OAE/Assets/js/subject-combinations.js", "w") as f:
        f.write(new_content)
    print("Updated successfully")
else:
    print("Target string not found in subject-combinations.js")
