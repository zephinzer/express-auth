var crypto = require('crypto');

module.exports = {
	generateInteger: function(maximum) {
		return Math.floor(Math.random() * maximum);
	},
	generateFloat: function(maximum) {
		return Math.random() * maximum;
	},
	generateString: function(stringLength) {
		return crypto.randomBytes(stringLength / 2).toString('hex');
	},
};
