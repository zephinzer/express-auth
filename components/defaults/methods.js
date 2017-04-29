/**
 * expressAuth/Defaults/methods
 *
 * This file defines the HTTP methods for the different endpoints as identified in the
 * keys.js file.
 */

module.exports = function(_config) {
  var config = _config || this;
	var methods = {};
  var keysKeys = Object.keys(config.keys);
  keysKeys.forEach(function(key) {
    methods[config.keys[key]] = 'get';
  });
	return methods;
};
