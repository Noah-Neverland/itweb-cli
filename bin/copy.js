const fs = require('fs');
const path = require('path');
const copydir = require('copy-dir');
const Mustache = require('mustache');

function mkdirGuard(target) {
  try {
    fs.mkdirSync(target, {recursive: true});
  } catch (e) {
    mkdirp(target);
    function mkdirp(dir) {
      if (fs.existsSync(dir)) {
        return true;
      }
      const dirname = path.dirname(dir);
      mkdirp(dirname);
      fs.mkdirSync(dir);
    }
  }
}

function readTemplate(path, data = {}) {
  const str = fs.readFileSync(path, {encoding: 'utf8'});
  return Mustache.render(str, data);
}

function copyDir(from, to, options) {
  mkdirGuard(to);
  copydir.sync(from, to, options);
}

function copyFile(from, to) {
  const buffer = fs.readFileSync(from);
  const parentPath = path.dirname(to);

  mkdirGuard(parentPath);

  fs.writeFileSync(to, buffer);
}

function copyTemplate(from, to, data = {}) {
  if (path.extname(from) !== '.tpl') {
    return copyFile(from, to);
  }
  const parentToPath = path.dirname(to);
  mkdirGuard(parentToPath);
  fs.writeFileSync(to, readTemplate(from, data));
}

function checkMkdirExists(path) {
  return fs.existsSync(path);
}

exports.checkMkdirExists = checkMkdirExists;
exports.mkdirGuard = mkdirGuard;
exports.copyDir = copyDir;
exports.copyFile = copyFile;
exports.copyTemplate = copyTemplate;
