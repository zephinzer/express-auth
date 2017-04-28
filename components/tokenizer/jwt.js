var jwt = require('jsonwebtoken');

var symmetricAlgorithmOptions = {algorithm: 'HS512'};
var asymmetricAlgorithmOptions = {algorithm: 'RS512'};

module.exports = {
	asymmetric: {
		decode: function(token, secret) {
			return jwt.verify(token, secret, asymmetricAlgorithmOptions);
		},
		encode: function(payload, secret) {
			return jwt.sign(payload, secret, asymmetricAlgorithmOptions);
		},
	},
	symmetric: {
		decode: function(token, secret) {
			return jwt.verify(token, secret, symmetricAlgorithmOptions);
		},
		encode: function(payload, secret) {
			return jwt.sign(payload, secret, symmetricAlgorithmOptions);
		},
	},
};
