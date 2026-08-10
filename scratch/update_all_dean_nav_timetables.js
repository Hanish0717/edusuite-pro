import fs from 'fs';
import path from 'path';

const navDir = path.join(process.cwd(), 'src/config/navigation');

const updates = [
  {
    file: 'iqac.ts',
    url: '/staff/iqac/timetable',
    title: 'Timetable & Class Schedule'
  },
  {
    file: 'ima.ts',
    url: '/staff/ima/timetable',
    title: 'Timetable & Class Schedule'
  },
  {
    file: 'research.ts',
    url: '/staff/research-development/timetable',
    title: 'Timetable & Class Schedule'
  },
  {
    file: 'finance.ts',
    url: '/staff/finance-dean/timetable',
    title: 'Timetable & Class Schedule'
  },
  {
    file: 'examination.ts',
    url: '/staff/examination-dean/timetable',
    title: 'Timetable & Class Schedule'
  },
  {
    file: 'placement.ts',
    url: '/staff/placement-dean/timetable',
    title: 'Timetable & Class Schedule'
  }
];

updates.forEach((u) => {
  const filePath = path.join(navDir, u.file);
  if (fs.existsSync(filePath)) {
    let code = fs.readFileSync(filePath, 'utf8');
    if (!code.includes(u.url)) {
      // Add Timetable item under the first section or System section
      code = code.replace(
        "    label: \"System\",",
        `    label: "Timetable & Schedule",\n    items: [\n      { title: "${u.title}", url: "${u.url}", icon: CalendarRange },\n    ],\n  },\n  {\n    label: "System",`
      );
      fs.writeFileSync(filePath, code, 'utf8');
      console.log(`Updated navigation in ${u.file}`);
    }
  }
});
