var expect = require('chai').expect;
var express = require('express');
var request = require('supertest');

var Defaults = require('../components/defaults');
var ExpressAuth = require('../index');

describe('expressAuth', function() {
	it('can be instantiated with new ExpressAuth()', function() {
		expect(function() {
			new ExpressAuth();
		}).to.not.throw();
	});
	describe('.set()', function() {
		it('returns the ExpressAuth object', function() {
			expect(ExpressAuth.set('keys', ExpressAuth.get('keys'))).to.equal(ExpressAuth);
			expect(ExpressAuth.set(['keys'], ExpressAuth.get('keys'))).to.equal(ExpressAuth);
			expect(ExpressAuth.set(['slug', 'access'], ExpressAuth.get(['slug', 'access']))).to.equal(ExpressAuth);
		});
	});
	describe('.get()', function() {
		it('returns the correct option value', function() {
			expect(ExpressAuth.get('keys')).to.equal(Defaults.keys);
			expect(ExpressAuth.get(['keys'])).to.equal(Defaults.keys);
			expect(ExpressAuth.get(['slug', 'access'])).to.equal(Defaults.slug.access);
		});
	});
	describe('new ExpressAuth()', function() {
		var expressAuthInstance = new ExpressAuth();
		var routeStack = expressAuthInstance.stack;
		var paths = [];
		for(var i = 0; i < routeStack.length; ++i) { paths.push(routeStack[i].route.path); }
		it('implements the express.Router interface', function() {
			expect(Object.keys(expressAuthInstance)).to.deep.eq(Object.keys(new express.Router()));
		});
		it('has the correct endpoints', function() {
			expect(paths).to.contain('/access');
			expect(paths).to.contain('/login');
			expect(paths).to.contain('/logout');
			expect(paths).to.contain('/verify');
			expect(paths).to.contain('/forgot');
			expect(paths).to.contain('/register');
		});
	});
	describe('endpoints', function() {
		var expressAuthInstance = new ExpressAuth();
		var app = express().use('/', expressAuthInstance);

		describe('/access', function() {
			var happy = {
				data: null,
				response: null,
			};
			var sad = {
				data: null,
				response: null,
			};
			var expectedToken = 'token';
			happy.data = {token: expectedToken};
			sad.data = {noToken: expectedToken};
			before(function(done) {
				request(app).get('/access').query(happy.data).end(function(err, res) {
					happy.response = res;
					request(app).get('/access').query(sad.data).end(function(err, res) {
						sad.response = res;
						done();
					});
				});
			});
			it('returns the correct headers', function() {
				expect(happy.response.ok).to.be.true;
				expect(happy.response.statusCode).to.eq(200);
				expect(happy.response.type).to.eq('application/json');
				expect(happy.response.charset).to.eq('utf-8');
			});
			it('returns an error if `token` is not found', function() {
				expect(sad.response.ok).to.be.true;
				expect(sad.response.statusCode).to.eq(200);
				expect(sad.response.type).to.eq('application/json');
				expect(sad.response.charset).to.eq('utf-8');
			});
		});

		describe('/login', function() {

		});

		it('handles /logout', function() {

		});
		it('handles /verify', function() {

		});
		it('handles /register', function() {

		});
		it('handles /forgot', function() {

		});
	});
});
