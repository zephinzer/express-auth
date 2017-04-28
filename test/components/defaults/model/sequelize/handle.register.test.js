var Sequelize = require('sequelize');
var ExpressAuth = require('../../../../../');

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
    ExpressAuth.set(['model', 'sequelize', 'config', 'extraColumns'], {
      createdAt: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
      updatedAt: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
    });
    sequelize = new Sequelize(sequelizeConfig.get());
    sequelize.authenticate().then(function() {
      Account = sequelizeConfig.model(sequelize);
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
    Account.destroy({where: expectedAccount})
      .then(function(res) { done(); })
      .catch(function(err) { done(err); });
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
