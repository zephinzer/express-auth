/**
 * expressAuth/Defaults
 *
 * This file indexes the different possible properties of the Defaults object. We use
 * bind(defaults) as seen below so that the defaults can access the main Defaults
 * object because some functionality necessitates coupling and we try to comply with
 * ES5.
 */

var defaultKeys = require('./keys');
var defaultSlugs = require('./slugs');
var defaultMethods = require('./methods');
var defaultModel = require('./model');
var defaultHandlers = require('./handlers');
var defaultParams = require('./params');
var defaultSecret = require('./secret');
var defaultOptions = require('./options');
var defaultToken = require('./token');

var defaults = {};
defaults.keys = defaultKeys();
defaults.slug = defaultSlugs.bind(defaults)();
defaults.method = defaultMethods.bind(defaults)();
defaults.model = defaultModel.bind(defaults)();
defaults.handlers = defaultHandlers.bind(defaults)();
defaults.params = defaultParams.bind(defaults)();
defaults.secret = defaultSecret.bind(defaults)();
defaults.options = defaultOptions.bind(defaults)();
defaults.token = defaultToken.bind(defaults)();

module.exports = defaults;
