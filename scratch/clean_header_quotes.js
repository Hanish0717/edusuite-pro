import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');
const files = fs.readdirSync(routesDir);

files.forEach((file) => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(routesDir, file);
    let code = fs.readFileSync(filePath, 'utf8');

    let modified = false;
    if (code.includes(' text-foreground font-bold tracking-tight">"')) {
      code = code.replace(/text-foreground font-bold tracking-tight">"([^"]+)"<\/h1>/g, 'text-foreground font-bold tracking-tight">$1</h1>');
      modified = true;
    }
    if (code.includes('text-2xl font-bold tracking-tight text-foreground">"')) {
      code = code.replace(/text-2xl font-bold tracking-tight text-foreground">"([^"]+)"<\/h1>/g, 'text-2xl font-bold tracking-tight text-foreground">$1</h1>');
      modified = true;
    }
    if (code.includes('text-muted-foreground">"')) {
      code = code.replace(/text-muted-foreground">"([^"]+)"<\/p>/g, 'text-muted-foreground">$1</p>');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, code, 'utf8');
      console.log(`Cleaned JSX quotes in: ${file}`);
    }
  }
});
