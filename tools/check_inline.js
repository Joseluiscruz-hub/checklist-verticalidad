const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '..', 'index.html');
const html = fs.readFileSync(file, 'utf8');
const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/ig;
let m, i = 0;
while ((m = re.exec(html)) !== null) {
  const attrs = m[1];
  const content = m[2];
  if (!/src\s*=/.test(attrs)) {
    i++;
    try {
      new Function(content);
      console.log(`inline_script_${i}: OK`);
    } catch (e) {
      console.error(`inline_script_${i}: SYNTAX ERROR -> ${e.message}`);
      const lines = content.split('\n');
      // Try to estimate line number from stack if available
      const match = e.stack && e.stack.match(/<anonymous>:(\d+):(\d+)/);
      if (match) {
        const errLine = parseInt(match[1], 10);
        const start = Math.max(0, errLine - 6);
        const end = Math.min(lines.length, errLine + 4);
        console.error(`Approx error at inline script line ${errLine} (relative). Showing context:`);
        for (let j = start; j < end; j++) {
          const num = j + 1;
          console.error(`${num}: ${lines[j]}`);
        }
      } else {
        console.error('Preview (first 60 lines):');
        for (let j = 0; j < Math.min(60, lines.length); j++) {
          const num = j + 1;
          console.error(`${num}: ${lines[j]}`);
        }
      }
      process.exit(1);
    }
  }
}
console.log('All inline scripts OK');

