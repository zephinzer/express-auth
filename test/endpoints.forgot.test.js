var expect = require('chai').expect;
var express = require('express');
var ExpressAuth = require('../');
var Utility = require('../components/utility');
var Constant = require('../components/constant');

var expressAuthInstance = new ExpressAuth();
var app = express().use('/', expressAuthInstance);
var request = require('supertest');

describe('/forgot', function() {
	var happy = {data: null, response: null};
	var sad = {data: null, response: {}};
	var expectedToken = 'token';
	happy.data = {email: expectedToken};
	sad.data = {noEmail: {}};
	before(function(done) {
		request(app).get('/forgot').query(happy.data).end(function(err, res) {
			happy.response = res;
			Object.keys(sad.data).forEach(function(sadDataId, index) {
				request(app).get('/forgot').query(sad.data[sadDataId]).end(function(err, res) {
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
		expect(happy.response.body.data).to.equal(true);
		expect(happy.response.body.message).to.equal(null);
		expect(happy.response.body.status).to.equal(Constant.code.success.forgot);
	});

	it('returns the correct error response when parameters are not available', function() {
		var expectedErrorMessageForNoEmail = Utility.createMissingParameterMessage('email');

		Object.keys(sad.response).forEach(function(sadDataType) {
			expect(sad.response[sadDataType].body.status).to.equal(Constant.code.error.requiredParamsNotFound);
			expect(sad.response[sadDataType].body.data).to.deep.equal({});
		});

		expect(sad.response.noEmail.body.status).to.equal(Constant.code.error.requiredParamsNotFound);
		expect(sad.response.noEmail.body.message).to.contain(expectedErrorMessageForNoEmail);
	});
});
