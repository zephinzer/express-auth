/**
 * expressAuth/Defaults/slugs
 *
 * Exposes default endpoint names which are the key names (find it in key.js)
 */

module.exports = function(_config) {
  var config = _config || this;
	var slug = {};
  var keysKeys = Object.keys(config.keys);
  keysKeys.forEach(function(key) {
    slug[key] = key;
  });
	return slug;
};
