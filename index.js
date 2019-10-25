const inquirer = require('inquirer');
const request = require('supertest');

const homePrompt = () => {
  inquirer.prompt([{
    name: 'homeOption',
    type: 'list',
    message: 'Please Choose one of the following options:',
    choices: ['Login', 'Create Account', 'Exit'],
  }]).then((answers) => {
    if(answers.homeOption === 'Login') return loginPrompt();
    if(answers.homeOption === 'Create Account') return createAccountPrompt();
  });
};

const createAccountPrompt = () => {
  inquirer.prompt([{
    name: 'username',
    type: 'input',
    message: 'username:',
  }, {
    name: 'password',
    type: 'password',
    message: 'password:'
  }]).then((answers) => {
    return request('http://localhost:7890')
      .post('/api/v1/auth/signup')
      .send({ username: answers.username, password: answers.password });
  }).then(res => {
    const { username } = res.body;
    console.log(`Welcome to Jack's Bank ${username}!`);
  });
};

const loginPrompt = () => {
  inquirer.prompt([{
    name: 'username',
    type: 'input',
    message: 'username:',
  }, {
    name: 'password',
    type: 'password',
    message: 'password:'
  }]).then((answers) => {
    return request('http://localhost:7890')
      .post('/api/v1/auth/login')
      .send({ username: answers.username, password: answers.password });
  }).then(res => {
    const { username } = res.body;
    console.log(`Welcome back to Jack's Bank ${username}!`);
  });
};

homePrompt();
