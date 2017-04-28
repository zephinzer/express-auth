var Sequelize = require('sequelize');
var ExpressAuth = require('../../../../../');

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


  it('returns an account on successful verification', function(done) {
    verify(expectedAccount[names.columnNonce])
      .then(function(res) {
        expect(res).have.keys([
          'id',
          names.columnEmail,
          names.columnPassword,
          names.columnNonce,
          names.columnSession,
          'createdAt',
          'updatedAt',
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
