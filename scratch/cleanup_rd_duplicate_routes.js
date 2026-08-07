import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');
const navFilePath = path.join(process.cwd(), 'src/config/navigation/research.ts');

// 1. Update navigation file URLs to use standard route paths
let navCode = fs.readFileSync(navFilePath, 'utf8');
navCode = navCode.replace('/staff/research-development/patents-list', '/staff/research-development/patents');
navCode = navCode.replace('/staff/research-development/phd-scholars-list', '/staff/research-development/phd-scholars');
fs.writeFileSync(navFilePath, navCode, 'utf8');
console.log("Updated navigation URLs in research.ts");

// 2. Delete duplicate/legacy route files that conflict with the primary routes
const duplicates = [
  'staff.research-development.incubator.tsx',
  'staff.research-development.labs.tsx',
  'staff.research-development.patents-list.tsx',
  'staff.research-development.phd-scholars-list.tsx',
  'staff.research-development.publications.tsx',
  'staff.research-development.reports.tsx',
  'staff.research-development.research-grants.tsx',
];

duplicates.forEach((file) => {
  const filePath = path.join(routesDir, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted duplicate route file: ${file}`);
  }
});

console.log("R&D route cleanup completed successfully.");
