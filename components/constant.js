module.exports = {
	code: {
		error: {
			requiredGeneric: -1,
			requiredParamsNotFound: -2,
			invalidEmail: -1001,
			invalidPassword: -1002,
			invalidPasswordConfirmation: -1003,
			invalidToken: -1004,
			stringLengthTooShort: -10001,
			stringLengthTooLong: -10002,
			stringHasInvalidCharacters: -10003,
		},
		success: {
			generic: 0,
			access: 1001,
			login: 1002,
			logout: 1003,
			register: 1004,
			verify: 1005,
			forgot: 1006,
		},
	},
	type: {
		string: 'string',
		filePath: 'filePath',
	},
};
