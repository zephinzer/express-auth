var expect = require('chai').expect;
var sinon = require('sinon');
var Utility = require('../../components/utility');

describe('expressAuth/Utility', function() {
	describe('_throwIfTypeMismatch', function() {
		it('works as expected', function() {
			expect(function() {
				Utility._throwIfTypeMismatch('a', 1, 2);
				Utility._throwIfTypeMismatch('a', 'a', 'b');
				Utility._throwIfTypeMismatch('a', {a: 'a'}, {a: 'a'});
			}).to.not.throw();
		});
		it('throws a TypeError if the current value of the key is different from the provided value', function() {
			expect(function() { Utility._throwIfTypeMismatch('a', 1, 'a'); }).to.throw(TypeError);
			expect(function() { Utility._throwIfTypeMismatch('a', 'a', 1); }).to.throw(TypeError);
			expect(function() { Utility._throwIfTypeMismatch('a', 'a', {}); }).to.throw(TypeError);
			expect(function() { Utility._throwIfTypeMismatch('a', {}, 'a'); }).to.throw(TypeError);
			expect(function() { Utility._throwIfTypeMismatch('a', 1, {}); }).to.throw(TypeError);
			expect(function() { Utility._throwIfTypeMismatch('a', {}, 1); }).to.throw(TypeError);
		});
	});

	describe('_throwInvalidOptionKey', function() {
		it('throws a TypeError', function() {
			expect(function() { Utility._throwInvalidOptionKey().to.throw(TypeError); }).to.throw();
		});
	});

	describe('_throwUndersizedKeyArray', function() {
		it('throws a TypeError', function() {
			expect(function() { Utility._throwUndersizedKeyArray().to.throw(TypeError); }).to.throw();
		});
	});

	describe('_throwOversizedKeyArray', function() {
		it('throws a TypeError', function() {
			expect(function() { Utility._throwOversizedKeyArray().to.throw(TypeError); }).to.throw();
		});
	});

	describe('.createMissingParameterMessage()', function() {
		it('(parameterKey : String)', function() {
			expect(Utility.createMissingParameterMessage('expectedParamKey'))
				.to.equal('Required parameter `expectedParamKey` was not found');
		});
	});

	describe('.createMissingParameterResponse()', function() {
		it('calls createResponse to generate the response object', function() {
			var createResponseStub = sinon.stub(Utility, 'createResponse');
			Utility.createMissingParameterResponse('a');
			expect(createResponseStub.callCount).to.equal(1);
			createResponseStub.restore();
		});
		it('calls createMissingParameterMessage to generate the message', function() {
			var createMissingParameterMessageStub = sinon.stub(Utility, 'createMissingParameterMessage');
			Utility.createMissingParameterResponse('a');
			expect(createMissingParameterMessageStub.callCount).to.equal(1);
			createMissingParameterMessageStub.restore();
		});
	});

	describe('.createResponse', function() {
		var responseStatus = 'status';
		var responseMessage = 'message';
		var responseData = {data: 0};
		it('creates a standardized API response schema', function() {
			var expectedReturnedKeys = ['status', 'message', 'data'];
			var responseObject = Utility.createResponse(responseStatus, responseMessage, responseData);
			expect(Object.keys(responseObject)).to.deep.eq(expectedReturnedKeys);
		});
		it('returns the correct data', function() {
			var responseObject = Utility.createResponse(responseStatus, responseMessage, responseData);
			expect(responseObject.status).to.eq(responseStatus);
			expect(responseObject.message).to.eq(responseMessage);
			expect(responseObject.data).to.eq(responseData);
		});
	});

	describe('.parseRequestForParams', function() {
		it('retrieves GET/DELETE data from `query`', function() {
			var params = {get_a: 'get-a', get_b: 'get-b'};
			expect(Utility.parseRequestForParams({method: 'get', query: params})).to.deep.equal(params);
			expect(Utility.parseRequestForParams({method: 'delete', query: params})).to.deep.equal(params);
		});
		it('retrieves POST/PUT data from `body`', function() {
			var params = {get_a: 'get-a', get_b: 'get-b'};
			expect(Utility.parseRequestForParams({method: 'post', body: params})).to.deep.equal(params);
			expect(Utility.parseRequestForParams({method: 'put', body: params})).to.deep.equal(params);
		});
	});

	describe('option', function() {
		var testOptions = {
			string: 'a',
			number: 1,
			nestedObject: {
				withNestedObject: {
					withNestedObject: {
						withNestedObject: {
							string: 'a',
							number: 1,
						},
						string: 'a',
						number: 1,
					},
					string: 'a',
					number: 1,
				},
				string: 'a',
				number: 1,
			},
		};
		describe('.get', function() {
			it('(optionKey : String)', function() {
				expect(Utility.option.get.bind(testOptions)('number')).to.equal(testOptions.number);
				expect(Utility.option.get.bind(testOptions)('string')).to.equal(testOptions.string);
				expect(Utility.option.get.bind(testOptions)('nestedObject')).to.equal(testOptions.nestedObject);
			});
			it('throws TypeError if :optionKey is not an Array or String', function() {
				expect(function() { Utility.option.get.bind(testOptions)(1); }).to.throw(TypeError);
				expect(function() { Utility.option.get.bind(testOptions)({}); }).to.throw(TypeError);
			});
			it('throws EvalError if :optionKey is an Array of size 0', function() {
				expect(function() { Utility.option.get.bind(testOptions)([]); }).to.throw(EvalError);
			});
		});

		describe('.set', function() {
			var expectedString = 'b';
			var expectedNumber = 2;
			it('(optionKey : String, optionValue : Any)', function() {
				Utility.option.set.bind(testOptions)('string', expectedString);
				expect(testOptions.string).to.equal(expectedString);
				Utility.option.set.bind(testOptions)('number', expectedNumber);
				expect(testOptions.number).to.equal(expectedNumber);
			});
			it('(optionKey : Array<String>[1]>, optionValue : Any)', function() {
				Utility.option.set.bind(testOptions)(['string'], expectedString);
				expect(testOptions.string).to.equal(expectedString);
				Utility.option.set.bind(testOptions)(['number'], expectedNumber);
				expect(testOptions.number).to.equal(expectedNumber);
			});
			it('(optionKey : Array<String>[2], optionValue : Any)', function() {
				Utility.option.set.bind(testOptions)(['nestedObject', 'string'], expectedString);
				expect(testOptions.string).to.equal(expectedString);
				Utility.option.set.bind(testOptions)(['nestedObject', 'number'], expectedNumber);
				expect(testOptions.nestedObject.number).to.equal(expectedNumber);
			});
			it('(optionKey : Array<String>[3], optionValue : Any)', function() {
				Utility.option.set.bind(testOptions)(['nestedObject', 'withNestedObject', 'string'], expectedString);
				expect(testOptions.nestedObject.withNestedObject.string).to.equal(expectedString);
				Utility.option.set.bind(testOptions)(['nestedObject', 'withNestedObject', 'number'], expectedNumber);
				expect(testOptions.nestedObject.withNestedObject.number).to.equal(expectedNumber);
			});
			it('(optionKey : Array<String>[4], optionValue : Any)', function() {
				Utility.option.set.bind(testOptions)(
					['nestedObject', 'withNestedObject', 'withNestedObject', 'string'], expectedString
				);
				expect(testOptions.nestedObject.withNestedObject.withNestedObject.string).to.equal(expectedString);
				Utility.option.set.bind(testOptions)(
					['nestedObject', 'withNestedObject', 'withNestedObject', 'number'], expectedNumber
				);
				expect(testOptions.nestedObject.withNestedObject.withNestedObject.number).to.equal(expectedNumber);
			});
			it('throws TypeError if the type of the value of the key being changed does not match provided value', function() {
				expect(function() { Utility.option.set.bind(testOptions)('number', expectedString); }).to.throw(TypeError);
				expect(function() { Utility.option.set.bind(testOptions)('string', expectedNumber); }).to.throw(TypeError);
				expect(function() { Utility.option.set.bind(testOptions)(['number'], expectedString); }).to.throw(TypeError);
				expect(function() { Utility.option.set.bind(testOptions)(['string'], expectedNumber); }).to.throw(TypeError);
			});
			it('throws TypeError if :optionKey is not an Array or String', function() {
				expect(function() { Utility.option.set.bind(testOptions)(1, expectedNumber); }).to.throw(TypeError);
				expect(function() { Utility.option.set.bind(testOptions)({}, expectedNumber); }).to.throw(TypeError);
			});
			it('throws EvalError if :optionKey is an Array of size 0', function() {
				expect(function() { Utility.option.set.bind(testOptions)([], expectedNumber); }).to.throw(EvalError);
			});
		});
	});
});
