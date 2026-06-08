import os
import glob

def fix_paths():
    files = glob.glob('**/*.htm*', recursive=True)
    for f in files:
        if not os.path.isfile(f): continue
        try:
            with open(f, 'r', encoding='utf-8') as file:
                content = file.read()
            
            new_content = content.replace('/Index.htm', '/')
            new_content = new_content.replace('../Index.htm', '/')
            new_content = new_content.replace('href="Index.htm', 'href="/')
            
            if new_content != content:
                with open(f, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Fixed {f}")
        except Exception as e:
            pass

if __name__ == '__main__':
    fix_paths()
