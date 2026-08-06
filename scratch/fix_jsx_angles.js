import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');
const files = fs.readdirSync(routesDir).filter((f) => f.startsWith('staff.academic-dean.'));

files.forEach((file) => {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace unescaped JSX angles inside JSX text content
  content = content.replace(/\(<6.0 CGPA\)/g, '(&lt;6.0 CGPA)');
  content = content.replace(/\(<75%\)/g, '(&lt;75%)');

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Fixed JSX unescaped angle brackets in Academic Dean files.');
