const fs = require('fs');

function processFile(filename, colorClass) {
    const data = fs.readFileSync(filename, 'utf-8');
    const lines = data.split('\n');
    let html = "";
    
    const definingWords = [' adalah ', ' merupakan ', ' yaitu ', ' yakni ', ' karena ', ' sehingga ', ' bahwa '];
    
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        if (line.startsWith("=====")) continue;
        if (line.includes("📚 BAB 1:") || line.includes("KEBIJAKAN EKONOMI") || line.includes("PERMASALAHAN EKONOMI")) continue;
        
        // Bold processing
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        let isTitle = false;
        
        const hasDefiningWord = definingWords.some(w => line.toLowerCase().includes(w));
        
        // Rule 1: short, no ending punctuation, doesn't contain defining words
        if (line.length < 80 && !/[.,:;?!]$/.test(line) && !hasDefiningWord) {
            isTitle = true;
        }
        
        // Rule 2: List items that act as titles e.g. "1. Pengertian", "a. Harga barang"
        if (/^([A-Za-z]|\d+)[.)]\s+/.test(line) && line.length < 80 && !hasDefiningWord) {
            isTitle = true;
        }
        
        // Rule 3: HTML tags are not titles but should just be embedded
        if (line.startsWith('<a href=')) {
            isTitle = false;
        }
        
        if (isTitle) {
            html += `<span class="subbab-title ${colorClass}"><strong>📌 ${line}</strong></span>\n`;
        } else {
            html += `<span class="normal-text" style="color: #FFFFFF; font-weight: normal; line-height: 1.5; display: block; margin-bottom: 16px;">${line}</span>\n`;
        }
    }
    return html;
}

const bab1Html = processFile('bab1.txt', 'blue');
const bab2Html = processFile('bab2.txt', 'purple');
const bab3Html = processFile('bab3.txt', 'green');

const materials = {
    bab1: bab1Html,
    bab2: bab2Html,
    bab3: bab3Html
};

const output = "const materialsData = " + JSON.stringify(materials, null, 4) + ";\n";
fs.writeFileSync('materials.js', output, 'utf-8');
