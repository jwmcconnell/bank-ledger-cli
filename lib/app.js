/* eslint-disable no-console */
const inquirer = require('inquirer');
const chalk = require('chalk');
const { getAgent } = require('./agent');

const home = async() => {
  inquirer.prompt([{
    name: 'homeOption',
    type: 'list',
    message: 'Please choose one of the following options:',
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
      if(!res.ok) {
        console.log(chalk.red(res.body.message));
        return home();
      }
      const { username } = res.body;
      console.log(chalk.green(`Welcome to Jack's Bank ${username}!`));
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
        console.log(chalk.red(res.body.message));
        return home();
      }
      const { username } = res.body;
      console.log(chalk.green(`Welcome back to Jack's Bank ${username}!`));
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
    message: 'Please choose one of the following options:',
    choices: [
      'Check Balance', 
      'Make Deposit', 
      'Make Withdrawal', 
      'Check Transactions', 
      'Log Out'
    ],
  }]).then(answer => {
    if(answer.choice === 'Check Balance') return checkBalance();
    if(answer.choice === 'Make Deposit') return makeDeposit();
    if(answer.choice === 'Make Withdrawal') return makeWithdrawal();
    if(answer.choice === 'Check Transactions') return getTransactions();
    if(answer.choice === 'Log Out') return home();
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

const makeDeposit = () => {
  inquirer.prompt([{
    name: 'amount',
    type: 'number',
    message: 'Please type the desired deposit amount:'
  }])
    .then(answer => {
      if(isNaN(answer.amount)) {
        return {
          ok: false,
          body: {
            message: 'Deposit failed. Please input a number to make a deposit'
          }
        };
      }
      return getAgent()
        .post('/api/v1/ledger/deposit')
        .send({ amount: answer.amount });
    })
    .then(res => {
      if(!res.ok) {
        console.log(chalk.red(res.body.message));
        return ledger();
      }
      console.log(chalk.green('Balance:', res.body.balance));
      return ledger();
    });
};

const makeWithdrawal = () => {
  inquirer.prompt([{
    name: 'amount',
    type: 'number',
    message: 'Please type the desired withdrawal amount:'
  }])
    .then(answer => {
      if(isNaN(answer.amount)) {
        return {
          ok: false,
          body: {
            message: 'Withdrawal failed. Please input a number to make a withdrawal'
          }
        };
      }
      return getAgent()
        .post('/api/v1/ledger/withdrawal')
        .send({ amount: answer.amount });
    })
    .then(res => {
      if(!res.ok) {
        console.log(chalk.red(res.body.message));
        return ledger();
      }
      console.log(chalk.green('Balance:', res.body.balance));
      return ledger();
    });
};

const getTransactions = () => {
  return getAgent()
    .get('/api/v1/ledger/transactions')
    .then(res => {
      if(res.body.length) console.table(res.body);
      else console.log(chalk.green('You have not made any transactions.'));
      return ledger();
    });
};

module.exports = { home };
