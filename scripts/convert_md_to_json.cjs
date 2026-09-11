const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'PensamientosPEA');

fs.readdir(dir, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }
  files.filter(f => f.endsWith('.md')).forEach(file => {
    const mdPath = path.join(dir, file);
    const jsonPath = path.join(dir, file.replace(/\.md$/, '.json'));
    const content = fs.readFileSync(mdPath, 'utf8');
    const jsonData = JSON.stringify({ content }, null, 2);
    fs.writeFileSync(jsonPath, jsonData);
    console.log(`Converted ${file} → ${path.basename(jsonPath)}`);
  });
});
