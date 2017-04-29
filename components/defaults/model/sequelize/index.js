/**
 * expressAuth/Defaults/model
 *
 * This file defines how model operations should be carried out and are handled by the handlers in handlers.js
 */
var path = require('path');
var Q = require('q');
var Sequelize = require('sequelize');

var Tokenizer = require('../../../tokenizer');

function getSequelizeConfig(_config) {
  var config = _config || this;
  return {
    extraColumns: {},
    get: function() {
      var environment = process.env.NODE_ENV || 'development';
      var configSet = require(path.join(process.cwd(), '/', this.path));
      return configSet[environment];
    },
    path: './sequelize.json',
    model: function(sequelize, _config) {
      var config = this || _config;
      var additionalColumnKeys = Object.keys(config.extraColumns);
      var tableConfiguration = additionalColumnKeys.reduce(function(prev, curr, index) {
        return Object.assign(prev, {[curr]: config.extraColumns[curr]});
      }, {});
      Object.keys(config.names).reduce(function(prev, curr) {
        return Object.assign(prev, {[config.names[curr]]: Sequelize.STRING});
      }, tableConfiguration);
      return sequelize.define('Account', tableConfiguration, {
        timestamps: false,
        freezeTableName: true,
        tableName: config.table,
        version: false,
      });
    },
    names: {
      columnEmail: 'email',
      columnPassword: 'password',
      columnNonce: 'nonce_token',
      columnSession: 'session_token',
    },
    table: 'Accounts',
    nonceLength: config.options.nonceTokenLength,
  };
};

function handleWrapper(handler) {
  var q = Q.defer();
  var sequelize = new Sequelize(this.get());
  var model = this.model(sequelize);
  var errorHandler = function(err) { q.reject(err); };
  var successHandler = function(res) { q.resolve(res); };
  sequelize.authenticate()
    .then(function(err) {
      handler(model, successHandler, errorHandler).catch(errorHandler);
    })
    .catch(errorHandler);
  return q.promise;
};

module.exports = function(_config) {
  var config = _config || this;
	return {
    config: getSequelizeConfig.bind(config)(),
    handle: {
      [config.keys.access]: function(token) {
        return handleWrapper.bind(this)((function(model, successHandler) {
          return model.findAll({where: {[this.names.columnNonce]: token}})
            .then(function(accounts) {
              (accounts.length === 0) && successHandler(false);
              (accounts.length >= 1) && successHandler(accounts[0].dataValues);
            });
        }).bind(this));
      },
      [config.keys.login]: function(email, password) {
        return handleWrapper.bind(this)((function(model, successHandler) {
          return model.findAll({where: {[this.names.columnEmail]: email}})
            .then((function(accounts) {
              // handles account not found
              if(accounts.length === 0) { successHandler(false); }
              var targetAccount = accounts[0].dataValues;
              var targetAccountId = targetAccount.id;
              var generatedToken = Tokenizer.random.generateString(this.nonceLength);
              var accountSelectorObject = {where: {id: targetAccountId}};
              if(password) {
                var targetAccountPasswordHash = targetAccount[this.names.columnPassword];
                var validation = Tokenizer.pbkdf2.validate(password, targetAccountPasswordHash);
                var valid = validation.valid && !validation.expired && !validation.corrupt;
                // handles invalid password
                if(!valid) {
                  successHandler(false);
                } else {
                  var sessionTokenObject = {[this.names.columnSession]: generatedToken};
                  model
                    .update(sessionTokenObject, accountSelectorObject)
                    .then(function() { successHandler(Object.assign(targetAccount, sessionTokenObject)); });
                }
              } else {
                var nonceTokenObject = {[this.names.columnNonce]: generatedToken};
                model
                  .update(nonceTokenObject, accountSelectorObject)
                  .then(function() { successHandler(Object.assign(targetAccount, nonceTokenObject)); });
              }
            }).bind(this));
        }).bind(this));
      },
      [config.keys.logout]: function(id) {
        return handleWrapper.bind(this)((function(model, successHandler) {
          return model.update({
              [this.names.columnNonce]: null,
              [this.names.columnSession]: null,
            }, {where: {id: id}})
            .then(function(accounts) {
              successHandler(accounts.length > 0 && accounts[0] === 1);
            });
        }).bind(this));
      },
      [config.keys.register]: function(email, password, _otherInfo) {
        return handleWrapper.bind(this)((function(model, successHandler) {
          var otherInfo = _otherInfo || {};
          var accountObject = Object.keys(otherInfo).reduce(function(prev, curr) {
            return Object.assign(prev, {[curr]: otherInfo[curr]});
          }, {
            [this.names.columnEmail]: email,
            [this.names.columnPassword]: password,
            [this.names.columnNonce]: Tokenizer.random.generateString(this.nonceLength),
          });
          return model.create(accountObject)
            .then(function(account) {
              successHandler(account.dataValues);
            });
        }).bind(this));
      },
      [config.keys.verify]: function(token) {
        return handleWrapper.bind(this)((function(model, successHandler) {
          return model.findAll({where: {[this.names.columnNonce]: token}})
            .then((function(accounts) {
              var valid = accounts.length > 0;
              if(!valid) { successHandler(false); }
              else {
                var targetAccount = accounts[0].dataValues;
                model.update({[this.names.columnNonce]: null}, {where: {id: targetAccount.id}})
                  .then(function(updatedAccounts) {
                  var updatedSuccess = (updatedAccounts.length === 1 && updatedAccounts[0] === 1);
                  successHandler(updatedSuccess ? targetAccount : false);
                });
              }
            }).bind(this));
        }).bind(this));
      },
      [config.keys.forgot]: function(email) {
        return handleWrapper.bind(this)((function(model, successHandler) {
          var generatedToken = Tokenizer.random.generateString(this.nonceLength);
          return model.update({[this.names.columnNonce]: generatedToken}, {where: {[this.names.columnEmail]: email}})
            .then(function(res) {
              var updatedRows = res[0];
              if(updatedRows > 0) {
                successHandler(generatedToken);
              } else {
                successHandler(false);
              }
            });
        }).bind(this));
      },
    },
	};
};
