import re
import json

def process_file(filename, color_class):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    html = ""
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if line.startswith("====="):
            continue
            
        if "📚 BAB 1:" in line or "KEBIJAKAN EKONOMI" in line or "PERMASALAHAN EKONOMI" in line:
            continue
            
        # Bold processing
        line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
        
        # Check if title
        is_title = False
        
        # Rule 1: short, no ending punctuation, doesn't contain defining words
        defining_words = [' adalah ', ' merupakan ', ' yaitu ', ' yakni ', ' karena ', ' sehingga ', ' bahwa ']
        has_defining_word = any(w in line.lower() for w in defining_words)
        
        if len(line) < 80 and not line.endswith(('.', ',', ':', ';', '?', '!')) and not has_defining_word:
            is_title = True
            
        # Rule 2: List items that act as titles e.g. "1. Pengertian", "a. Harga barang"
        if re.match(r'^([A-Z]|\d+)[.)]\s+', line) and len(line) < 80 and not has_defining_word:
            is_title = True
            
        # Rule 3: HTML tags are not titles but should just be embedded
        if line.startswith('<a href='):
            is_title = False
            
        if is_title:
            html += f'<span class="subbab-title {color_class}"><strong>📌 {line}</strong></span>\n'
        else:
            html += f'<span class="normal-text" style="color: #FFFFFF; font-weight: normal; line-height: 1.5; display: block; margin-bottom: 16px;">{line}</span>\n'
            
    return html

bab1_html = process_file('../bab1.txt', 'blue')
bab2_html = process_file('../bab2.txt', 'purple')
bab3_html = process_file('../bab3.txt', 'green')

materials = {
    'bab1': bab1_html,
    'bab2': bab2_html,
    'bab3': bab3_html
}

with open('../materials.js', 'w', encoding='utf-8') as f:
    f.write("const materialsData = " + json.dumps(materials, indent=4) + ";\n")
