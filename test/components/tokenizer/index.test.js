var expect = require('chai').expect;
var tokenizer = require('../../../components/tokenizer');

describe('expressAuth/Tokenizer', function() {
	it('has a Json Web Token (JWT) strategy', function() {
		expect(tokenizer).to.have.keys([
			'jwt',
			'pbkdf2',
			'random',
		]);
	});
});
