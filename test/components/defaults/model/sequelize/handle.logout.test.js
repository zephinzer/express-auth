var Sequelize = require('sequelize');
var ExpressAuth = require('../../../../../');
var Tokenizer = require('../../../../../components/tokenizer');

var factory = require('../../../../factory');

describe('expressAuth/Defaults/model/sequelize/handle .logout ( id : {Number} )', function() {
  var sequelize;
  var sequelizeConfig = ExpressAuth.get(['model', 'sequelize', 'config']);
  var names = ExpressAuth.get(['model', 'sequelize', 'config', 'names']);
  var expectedAccount = {
    [names.columnEmail]: 'handle.logout.test@address.com',
    [names.columnPassword]: 'password',
    [names.columnNonce]: 'nonce_token',
    [names.columnSession]: 'session_token',
  };
  var logout = ExpressAuth.get(['model', 'sequelize', 'handle', 'logout']).bind(
    ExpressAuth.get(['model', 'sequelize', 'config'])
  );

  before(function(done) {
    factory.create.account(
      expectedAccount[names.columnEmail],
      Tokenizer.pbkdf2.create(expectedAccount[names.columnPassword]),
      expectedAccount[names.columnNonce],
      expectedAccount[names.columnSession]
    ).then(function(account) {
      expectedAccount.id = account.id;
      done();
    }).catch(done);
  });

  after(function(done) {
    factory.destroy.account(expectedAccount.email).then(done).catch(done);
  });

  it('returns true if the account identified is found', function(done) {
    logout(expectedAccount.id)
      .then(function(res) {
        expect(res).to.be.true;
        done();
      })
      .catch(function(err) { done(err); });
  });

  it('returns false if account couldn\'t be found', function(done) {
    logout(expectedAccount.id + 100)
      .then(function(res) {
        expect(res).to.be.false;
        done();
      })
      .catch(function(err) { done(err); });
  });
});
