import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

const files = fs.readdirSync(routesDir);

files.forEach((file) => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(routesDir, file);
    let code = fs.readFileSync(filePath, 'utf8');

    if (code.includes('{title}') || code.includes('{subTitle}')) {
      // Find title from meta tag or file basename
      let pageTitle = file.replace('staff.', '').replace('.tsx', '').split('.').pop() || 'Module';
      
      const metaMatch = code.match(/meta:\s*\[\s*{\s*title:\s*"([^"]+)"/);
      if (metaMatch && metaMatch[1]) {
        pageTitle = metaMatch[1].split(' — ')[0].split(' - ')[0];
      }

      code = code.replace(/\{title\}/g, `"${pageTitle}"`);
      code = code.replace(/\{subTitle\}/g, `"Official higher education ERP management ledger and verified domain records."`);

      fs.writeFileSync(filePath, code, 'utf8');
      console.log(`Fixed {title}/{subTitle} in: ${file} -> Title: "${pageTitle}"`);
    }
  }
});

console.log("All route files checked and updated successfully!");
