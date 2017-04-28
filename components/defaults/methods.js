/**
 * expressAuth/Defaults/methods
 *
 * This file defines the HTTP methods for the different endpoints as identified in the
 * keys.js file.
 */

module.exports = function() {
	var methods = {};
  var keysKeys = Object.keys(this.keys);
  keysKeys.forEach(function(key) {
    methods[key] = 'get';
  });
	return methods;
};
