const fs = require('fs');
const path = require('path');

const root = __dirname;
const dist = path.join(root, 'dist');
const includes = path.join(root, 'includes');

const navbar = fs.readFileSync(path.join(includes, 'navbar.html'), 'utf8');
const header = fs.readFileSync(path.join(includes, 'header.html'), 'utf8');

const skip = new Set(['build.js', 'package.json', 'README.md', 'dist', 'includes']);

function highlightCurrent(nav, page) {
    return nav.replace(/(<a\s+href=['"])([^'"]+)(['"][^>]*>)/g, (match, p1, href, p3) => {
        if (href.replace(/^\//, '') === page && !/id=/.test(match)) {
        return `${p1}${href}${p3.slice(0, -1)} id="currentPage">`;
        }
        return match;
    });
    }

function copyFileSync(source, target) {
    if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
        target = path.join(target, path.basename(source));
    }
    fs.writeFileSync(target, fs.readFileSync(source));
}

function process(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);

    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        if (skip.has(entry.name)) continue;

        const from = path.join(src, entry.name);
        const to = path.join(dest, entry.name);

        if (entry.isDirectory()) {
        process(from, to);
        } else if (entry.name.endsWith('.html')) {
        let content = fs.readFileSync(from, 'utf8');
        const rel = path.relative(root, from).split(path.sep);
        const page = rel.length === 1 ? entry.name : rel[0] + '.html';
        content = content
            .replace('<!-- NAVBAR_INCLUDE -->', highlightCurrent(navbar, page))
            .replace('<!-- HEADER_INCLUDE -->', header);
        fs.writeFileSync(to, content);
        } else {
        copyFileSync(from, to);
        }
    }
}

process(root, dist);