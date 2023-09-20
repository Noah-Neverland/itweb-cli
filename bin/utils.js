const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');

/**
 * @name: 利用node方法删除
 * @param {*} folderPath
 * @return {*}
 */
function rmFsDirSync(folderPath) {
  // 判断文件夹是否存在
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        rmFsDirSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

/**
 * @name: cmd删除
 * @param {*} dir
 * @return {*}
 */
function rmCmdDir(dir) {
  const command = `rm -rf ${dir}`;
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject('删除失败');
      }
      resolve();
    });
  });
}

exports.rmCmdDir = rmCmdDir;
exports.rmFsDirSync = rmFsDirSync;
