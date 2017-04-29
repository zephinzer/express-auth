var Sequelize = require('sequelize');
var Q = require('q');
var ExpressAuth = require('../../');

var Account;
var sequelize;

/**
 * Creates the database connector instance if it does not exist.
 *
 * @return {Promise}
 */
function getDatabase() {
  var q = Q.defer();
  var sequelizeConfig = ExpressAuth.get(['model', 'sequelize', 'config']);
  if(typeof Account === 'undefined' || typeof sequelize === 'undefined') {
    ExpressAuth.set(['model', 'sequelize', 'config', 'extraColumns'], {
      createdAt: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
      updatedAt: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
    });
    sequelize = new Sequelize(sequelizeConfig.get());
    sequelize.authenticate().then(function() {
      Account = sequelizeConfig.model(sequelize);
      q.resolve();
    }).catch(function(err) { q.reject(err); });
  } else {
    setTimeout(function() {
      q.resolve();
    });
  }
  return q.promise;
}

module.exports = {
  accountModel: {
    get: function() {
      return Account;
    },
  },
  create: {
    account: function(email, password, nonceToken, sessionToken) {
      var q = Q.defer();
      getDatabase().then(function() {
        var columnNames = ExpressAuth.get(['model', 'sequelize', 'config', 'names']);
        var accountToCreate = {
          [columnNames.columnEmail]: typeof email === 'undefined' ? null : email,
          [columnNames.columnPassword]: typeof password === 'undefined' ? null : password,
          [columnNames.columnNonce]: typeof nonceToken === 'undefined' ? null : nonceToken,
          [columnNames.columnSession]: typeof sessionToken === 'undefined' ? null : sessionToken,
        };
        Account.create(accountToCreate).then(function(res) {
            accountToCreate.id = res.id;
            q.resolve(accountToCreate);
          })
          .catch(function(err) { q.reject(err); });
      });
      return q.promise;
    },
  },
  destroy: {
    account: function(email) {
      var q = Q.defer();
      getDatabase().then(function() {
        var columnNames = ExpressAuth.get(['model', 'sequelize', 'config', 'names']);
        var accountToDestroySelector = {
          where: {
            [columnNames.columnEmail]: typeof email === 'undefined' ? null : email,
          },
        };
        Account.destroy(accountToDestroySelector)
          .then(function(res) {
            q.resolve();
          }).catch(function(err) {
            q.reject(err); });
      });
      return q.promise;
    },
  },
};
