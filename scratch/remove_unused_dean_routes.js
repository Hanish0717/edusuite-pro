import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');
const filesToRemove = [
  'staff.student-dean.assign-substitute.tsx',
  'staff.student-dean.my-timetable.tsx',
  'staff.student-dean.faculty-timetables.tsx',
  'staff.student-dean.substitution-history.tsx',
  'staff.student-dean.take-attendance.tsx',
  'staff.student-dean.my-classes.tsx'
];

filesToRemove.forEach((f) => {
  const p = path.join(routesDir, f);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(`Deleted unused route file: ${f}`);
  }
});
