var expect = require('chai').expect;
var express = require('express');
var Sequelize = require('sequelize');

var ExpressAuth = require('../');
var Utility = require('../components/utility');
var Constant = require('../components/constant');

var request = require('supertest');

describe('/login', function() {
	var happy = {data: null, response: null};
	var sad = {data: null, response: {}};
	var expectedUserId = 'endpoints.login.test@address.com';
	var expectedPassword = 'password';
	registrationData = {
		'email': expectedUserId,
		'password': expectedPassword,
		'password-confirmation': expectedPassword,
	};
	happy.data = {
		'user-id': expectedUserId,
		'password': expectedPassword,
	};
	sad.data = {
		noUserId: {
			'password': expectedPassword,
		},
		noPassword: {
			'user-id': expectedUserId,
		},
		nothing: {},
	};
	before(function(done) {
    ExpressAuth.set(['model', 'sequelize', 'config', 'extraColumns'], {
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
    app = express();
    app.use('/', new ExpressAuth());
    request(app).get('/register').query(registrationData).end(function(err, res) {
      request(app).get('/login').query(happy.data).end(function(err, res) {
        happy.response = res;
        Object.keys(sad.data).forEach(function(sadDataId, index) {
          request(app).get('/login').query(sad.data[sadDataId]).end(function(err, res) {
            sad.response[sadDataId] = res;
            (Object.keys(sad.response).length >= Object.keys(sad.data).length) && done();
          });
        });
      });
    });
	});

	it('returns the correct headers', function() {
		expect(happy.response.ok).to.be.true;
		expect(happy.response.statusCode).to.eq(200);
		expect(happy.response.type).to.eq('application/json');
  expect(happy.response.charset).to.eq('utf-8');
		for(var sadResponseIndex = 0; sadResponseIndex < sad.response.length; ++sadResponseIndex) {
			var sadResponse = sad.response[sadResponseIndex];
			expect(sadResponse.ok).to.be.true;
			expect(sadResponse.statusCode).to.eq(200);
			expect(sadResponse.type).to.eq('application/json');
			expect(sadResponse.charset).to.eq('utf-8');
		}
	});

	it('returns the correct success response when all parameters are available and valid', function() {
		expect(happy.response.body.data).to.have.key('token');
		expect(happy.response.body.message).to.equal(null);
		expect(happy.response.body.status).to.equal(Constant.code.success.login);
	});

	it('returns the correct error response when parameters are not available', function() {
		var expectedErrorMessageForNoUserId = Utility.createMissingParameterMessage('user-id');
		var expectedErrorMessageForNoPassword = Utility.createMissingParameterMessage('password');
		var expectedErrorMessageForNothing = Utility.createMissingParameterMessage('user-id,password');

		Object.keys(sad.response).forEach(function(sadDataType) {
			expect(sad.response[sadDataType].body.status).to.equal(Constant.code.error.requiredParamsNotFound);
			expect(sad.response[sadDataType].body.data).to.deep.equal({});
		});

		expect(sad.response.noUserId.body.message).to.contain(expectedErrorMessageForNoUserId);
		expect(sad.response.noPassword.body.message).to.contain(expectedErrorMessageForNoPassword);
		expect(sad.response.nothing.body.message).to.contain(expectedErrorMessageForNothing);
	});
});
