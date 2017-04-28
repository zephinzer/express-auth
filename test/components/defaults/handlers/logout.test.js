var Defaults = require('../../../../components/defaults');
var Utility = require('../../../../components/utility');
var Constant = require('../../../../components/constant');
var Tokenizer = require('../../../../components/tokenizer');

var factory = require('../../../factory');

describe('ExpressAuth/Defaults/handlers/logout', function() {
  var password = 'p@ssw0rd';
  var hashedPassword = Tokenizer.pbkdf2.create(password);
  var expectedAccount = {
    email: 'logout.test@address.com',
    password: password,
    nonce: 'nonce_token',
    session: 'session_token',
  };
  var req;
  var res;

  before(function(done) {
    factory.create.account(
      expectedAccount.email,
      hashedPassword,
      expectedAccount.nonce
    ).then(function(account) {
      var tokenStrategy = Defaults.options.tokenStrategy;
      expectedAccount.id = account.id;
      expectedAccount.token = Defaults.token[tokenStrategy].generate({id: account.id});
      req = {
        pass: [
          {method: 'get', query: {token: expectedAccount.token}},
          {method: 'post', body: {token: expectedAccount.token}},
          {method: 'put', body: {token: expectedAccount.token}},
          {method: 'delete', query: {token: expectedAccount.token}},
        ],
        fail: [
          {method: 'get', query: {noToken: expectedAccount.token}},
        ],
      };
      done();
    }).catch(done);
  });

  after(function(done) {
    factory.destroy.account(expectedAccount.email).then(done).catch(done);
  });

  beforeEach(function() {
    res = {json: sinon.spy()};
  });

  it('works as expected', function(done) {
    req.pass.forEach(function(passCase, index) {
      setTimeout(function() {
        Defaults.handlers.logout(passCase, res);
      }, (200 * index));
    });
    setTimeout(function() {
      expect(res.json.callCount).to.equal(req.pass.length);
      expect(res.json).to.always.have.been.calledWithMatch(function(calledWith) {
        return (calledWith.status === Constant.code.success.logout) &&
          (calledWith.message === null) &&
          (calledWith.data === true);
      });
      res.json.reset();
      done();
    }, (220 * req.pass.length));
  });

  it('sends a valid JSON response when expected parameter is not found', function() {
    req.fail.forEach(function(failCase, index) {
      setTimeout(function() {
        Defaults.handlers.logout(failCase, res);
      }, (200 * index));
    });
    setTimeout(function() {
      expect(res.json).to.always.be.calledWith(
        Utility.createMissingParameterResponse('token')
      );
      expect(res.json.callCount).to.eq(req.fail.length);
      res.json.reset();
    }, (200 * req.fail.length));
  });
});
