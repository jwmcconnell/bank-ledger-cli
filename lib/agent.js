const request = require('supertest');

const agent = request.agent('https://bank-ledger.herokuapp.com');

module.exports =  { getAgent: () => agent };
