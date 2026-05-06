import os
import re

directory = "C:/Users/USER/Documents/OAE"

replacements = [
    (r'<a[^>]*>\s*<i class="ri-linkedin-fill"></i>\s*</a>', r'<a href="https://linkedin.com/in/oaeofficial123" target="_blank"><i class="ri-linkedin-fill"></i></a>'),
    (r'<a[^>]*>\s*<i class="ri-twitter-x-fill"></i>\s*</a>', r'<a href="https://x.com/oaeofficial123" target="_blank"><i class="ri-twitter-x-fill"></i></a>'),
    (r'<a[^>]*>\s*<i class="ri-youtube-fill"></i>\s*</a>', r'<a href="https://youtube.com/@oaeofficial123" target="_blank"><i class="ri-youtube-fill"></i></a>'),
    (r'<a[^>]*>\s*<i class="ri-facebook-circle-fill"></i>\s*</a>', r'<a href="https://facebook.com/oaeofficial123" target="_blank"><i class="ri-facebook-circle-fill"></i></a>'),
    (r'<a[^>]*>\s*<i class="ri-instagram-fill"></i>\s*</a>', r'<a href="https://instagram.com/oaeofficial123" target="_blank"><i class="ri-instagram-fill"></i></a>'),
    (r'<a[^>]*>\s*<i class="ri-tiktok-fill"></i>\s*</a>', r'<a href="https://tiktok.com/@oaeofficial123" target="_blank"><i class="ri-tiktok-fill"></i></a>')
]

updated_count = 0
for root, dirs, files in os.walk(directory):
    for filename in files:
        if filename.endswith(".html") or filename.endswith(".htm") or filename.endswith(".py"):
            filepath = os.path.join(root, filename)
            
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
            new_content = content
            for old_p, new_p in replacements:
                new_content = re.sub(old_p, new_p, new_content)
                
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                updated_count += 1
                print(f"Updated {filepath}")

print(f"\nDone. Updated {updated_count} files.")
