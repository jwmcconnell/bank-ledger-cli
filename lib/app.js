const inquirer = require('inquirer');
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
      const { username } = res.body;
      console.log(`Welcome to Jack's Bank ${username}!`);
      home();
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
      const { username } = res.body;
      console.log(`Welcome back to Jack's Bank ${username}!`);
      home();
    })
    .catch(err => {
      console.error(err);
    });
};

module.exports = { home };
