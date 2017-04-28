var constant = require('./constant');

var Utility = {
	_throwIfTypeMismatch: function(keyPath, keyCurrentValue, value) {
		if(typeof keyCurrentValue !== typeof value) {
			throw new TypeError('Type of key `' +
				keyPath + '` (' + typeof keyCurrentValue +
				') does not match value `' + value + '` (' + typeof value + ')');
		}
	},
	_throwInvalidOptionKey: function() {
		// eslint-disable-next-line max-len
		throw new TypeError('Unknown :optionKey argument provided (it needs to be an array of Strings or a String)');
	},
	_throwUndersizedKeyArray: function() {
		// eslint-disable-next-line max-len
		throw new EvalError('When :optionKey is an Array, it should contain at least 1 element');
	},
	_throwOversizedKeyArray: function() {
		// eslint-disable-next-line max-len
		throw new EvalError('When :optionKey is an Array, it cannot exceed length 4');
	},
	createMissingParameterMessage: function(parameterKey) {
		return 'Required parameter `' + parameterKey + '` was not found';
	},
	createMissingParameterResponse: function(parameterKey) {
		return Utility.createResponse(
			constant.code.error.requiredParamsNotFound,
			Utility.createMissingParameterMessage(parameterKey)
		);
	},
	createResponse: function(statusCode, message, data) {
		return {
			status: statusCode,
			message: message,
			data: (typeof data === 'undefined') ? {} : data,
		};
	},
	getMissingParameters: function(parametersObject, requiredParameterKeys, callback) {
		var missingKeys = [];
		for(var key in requiredParameterKeys) {
			if(requiredParameterKeys[key]) {
				var keyName = requiredParameterKeys[key];
				if(typeof parametersObject[keyName] === 'undefined') {
					missingKeys.push(keyName);
				}
			}
		}
		return missingKeys;
	},
	parseRequestForParams: function(expressRequestObject) {
		switch(expressRequestObject.method.toLowerCase()) {
			case 'post': case 'put': return expressRequestObject.body;
			case 'get': case 'delete': return expressRequestObject.query;
			default: return null;
		}
	},
	option: {
		get: function(optionKey) {
			if(optionKey instanceof Array) {
				switch(optionKey.length) {
					case 0:
						Utility._throwUndersizedKeyArray();
					case 1:
						return this[optionKey[0]];
					case 2:
						return this[optionKey[0]][optionKey[1]];
					case 3:
						return this[optionKey[0]][optionKey[1]][optionKey[2]];
					case 4:
						return this[optionKey[0]][optionKey[1]][optionKey[2]][optionKey[3]];
					default:
						Utility._throwOversizedKeyArray();
				}
			} else if(typeof optionKey === 'string') {
				return this[optionKey];
			} else {
				Utility._throwInvalidOptionKey();
			}
		},
		set: function(optionKey, optionValue) {
			if(optionKey instanceof Array) {
				switch(optionKey.length) {
					case 0:
						Utility._throwUndersizedKeyArray();
					case 1:
						Utility._throwIfTypeMismatch(optionKey[0], this[optionKey[0]], optionValue);
						this[optionKey[0]] = optionValue;
						break;
					case 2:
						Utility._throwIfTypeMismatch(
							[optionKey[0], optionKey[1]],
							this[optionKey[0]][optionKey[1]],
							optionValue
						);
						this[optionKey[0]][optionKey[1]] = optionValue;
						break;
					case 3:
						Utility._throwIfTypeMismatch(
							[optionKey[0], optionKey[1], optionKey[2]],
							this[optionKey[0]][optionKey[1]][optionKey[2]],
							optionValue
						);
						this[optionKey[0]][optionKey[1]][optionKey[2]] = optionValue;
						break;
					case 4:
						Utility._throwIfTypeMismatch(
							[optionKey[0], optionKey[1], optionKey[2], optionKey[3]],
							this[optionKey[0]][optionKey[1]][optionKey[2]][optionKey[3]],
							optionValue
						);
						this[optionKey[0]][optionKey[1]][optionKey[2]][optionKey[3]] = optionValue;
						break;
					default:
						Utility._throwOversizedKeyArray();
				}
			} else if(typeof optionKey === 'string') {
				Utility._throwIfTypeMismatch(optionKey, this[optionKey], optionValue);
				this[optionKey] = optionValue;
			} else {
				Utility._throwInvalidOptionKey();
			}
		},
	},
};

module.exports = Utility;
