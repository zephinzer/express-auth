/**
 * expressAuth/Defaults/model
 *
 * This file defines how model operations should be carried out and are handled by the handlers in handlers.js
 */
var sequelize = require('./sequelize');

module.exports = function() {
	return {
		sequelize: sequelize.bind(this)(),
  };
};
