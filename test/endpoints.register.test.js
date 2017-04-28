var expect = require('chai').expect;
var express = require('express');
var Sequelize = require('sequelize');

var ExpressAuth = require('../');
var Utility = require('../components/utility');
var Constant = require('../components/constant');

// var expressAuthInstance = new ExpressAuth();
// var app = express().use('/', expressAuthInstance);
var request = require('supertest');

describe('/register', function() {
	var happy = {data: null, response: null};
	var sad = {data: null, response: {}};
	var expectedEmail = 'email@address.com';
	var expectedPassword = 'password';
	var expectedPasswordConfirmation = 'password';
  var app;
	happy.data = {
		'email': expectedEmail,
		'password': expectedPassword,
		'password-confirmation': expectedPasswordConfirmation,
	};
	sad.data = {
		noEmail: {
			'password': expectedPassword,
			'password-confirmation': expectedPasswordConfirmation,
		},
		noPassword: {
			'email': expectedEmail,
			'password-confirmation': expectedPasswordConfirmation,
		},
		noPasswordConfirmation: {
			'email': expectedEmail,
			'password': expectedPassword,
		},
		emailOnly: {
			'email': expectedEmail,
		},
		passwordConfirmationOnly: {
			'password-confirmation': expectedPasswordConfirmation,
		},
		passwordOnly: {
			'password': expectedPasswordConfirmation,
		},
		nothing: {},
	};

  var originalExtraColumns = ExpressAuth.get(['model', 'sequelize', 'config', 'extraColumns']);
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
		request(app).get('/register').query(happy.data).end(function(err, res) {
			happy.response = res;
			Object.keys(sad.data).forEach(function(sadDataId, index) {
				request(app).get('/register').query(sad.data[sadDataId]).end(function(err, res) {
					sad.response[sadDataId] = res;
					Object.keys(sad.response).length >= Object.keys(sad.data).length && done();
				});
			});
		});
	});

  after(function() {
    ExpressAuth.set(['model', 'sequelize', 'config', 'extraColumns'], originalExtraColumns);
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
    var columnNames = ExpressAuth.get(['model', 'sequelize', 'config', 'names']);
		expect(happy.response.body.data).to.be.a('object');
    expect(happy.response.body.data).to.have.keys([
      columnNames.columnEmail,
    ]);
		expect(happy.response.body.message).to.equal(null);
		expect(happy.response.body.status).to.equal(Constant.code.success.register);
	});

	it('returns the correct error response when parameters are not available', function() {
		var expectedErrorMessageForNoEmail = Utility.createMissingParameterMessage('email');
		var expectedErrorMessageForNoPassword = Utility.createMissingParameterMessage('password');
		var expectedErrorMessageForNoPasswordConfirmation = Utility.createMissingParameterMessage('password-confirmation');
		var expectedErrorMessageForEmailOnly = Utility.createMissingParameterMessage('password,password-confirmation');
		var expectedErrorMessageForPasswordConfirmationOnly = Utility.createMissingParameterMessage('email,password');
		var expectedErrorMessageForPasswordOnly = Utility.createMissingParameterMessage('email,password-confirmation');
		var expectedErrorMessageForNothing = Utility.createMissingParameterMessage('email,password,password-confirmation');

		Object.keys(sad.response).forEach(function(sadDataType) {
			expect(sad.response[sadDataType].body.status).to.equal(Constant.code.error.requiredParamsNotFound);
			expect(sad.response[sadDataType].body.data).to.deep.equal({});
		});

		expect(sad.response.noEmail.body.message).to.contain(expectedErrorMessageForNoEmail);
		expect(sad.response.noPassword.body.message).to.contain(expectedErrorMessageForNoPassword);
		expect(sad.response.noPasswordConfirmation.body.message).to.contain(expectedErrorMessageForNoPasswordConfirmation);
		expect(sad.response.emailOnly.body.message).to.contain(expectedErrorMessageForEmailOnly);
		expect(sad.response.passwordConfirmationOnly.body.message).to.contain(expectedErrorMessageForPasswordConfirmationOnly);
		expect(sad.response.passwordOnly.body.message).to.contain(expectedErrorMessageForPasswordOnly);
		expect(sad.response.nothing.body.message).to.contain(expectedErrorMessageForNothing);
	});
});
