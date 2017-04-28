/**
 * expressAuth/Defaults/methods
 *
 * This file defines the HTTP methods for the different endpoints as identified in the
 * keys.js file.
 */

module.exports = function() {
	var methods = {};
	for(var keyIndex = 0; keyIndex < this.keys.length; ++keyIndex) {
		methods[this.keys[keyIndex]] = 'get';
	}
	return methods;
};
