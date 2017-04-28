var validator = require('validator');

module.exports = {
	check: function(challengeEmail) {
		return validator.isEmail(challengeEmail);
	},
};
