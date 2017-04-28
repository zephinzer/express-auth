/**
 * expressAuth/Defaults/slugs
 *
 * Exposes default endpoint names which are the key names (find it in key.js)
 */

module.exports = function(calledBy) {
  var config = calledBy || this;
	var slug = {};
	for(var keyIndex = 0; keyIndex < config.keys.length; ++keyIndex) {
		slug[config.keys[keyIndex]] = config.keys[keyIndex];
	}
	return slug;
};
