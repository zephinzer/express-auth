var expect = require('chai').expect;
var express = require('express');
var ExpressAuth = require('../');
var Utility = require('../components/utility');
var Constant = require('../components/constant');

var expressAuthInstance = new ExpressAuth();
var app = express().use('/', expressAuthInstance);
var request = require('supertest');

describe('/access', function() {
	var happy = {data: null, response: null};
	var sad = {data: null, response: {}};
	var expectedToken = 'token';
	happy.data = {token: expectedToken};
	sad.data = {noToken: {}};
	before(function(done) {
		request(app).get('/access').query(happy.data).end(function(err, res) {
			happy.response = res;
			Object.keys(sad.data).forEach(function(sadDataId, index) {
				request(app).get('/access').query(sad.data[sadDataId]).end(function(err, res) {
					sad.response[sadDataId] = res;
					Object.keys(sad.response).length >= Object.keys(sad.data).length && done();
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
		expect(happy.response.body.status).to.equal(Constant.code.success.access);
	});

	it('returns the correct error response when parameters are not available', function() {
		var expectedErrorMessageForNoToken = Utility.createMissingParameterMessage('token');

		Object.keys(sad.response).forEach(function(sadDataType) {
			expect(sad.response[sadDataType].body.status).to.equal(Constant.code.error.requiredParamsNotFound);
			expect(sad.response[sadDataType].body.data).to.deep.equal({});
		});

		expect(sad.response.noToken.body.status).to.equal(Constant.code.error.requiredParamsNotFound);
		expect(sad.response.noToken.body.message).to.contain(expectedErrorMessageForNoToken);
	});
});
