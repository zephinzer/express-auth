var Sequelize = require('sequelize');
var ExpressAuth = require('../../../../../');

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
