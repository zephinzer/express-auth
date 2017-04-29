var Sequelize = require('sequelize');
var ExpressAuth = require('../../../../../');
var Tokenizer = require('../../../../../components/tokenizer');

var factory = require('../../../../factory');

describe('expressAuth/Defaults/model/sequelize/handle .register ( email : String, password : String, callback : Function )', function() {
  var sequelize;
  var sequelizeConfig = ExpressAuth.get(['model', 'sequelize', 'config']);
  var names = ExpressAuth.get(['model', 'sequelize', 'config', 'names']);
  var expectedAccount = {
    [names.columnEmail]: 'handle.verify.test@address.com',
    [names.columnPassword]: 'password',
    [names.columnNonce]: 'nonce_token',
    [names.columnSession]: null,
  };
  var verify = ExpressAuth.get(['model', 'sequelize', 'handle', 'verify']).bind(
    ExpressAuth.get(['model', 'sequelize', 'config'])
  );

  before(function(done) {
    factory.create.account(
      expectedAccount[names.columnEmail],
      Tokenizer.pbkdf2.create(expectedAccount[names.columnPassword]),
      expectedAccount[names.columnNonce]
    ).then(function(account) {
      Account = factory.accountModel.get();
      expectedAccount.id = account.id;
      done();
    }).catch(done);
  });

  after(function(done) {
    factory.destroy.account(expectedAccount.email).then(done).catch(done);
  });


  it('returns an account on successful verification', function(done) {
    verify(expectedAccount[names.columnNonce])
      .then(function(res) {
        expect(res).have.keys([
          'id',
          names.columnEmail,
          names.columnPassword,
          names.columnNonce,
          names.columnSession,
        ]);
        done();
      })
      .catch(function(err) { done(err); });
  });

  it('return false on unsuccessful verification', function(done) {
    verify('un'+expectedAccount[names.columnNonce])
      .then(function(res) {
        expect(res).to.be.false;
        done();
      })
      .catch(function(err) { done(err); });
  });
});
