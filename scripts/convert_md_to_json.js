// scripts/convert_md_to_json.js
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../PensamientosPEA');

fs.readdirSync(dir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.md') {
    const base = path.basename(file, ext);
    const mdPath = path.join(dir, file);
    const jsonPath = path.join(dir, `${base}.json`);
    const content = fs.readFileSync(mdPath, 'utf8');
    const jsonObj = { content };
    fs.writeFileSync(jsonPath, JSON.stringify(jsonObj, null, 2), 'utf8');
    console.log(`Converted ${file} -> ${base}.json`);
  }
});
