const fs = require('fs');
const path = require('path');

const root = __dirname;
const dist = path.join(root, 'dist');
const includes = path.join(root, 'includes');

const navbar = fs.readFileSync(path.join(includes, 'navbar.html'), 'utf8');
const header = fs.readFileSync(path.join(includes, 'header.html'), 'utf8');

const skip = new Set(['build.js', 'package.json', 'README.md', 'dist', 'includes']);

function highlightCurrent(nav, page) {
  return nav.replace(/(<a\s+href=['"])([^'"]+)(['"][^>]*>)/g, (m, p1, href, p3) => {
    if (href.replace(/^\//, '') === page && !/id=/.test(m)) {
      return `${p1}${href}${p3.slice(0, -1)} id="currentPage">`;
    }
    return m;
  });
}

function process(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest);

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;

    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      process(from, to);
    } else {
      let content = fs.readFileSync(from, 'utf8');

      if (entry.name.endsWith('.html')) {
        const rel = path.relative(root, from).split(path.sep);
        const page = rel.length === 1 ? entry.name : rel[0] + '.html';
        content = content
          .replace('<!-- NAVBAR_INCLUDE -->', highlightCurrent(navbar, page))
          .replace('<!-- HEADER_INCLUDE -->', header);
        console.log(`Processed ${from} → ${to} (page: ${page})`);
      }

      fs.writeFileSync(to, content);
    }
  }
}

process(root, dist);