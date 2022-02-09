const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const supertest = require('supertest');

const { expect } = chai;
chai.use(sinonChai);

module.exports = {
  sinon,
  chai,
  expect,
  supertest,
};
