const request = require('supertest');

const agent = request.agent('http://localhost:3000');

module.exports =  { getAgent: () => agent };
