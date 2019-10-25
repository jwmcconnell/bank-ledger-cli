const request = require('supertest');

const agent = request.agent('http://localhost:7890');

module.exports =  { getAgent: () => agent };
