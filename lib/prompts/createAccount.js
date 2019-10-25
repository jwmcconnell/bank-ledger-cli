const inquirer = require('inquirer');
const { getAgent } = require('../agent');

module.exports = () => {
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
    })
    .catch(err => {
      console.error(err);
    });
};
