var ExpressAuth = require('../');
ExpressAuth.set(['model', 'sequelize', 'config', 'path'], './test/sequelize.json');
var chai = require('chai');
chai.use(require('sinon-chai'));
global.expect = chai.expect;
global.sinon = require('sinon');
