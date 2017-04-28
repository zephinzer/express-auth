const http = require('http');
const Sequelize = require('sequelize');
const Express = require('express');
const ExpressAuth = require('./index');

var EXTRA_COLUMNS_CURSOR = ['model', 'sequelize', 'config', 'extraColumns'];
var TESTDB_EXTRA_COLUMNS = {
  createdAt: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
  updatedAt: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
};
ExpressAuth.set(['slug', 'register'], 'new-user');
ExpressAuth.set(EXTRA_COLUMNS_CURSOR, TESTDB_EXTRA_COLUMNS);

const server = new Express();

server.use(new ExpressAuth());

http.createServer(server).listen(3333);
