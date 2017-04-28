var ExpressAuth = require('../../../../../');
var Tokenizer = require('../../../../../components/tokenizer');
var factory = require('../../../../factory');

describe('expressAuth/Defaults/model/sequelize/handle .login ( email : { String }, [ password : String ] )', function() {
  var names = ExpressAuth.get(['model', 'sequelize', 'config', 'names']);
  var expectedAccount = {
    [names.columnEmail]: 'handle.login.test@address.com',
    [names.columnPassword]: 'password',
    [names.columnNonce]: null,
    [names.columnSession]: null,
  };
  var login = ExpressAuth.get(['model', 'sequelize', 'handle', 'login']).bind(
    ExpressAuth.get(['model', 'sequelize', 'config'])
  );
  var logout = ExpressAuth.get(['model', 'sequelize', 'handle', 'logout']).bind(
    ExpressAuth.get(['model', 'sequelize', 'config'])
  );

  before(function(done) {
    factory.create.account(
      expectedAccount[names.columnEmail],
      Tokenizer.pbkdf2.create(expectedAccount[names.columnPassword])
    ).then(function(account) {
      expectedAccount.id = account.id;
      done();
    }).catch(done);
  });

  after(function(done) {
    factory.destroy.account(expectedAccount.email).then(done).catch(done);
  });

  it('returns the account identified with the provided email if account was found', function(done) {
    login(expectedAccount[names.columnEmail], expectedAccount[names.columnPassword])
      .then(function(res) {
        expect(res).to.contain.keys(Object.keys(expectedAccount));
        done();
      })
      .catch(function(err) { done(err); });
  });

  it('returns false if account associated with email :email was not found', function(done) {
    login('un' + expectedAccount[names.columnEmail], expectedAccount[names.columnPassword])
      .then(function(res) {
        expect(res).to.equal(false);
        done();
      })
      .catch(function(err) { done(err); });
  });

  context('when only email provided', function() {
    beforeEach(function(done) {
      logout(expectedAccount.id)
        .then(function(res) {
          expect(res).to.be.true;
          done();
        })
        .catch(function(err) { done(err); });
    });

    it('sets the nonce_token column to a random string to be used to access user\'s account', function() {
      login(expectedAccount[names.columnEmail])
        .then(function(res) {
          expect(res[COLUMN_NAMES.columnNonce]).to.not.equal(null);
        });
    });
  });

  context('when email and password provided', function() {
    it('sets the session_token column to a random string to be used to identify the user\'s session', function() {
      login(expectedAccount[names.columnEmail], expectedAccount[names.columnPassword])
        .then(function(res) {
          expect(res[COLUMN_NAMES.columnSession]).to.not.equal(null);
        });
    });
  });
});
