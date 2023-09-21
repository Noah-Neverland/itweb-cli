#!/usr/bin/env node
const fs = require('fs');
const yargs = require('yargs');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const {inquirerPrompt} = require('./inquirer');
const {checkMkdirExists} = require('./copy');
const {install} = require('./manager');
const handlebars = require('handlebars');
const download = require('download-git-repo');
const {rmFsDirSync} = require('./utils');
const tplObj = require(`${__dirname}/template/template.json`);

yargs
  .usage('Usage: $0 <command> [options]')
  .version(require('../package').version)
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')
  .demandCommand(
    1,
    'A command is required. Pass --help to see all available commands an options.'
  )
  .command(
    ['create', 'c'],
    'create new project',
    (yargs) => {
      return yargs.options('name', {
        alias: 'n',
        demand: true,
        describe: '项目名称',
        type: 'string',
      });
    },
    (argv) => {
      const {name} = argv;
      if (!name) return console.log(chalk.red('\n 项目名称必填 \n '));
      const dirPath = path.resolve(process.cwd(), `./${name}`);
      const isMkdirExists = checkMkdirExists(dirPath);
      if (isMkdirExists)
        return console.log(chalk.red(`\n ${name}项目已存在！ \n `));
      inquirerPrompt(argv).then((answers) => {
        const {name, template} = answers;
        const {downloadUrl} = tplObj[template];
        if (!downloadUrl) return console.log(chalk.red('\n 模版取值失败 \n '));
        console.log(chalk.white('\n Start generating... \n'));
        const spinner = ora('Downloading...');
        spinner.start();
        // clone项目
        download(downloadUrl, name, {clone: true}, (err) => {
          if (err) {
            console.log('err===', err);
            return spinner.fail();
          }
          spinner.succeed();
          try {
            const packagePath = `${name}/package.json`;
            const packageContent = fs.readFileSync(packagePath, 'utf8');
            const packageResult = handlebars.compile(packageContent)(answers);
            // 将配置信息写进package.json文件里
            fs.writeFileSync(packagePath, packageResult);
            // 下载安装依赖
            install(dirPath, answers)
              .then(() => {
                console.log(chalk.grey(`\n cd ${name} `));
                console.log(chalk.grey(`\n pnpm serve \n`));
              })
              .catch((error) => console.log(chalk.red(`\n ${error} \n `)));
          } catch (error) {
            console.log(chalk.red(`\n ${error} \n `));
            rmFsDirSync(dirPath);
          }
        });
      });
    }
  )
  .command(
    ['template', 't'],
    'check template list',
    () => {},
    () => {
      for (let key in tplObj) {
        console.log(`${key} ｜ ${tplObj[key].description}`);
      }
    }
  )
  .options({
    name: {
      type: 'string',
      describe: '新建项目名称',
      alias: 'n',
    },
  })
  .group(['name'], 'create [options]').argv;
