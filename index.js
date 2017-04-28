var express = require('express');
var Utility = require('./components/utility');
var expressAuthDefaultOptions = require('./components/defaults');

var expressAuth = function() {
	this.router = new express.Router();
	var methods = expressAuthDefaultOptions.method;
	var slugs = expressAuthDefaultOptions.slug;
	for(var handlerKey in expressAuthDefaultOptions.handlers) {
		if(slugs[handlerKey] && methods[handlerKey]) {
			var uri = '/' + slugs[handlerKey];
			var method = methods[handlerKey];
			this.router[method](uri, expressAuthDefaultOptions.handlers[handlerKey]);
		}
	}
	return this.router;
};

expressAuth.get = function(optionKey) {
	return Utility.option.get.bind(expressAuthDefaultOptions)(optionKey);
};

expressAuth.set = function(optionKey, optionValue) {
	Utility.option.set.bind(expressAuthDefaultOptions)(optionKey, optionValue);
	return expressAuth;
};

module.exports = expressAuth;
