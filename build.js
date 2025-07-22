const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, 'assets', 'navbar.html');
const sourceDir = __dirname;
const outputDir = path.join(__dirname, 'dist');

const navbarHTML = fs.readFileSync(navbarPath, 'utf8');

const filesToSkip = ['build.js', 'package.json', 'README.md'];

function processFolder(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest);

  const items = fs.readdirSync(src, { withFileTypes: true });
  items.forEach(item => {
    if (item.isDirectory() && item.name === 'dist') return;
    if (item.isFile() && filesToSkip.includes(item.name)) return;

    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      processFolder(srcPath, destPath);
    } else if (item.isFile() && item.name.endsWith('.html') && item.name !== 'navbar.html') {
      let content = fs.readFileSync(srcPath, 'utf8');
      content = content.replace('<!-- NAVBAR_INCLUDE -->', navbarHTML);
      fs.writeFileSync(destPath, content, 'utf8');
      console.log(`Processed ${srcPath} → ${destPath}`);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

processFolder(sourceDir, outputDir);