var expect = require('chai').expect;
var express = require('express');
var Sequelize = require('sequelize');
var validator = require('validator');

var ExpressAuth = require('../');
var utility = require('../components/utility');
var Constant = require('../components/constant');

var expressAuthInstance = new ExpressAuth();
var app = express().use('/', expressAuthInstance);
var request = require('supertest');

describe('/verify', function() {
  var COLUMN_NAMES = ExpressAuth.get(['model', 'sequelize', 'config', 'names']);
  var expected = {
    email: 'email@address.com',
    password: 'password',
    nonce: 'nonce_token',
    session: 'session_token',
  };
  var expectedAccount = {
    [COLUMN_NAMES.columnEmail]: expected.email,
    [COLUMN_NAMES.columnPassword]: expected.password,
    [COLUMN_NAMES.columnNonce]: expected.nonce,
    [COLUMN_NAMES.columnSession]: expected.session,
  };
  var happy = {data: null, response: null};
	var sad = {data: null, response: {}};
	happy.data = {token: expected.nonce};
	sad.data = {noToken: {}};


	before(function(done) {
    ExpressAuth.set(['model', 'sequelize', 'config', 'extraColumns'], {
      createdAt: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
      updatedAt: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
    });
    sequelize = new Sequelize(ExpressAuth.get(['model', 'sequelize', 'config']).get());
    sequelize.authenticate().then(function() {
      Account = ExpressAuth.get(['model', 'sequelize', 'config']).model(sequelize);
      Account.create(expectedAccount)
        .then(function(res) {
          request(app).get('/verify').query(happy.data).end(function(err, res) {
            happy.response = res;
            Object.keys(sad.data).forEach(function(sadDataId, index) {
              request(app).get('/verify').query(sad.data[sadDataId]).end(function(err, res) {
                sad.response[sadDataId] = res;
                (Object.keys(sad.response).length >= Object.keys(sad.data).length) && done();
              });
            });
          });
        })
        .catch(function(err) { done(err); });
    }).catch(function(err) { done(err); });
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
    var token = happy.response.body.data.token;
    var tokenSections = token.split('.');
    tokenSections.forEach(function(section) {
      expect(validator.isAscii(section)).to.be.true;
    });
		expect(happy.response.body.message).to.equal(null);
		expect(happy.response.body.status).to.equal(Constant.code.success.verify);
	});

	it('returns the correct error response when parameters are not available', function() {
		var expectedErrorMessageForNoToken = utility.createMissingParameterMessage('token');
		Object.keys(sad.response).forEach(function(sadDataType) {
			expect(sad.response[sadDataType].body.status).to.equal(Constant.code.error.requiredParamsNotFound);
			expect(sad.response[sadDataType].body.data).to.deep.equal({});
		});
		expect(sad.response.noToken.body.message).to.contain(expectedErrorMessageForNoToken);
	});
});
