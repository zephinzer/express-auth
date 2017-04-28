var Sequelize = require('sequelize');
var ExpressAuth = require('../../../../../');

describe('expressAuth/Defaults/model/sequelize/handle .access ( token : String )', function() {
  var sequelize;
  var sequelizeConfig = ExpressAuth.get(['model', 'sequelize', 'config']);
  var names = ExpressAuth.get(['model', 'sequelize', 'config', 'names']);
  var expectedAccount = {
    [names.columnEmail]: 'handle.access.test@address.com',
    [names.columnPassword]: 'password',
    [names.columnNonce]: 'nonce_token',
    [names.columnSession]: null,
  };
  var access = ExpressAuth.get(['model', 'sequelize', 'handle', 'access']).bind(
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

  it('returns the identified row in the then block', function(done) {
    access(expectedAccount[names.columnNonce])
      .then(function(identifiedAccount) {
        expect(identifiedAccount).to.be.a('object');
        expect(identifiedAccount).to.contain.keys([
          'id',
          names.columnEmail,
          names.columnPassword,
          names.columnNonce,
          names.columnSession,
        ]);
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('returns false in the second argument of the callback if token was not found', function(done) {
    access('un' + expectedAccount[names.columnNonce])
      .then(function(identifiedAccount) {
        expect(identifiedAccount).to.equal(false);
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });
});
