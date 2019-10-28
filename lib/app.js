const inquirer = require('inquirer');
const chalk = require('chalk');
const { getAgent } = require('./agent');

const home = async() => {
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

const createAccount = () => {
  inquirer.prompt([{
    name: 'username',
    type: 'input',
    message: 'username:',
  }, {
    name: 'password',
    type: 'password',
    message: 'password:'
  }])
    .then((answers) => {
      return getAgent()
        .post('/api/v1/auth/signup')
        .send({ username: answers.username, password: answers.password });
    })
    .then(res => {
      console.log(res.body);
      const { username } = res.body;
      console.log(`Welcome to Jack's Bank ${username}!`);
      ledger();
    })
    .catch(err => {
      console.error(err);
    });
};

const login = () => {
  inquirer.prompt([{
    name: 'username',
    type: 'input',
    message: 'username:',
  }, {
    name: 'password',
    type: 'password',
    message: 'password:'
  }])
    .then((answers) => {
      return getAgent()
        .post('/api/v1/auth/login')
        .withCredentials()
        .send({ username: answers.username, password: answers.password });
    })
    .then(res => {
      if(!res.ok) {
        console.log(res.body.message);
        return home();
      }
      const { username } = res.body;
      console.log(`Welcome back to Jack's Bank ${username}!`);
      return ledger();
    })
    .catch(err => {
      console.error(err);
    });
};

const ledger = () => {
  inquirer.prompt([{
    name: 'choice',
    type: 'list',
    message: 'Please Choose one of the following options:',
    choices: ['Check Balance', 'Record a deposit', 'Make Withdrawal', 'Check Transactions', 'Log Out'],
  }]).then(answer => {
    if(answer.choice === 'Check Balance') return checkBalance();
  });
};

const checkBalance = () => {
  return getAgent()
    .get('/api/v1/ledger/balance')
    .then(res => {
      console.log(chalk.green('Balance:', res.body.balance));
      return ledger();
    });
};

module.exports = { home };
