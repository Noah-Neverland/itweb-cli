const path = require('path');
const ora = require('ora');
const {exec} = require('child_process');

function install(cmdPath, _) {
  const command = 'pnpm install';
  return new Promise(function (resolve, reject) {
    const spinner = ora(`正在安装依赖，请稍等...`);
    spinner.start();
    exec(
      command,
      {
        cwd: path.resolve(cmdPath),
      },
      (error) => {
        if (error) {
          spinner.fail(`依赖安装失败`);
          reject(error);
          return;
        }
        spinner.succeed(`依赖安装成功`);
        resolve();
      }
    );
  });
}

exports.install = install;
