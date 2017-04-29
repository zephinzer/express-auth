var Sequelize = require('sequelize');
var ExpressAuth = require('../../../../../');
var Tokenizer = require('../../../../../components/tokenizer');

var factory = require('../../../../factory');

describe('expressAuth/Defaults/model/sequelize/handle .forgot ( id : {Number} )', function() {
  var sequelize;
  var sequelizeConfig = ExpressAuth.get(['model', 'sequelize', 'config']);
  var names = ExpressAuth.get(['model', 'sequelize', 'config', 'names']);

  var expectedAccount = {
    [names.columnEmail]: 'handle.forgot.test@address.com',
    [names.columnPassword]: 'password',
    [names.columnNonce]: 'nonce_token',
    [names.columnSession]: null,
  };
  var forgot = ExpressAuth.get(['model', 'sequelize', 'handle', 'forgot']).bind(
    ExpressAuth.get(['model', 'sequelize', 'config'])
  );

  before(function(done) {
    factory.create.account(
      expectedAccount[names.columnEmail],
      Tokenizer.pbkdf2.create(expectedAccount[names.columnPassword]),
      expectedAccount[names.columnNonce]
    ).then(function(account) {
      expectedAccount.id = account.id;
      done();
    }).catch(done);
  });

  after(function(done) {
    factory.destroy.account(expectedAccount.email).then(done).catch(done);
  });

  it('updates the row identified by the provided email with a nonce', function(done) {
    Account.findAll({where: {[names.columnEmail]: expectedAccount[names.columnEmail]}})
      .then(function(accounts) {
        expect(accounts.length).to.be.greaterThan(0);
        var targetAccount = accounts[0].dataValues;
        var originalNonce = targetAccount[names.columnNonce];
        forgot(expectedAccount[names.columnEmail])
          .then(function(res) {
            expect(res).to.be.a('string');
            Account.findAll({where: {[names.columnEmail]: expectedAccount[names.columnEmail]}})
              .then(function(accounts) {
                expect(accounts.length).to.be.greaterThan(0);
                var forgetfulAccount = accounts[0].dataValues;
                var generatedNonce = forgetfulAccount[names.columnNonce];
                expect(generatedNonce).to.not.be.null;
                expect(originalNonce).to.not.deep.equal(generatedNonce);
                done();
              });
          }).catch(done);
      }).catch(done);
  });

  it('returns the generated nonce if the provided email was found', function(done) {
    forgot(expectedAccount[names.columnEmail])
      .then(function(res) {
        expect(res).to.be.a('string');
        done();
      })
      .catch(function(err) { done(err); });
  });

  it('returns false if the provided email was not found', function(done) {
    forgot('un'+expectedAccount[names.columnEmail])
      .then(function(res) {
        expect(res).to.be.false;
        done();
      })
      .catch(function(err) { done(err); });
  });
});
