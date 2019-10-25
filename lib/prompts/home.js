const inquirer = require('inquirer');
const login = require('./login');
const createAccount = require('./createAccount');

module.exports = () => {
  inquirer.prompt([{
    name: 'homeOption',
    type: 'list',
    message: 'Please Choose one of the following options:',
    choices: ['Login', 'Create Account', 'Exit'],
  }]).then((answers) => {
    if(answers.homeOption === 'Login') return login();
    if(answers.homeOption === 'Create Account') return createAccount();
  });
};
