var Defaults = require('../../../../components/defaults');

describe('expressAuth/Defaults/model', function() {
	it('.sequelize', function() {
		expect(Defaults.model).to.have.keys([
			'sequelize',
		]);
	});
});
