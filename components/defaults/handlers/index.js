/**
 * expressAuth/Defaults/handlers
 *
 * This file contains Express middleware to handle requests for the different types
 * of user actions. Responsibility of handlers is as controllers of model functions
 */

var accessHandler = require('./access');
var loginHandler = require('./login');
var logoutHandler = require('./logout');
var registerHandler = require('./register');
var forgotHandler = require('./forgot');
var verifyHandler = require('./verify');

module.exports = function(_config) {
  var config = _config || this;
	return {
		after: {
			[config.keys.access]: null,
			[config.keys.login]: null,
			[config.keys.logout]: null,
			[config.keys.register]: null,
			[config.keys.verify]: null,
			[config.keys.forgot]: null,
		},
		[config.keys.access]: (accessHandler).bind(this),
		[config.keys.login]: (loginHandler).bind(this),
		[config.keys.register]: (registerHandler).bind(this),
		[config.keys.logout]: (logoutHandler).bind(this),
		[config.keys.forgot]: (forgotHandler).bind(this),
		[config.keys.verify]: (verifyHandler).bind(this),
	};
};
