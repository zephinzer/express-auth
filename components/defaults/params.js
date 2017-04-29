/**
 * expressAuth/Defaults/params
 *
 * Provides defaults for how parameters are named.
 */

/**
 * Retrieves the required parameters for export.
 * @param {Object} config should point the main Defaults object
 * @return {Object}
 */
function getRequiredParameters(_config) {
  var config = _config || this;
	return {
    [config.keys.access]: {
      token: 'token',
    },
    [config.keys.login]: {
      userIdentifier: 'user-id',
      password: 'password',
    },
    [config.keys.logout]: {
      token: 'token',
    },
    [config.keys.register]: {
      email: 'email',
      password: 'password',
      passwordConfirmation: 'password-confirmation',
    },
    [config.keys.verify]: {
      nonce: 'token',
    },
    [config.keys.forgot]: {
      email: 'email',
    },
  };
};

module.exports = function() {
	return {
		required: getRequiredParameters.bind(this)(),
		get: function(endpointType) {
			return requiredParameters.required[endpointType];
		},
	};
};
