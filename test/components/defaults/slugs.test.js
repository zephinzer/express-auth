var Defaults = require('../../../components/defaults');
var ExpressAuth = require('../../../');

describe('ExpressAuth/Defaults/slugs', function() {
	it('.has the right keys', function() {
		expect(Defaults.slug).to.have.keys(ExpressAuth.get(['keys']));
	});
});
