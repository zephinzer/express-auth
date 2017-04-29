var Sequelize = require('sequelize');
var ExpressAuth = require('../../../../../');
var Tokenizer = require('../../../../../components/tokenizer');

var factory = require('../../../../factory');

describe('expressAuth/Defaults/model/sequelize/handle .register ( email : String, password : String, callback : Function )', function() {
  var sequelize;
  var sequelizeConfig = ExpressAuth.get(['model', 'sequelize', 'config']);
  var names = ExpressAuth.get(['model', 'sequelize', 'config', 'names']);
  var expectedAccount = {
    [names.columnEmail]: 'handle.register.test@address.com',
    [names.columnPassword]: 'password',
    [names.columnNonce]: 'nonce_token',
    [names.columnSession]: null,
  };
  var register = ExpressAuth.get(['model', 'sequelize', 'handle', 'register']).bind(
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

  it('returns the newly created account in then() if registration succeeded', function(done) {
    register('email2@address2.com', 'password2')
      .then(function(registeredAccount) {
        expect(registeredAccount).to.contain.keys(['id', 'email', 'password', 'nonce_token']);
        expect(registeredAccount.email).to.equal('email2@address2.com');
        expect(registeredAccount.password).to.equal('password2');
        done();
      })
      .catch(function(err) { done(err); });
  });

  it('returns an error in catch() if registration failed', function(done) {
    register('email2@address2.com', 'password2', {createdAt: null})
      .then(function(res) { done(new Error('Nothing went wrong when something should have')); })
      .catch(function(err) { done(); });
  });
});
