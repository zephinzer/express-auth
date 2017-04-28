var Sequelize = require('sequelize');

var ExpressAuth = require('../../../../../');

describe('expressAuth/Defaults/model/sequelize/handle', function() {
  var EXTRA_COLUMNS_CURSOR = ['model', 'sequelize', 'config', 'extraColumns'];
  var EXTRA_COLUMNS_DEFAULT = ExpressAuth.get(EXTRA_COLUMNS_CURSOR);
  var SEQUELIZE_CONFIG = ExpressAuth.get(['model', 'sequelize', 'config']);
  var COLUMN_NAMES = ExpressAuth.get(['model', 'sequelize', 'config', 'names']);
  var TESTDB_EXTRA_COLUMNS = {
    createdAt: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
    updatedAt: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
  };
  var EXPECTED_KEYS = [
    'access',
    'login',
    'logout',
    'register',
    'verify',
    'forgot',
  ];

  var sequelize;
  var Account;
  var expectedAccount = {
    [COLUMN_NAMES.columnEmail]: 'handle.test@address.com',
    [COLUMN_NAMES.columnPassword]: 'password',
    [COLUMN_NAMES.columnNonce]: 'nonce_token',
    [COLUMN_NAMES.columnSession]: 'session_token',
  };

  function getBoundedHandler(handlerKey) {
    var handler = ExpressAuth.get(['model', 'sequelize', 'handle', handlerKey]);
    return handler.bind(ExpressAuth.get(['model', 'sequelize', 'config']));
  };

  before(function(done) {
    ExpressAuth.set(EXTRA_COLUMNS_CURSOR, TESTDB_EXTRA_COLUMNS);
    sequelize = new Sequelize(SEQUELIZE_CONFIG.get());
    sequelize.authenticate().then(function() {
      Account = SEQUELIZE_CONFIG.model(sequelize);
      Account.create(expectedAccount)
        .then(function(res) {
          var accountId = res.dataValues.id;
          expectedAccount.id = accountId;
          done();
        })
        .catch(function(err) { done(err); });
    }).catch(function(err) { done(err); });
  });

  after(function(done) {
    ExpressAuth.set(EXTRA_COLUMNS_CURSOR, EXTRA_COLUMNS_DEFAULT);
    Account.destroy({where: expectedAccount})
      .then(function(res) { done(); })
      .catch(function(err) { done(err); });
  });

  it('has the correct keys', function() {
    var object = ExpressAuth.get(['model', 'sequelize', 'handle']);
    expect(object).to.have.keys(EXPECTED_KEYS);
  });

  it('has functions that return a promise', function(done) {
    var handlers = EXPECTED_KEYS.map(function(key) { return getBoundedHandler(key); });
    var counter = 0;
    handlers.forEach(function(handler) {
      setTimeout(function() {
        var q = (require('q')).defer();
        var handlerReturn = handler('');
        var observedObject = Object.getPrototypeOf(handlerReturn);
        var expectedKeys = (Object.keys(Object.getPrototypeOf(q.promise)));
        expect(observedObject).to.have.keys(expectedKeys);
        handlerReturn.then(function() { if(--counter === 0) { done(); } })
          .catch(function() { if(--counter === 0) { done(); } });
      }, (++counter) * 100);
    });
  });
});
