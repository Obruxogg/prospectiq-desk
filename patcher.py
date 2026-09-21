import re

with open('patch.diff', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_styles_css = False
new_content = []

for line in lines:
    if line.startswith('diff --git a/src/styles.css b/src/styles.css'):
        in_styles_css = True
        continue
    if in_styles_css and line.startswith('diff --git'):
        break
    
    if in_styles_css:
        if line.startswith('+') and not line.startswith('+++'):
            new_content.append(line[1:])
        elif line.startswith(' ') and not line.startswith('@@'):
            new_content.append(line[1:])

header = """@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";

"""
with open('src/styles.css', 'w', encoding='utf-8') as f:
    f.write(header + ''.join(new_content))
