/**
 * expressAuth/Defaults/params
 *
 * Provides defaults for how parameters are named.
 */

var requiredParameters = {
	access: {
		token: 'token',
	},
	login: {
		userIdentifier: 'user-id',
		password: 'password',
	},
	logout: {
		token: 'token',
	},
	register: {
		email: 'email',
		password: 'password',
		passwordConfirmation: 'password-confirmation',
	},
	verify: {
		nonce: 'token',
	},
	forgot: {
		email: 'email',
	},
};

module.exports = function() {
	return {
		required: requiredParameters,
		get: function(endpointType) {
			return requiredParameters.required[endpointType];
		},
	};
};
