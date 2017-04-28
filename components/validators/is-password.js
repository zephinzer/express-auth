var validator = require('validator');
var Constant = require('../constant');

var ERROR_CODES = {
  SUCCESS: Constant.code.success.generic,
	TOO_SHORT: Constant.code.error.stringLengthTooShort,
	INVALID_CHARACTERS: Constant.code.error.stringHasInvalidCharacters,
};

module.exports = {
	errors: ERROR_CODES,
	check: function(challengePassword) {
		if(!validator.isLength(challengePassword, {min: 8})) { return ERROR_CODES.TOO_SHORT; }
		if(!validator.isAscii(challengePassword)) { return ERROR_CODES.INVALID_CHARACTERS; }
    return ERROR_CODES.SUCCESS;
	},
};
