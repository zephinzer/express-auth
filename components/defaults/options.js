/**
 * expressAuth/Defaults/options
 *
 * This defaults module exposes high level options that changes the behaviour of
 * expressAuth
 */

module.exports = function() {
	return {
		modelStrategy: 'sequelize',
    secretStrategy: 'symmetric',
		tokenStrategy: 'jwt',
	};
};
