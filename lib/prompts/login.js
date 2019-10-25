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
        .post('/api/v1/auth/login')
        .withCredentials()
        .send({ username: answers.username, password: answers.password });
    })
    .then(res => {
      const { username } = res.body;
      console.log(`Welcome back to Jack's Bank ${username}!`);
      console.log(res.header);
      return getAgent()
        .get('/api/v1/auth/verify')
        .withCredentials()
        .set('credentails', 'true');
    })
    .then(res => {
      console.log('checking cookies', res.body);
    })
    .catch(err => {
      console.error(err);
    });
};
