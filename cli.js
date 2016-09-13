#!/usr/bin/env node

const path = require('path');

const repo = process.argv[2];

if (!repo) {
  help(1);
}

let dest = process.argv[3];

if (!dest) {
  help(2);
}

dest = path.normalize(path);

if (!path.isAbsolute(dest)) {
  dest = path.join(process.cwd(), dest);
}

require('./src/main')
  .main(repo, dest)
  .then(() => {
    console.log(`Cloned and built ${repo} outputted to ${dest}`);
  })
  .catch((err) => {
    console.log(`Fatal Error: ${err.message}`);
  });

function help(code) {
  console.log(`Usage: ${process.argv[0]} <repo> <dest>`);
  process.exit(code);
}
