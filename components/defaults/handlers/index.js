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

module.exports = function() {
	return {
		after: {
			access: null,
			login: null,
			logout: null,
			register: null,
			verify: null,
			forgot: null,
		},
		access: (accessHandler).bind(this),
		login: (loginHandler).bind(this),
		register: (registerHandler).bind(this),
		logout: (logoutHandler).bind(this),
		forgot: (forgotHandler).bind(this),
		verify: (verifyHandler).bind(this),
	};
};
