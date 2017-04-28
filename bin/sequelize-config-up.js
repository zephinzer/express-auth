#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var configFile = fs.readFileSync(path.resolve('./test/sequelize.json')).toString();
var config = JSON.parse(configFile);
config.development = {
	storage: './data/main.db',
	dialect: 'sqlite',
};
fs.writeFileSync(path.resolve('./test/sequelize.json'), JSON.stringify(config, null, 2));
