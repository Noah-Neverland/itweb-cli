const inquirer = require('inquirer');
const tplObj = require(`${__dirname}/template/template.json`);
const templateOptions = Object.keys(tplObj);

function inquirerPrompt(argv) {
  const {name} = argv;
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: '项目名称',
          default: name,
          validate: (val) => {
            if (val === '') return '项目名称必填';
            return true;
          },
        },
        {
          name: 'description',
          type: 'input',
          message: '请输入项目介绍',
          default: 'itweb-cli',
        },
        {
          name: 'author',
          type: 'input',
          message: '请输入作者',
          default: 'ssh',
        },
        {
          type: 'list',
          name: 'template',
          message: '模板选项',
          choices: [...templateOptions],
        },
      ])
      .then((answers) => {
        resolve(answers);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

exports.inquirerPrompt = inquirerPrompt;
