var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var tokenizerJwt = require('../../../components/tokenizer').jwt;

describe('expressAuth/tokenizerJwt/JWT', function() {
	var payload = {
		should: 'should',
		be: true,
		equal: 4,
		and: {
			canBe: ['nested', 'arrays'],
		},
	};
	var password = 'password';
	var privateKey1024 = fs.readFileSync(path.join(__dirname, '/test_key_1024.pem')).toString();
	var publicKey1024 = fs.readFileSync(path.join(__dirname, '/test_key_1024.pem.pub')).toString();
	var privateKey2048 = fs.readFileSync(path.join(__dirname, '/test_key_2048.pem')).toString();
	var publicKey2048 = fs.readFileSync(path.join(__dirname, '/test_key_2048.pem.pub')).toString();
	var privateKey4096 = fs.readFileSync(path.join(__dirname, '/test_key_4096.pem')).toString();
	var publicKey4096 = fs.readFileSync(path.join(__dirname, '/test_key_4096.pem.pub')).toString();
	var privateKey8192 = fs.readFileSync(path.join(__dirname, '/test_key_8192.pem')).toString();
	var publicKey8192 = fs.readFileSync(path.join(__dirname, '/test_key_8192.pem.pub')).toString();

	it('can encode/decode a payload given a password', function() {
		var fullCyclePayload = tokenizerJwt.symmetric.decode(
			tokenizerJwt.symmetric.encode(payload, password), password
		);
		Object.keys(payload).forEach(function(key) {
			expect(fullCyclePayload).to.contain.key(key);
			expect(fullCyclePayload[key]).to.deep.equal(payload[key]);
		});
	});

	it('can encode/decode a payload given a 1024-bit private/public key pair', function() {
		var fullCyclePayload1024 = tokenizerJwt.asymmetric.decode(
			tokenizerJwt.asymmetric.encode(payload, privateKey1024), publicKey1024
		);
		Object.keys(payload).forEach(function(key) {
			expect(fullCyclePayload1024).to.contain.key(key);
			expect(fullCyclePayload1024[key]).to.deep.equal(payload[key]);
		});
	});

	it('can encode/decode a payload given a 2048-bit private/public key pair', function() {
		var fullCyclePayload2048 = tokenizerJwt.asymmetric.decode(
			tokenizerJwt.asymmetric.encode(payload, privateKey2048), publicKey2048
		);
		Object.keys(payload).forEach(function(key) {
			expect(fullCyclePayload2048).to.contain.key(key);
			expect(fullCyclePayload2048[key]).to.deep.equal(payload[key]);
		});
	});

	it('can encode/decode a payload given a 4096-bit private/public key pair', function() {
		var fullCyclePayload4096 = tokenizerJwt.asymmetric.decode(
			tokenizerJwt.asymmetric.encode(payload, privateKey4096), publicKey4096
		);
		Object.keys(payload).forEach(function(key) {
			expect(fullCyclePayload4096).to.contain.key(key);
			expect(fullCyclePayload4096[key]).to.deep.equal(payload[key]);
		});
	});

	it('can encode/decode a payload given a 8192-bit private/public key pair', function() {
		var fullCyclePayload8192 = tokenizerJwt.asymmetric.decode(
			tokenizerJwt.asymmetric.encode(payload, privateKey8192), publicKey8192
		);
		Object.keys(payload).forEach(function(key) {
			expect(fullCyclePayload8192).to.contain.key(key);
			expect(fullCyclePayload8192[key]).to.deep.equal(payload[key]);
		});
	});
});
