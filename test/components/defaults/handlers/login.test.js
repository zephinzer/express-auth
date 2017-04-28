var Defaults = require('../../../../components/defaults');
var Utility = require('../../../../components/utility');
var Constant = require('../../../../components/constant');
var Tokenizer = require('../../../../components/tokenizer');

var factory = require('../../../factory');

describe('ExpressAuth/Defaults/handlers/login', function() {
  var password = 'p@ssw0rd';
  var hashedPassword = Tokenizer.pbkdf2.create(password);
  var expectedAccount = {
    email: 'login.test@address.com',
    password: password,
  };
  var req = {
    pass: [
      {method: 'get', query: {'user-id': expectedAccount.email, 'password': expectedAccount.password}},
      {method: 'post', body: {'user-id': expectedAccount.email, 'password': expectedAccount.password}},
      {method: 'put', body: {'user-id': expectedAccount.email, 'password': expectedAccount.password}},
      {method: 'delete', query: {'user-id': expectedAccount.email, 'password': expectedAccount.password}},
    ],
    fail: [
      {method: 'get', query: {'no-user-id': expectedAccount.email, 'no-password': expectedAccount.password}},
      {method: 'get', query: {'user-id': expectedAccount.email, 'no-password': expectedAccount.password}},
      {method: 'get', query: {'no-user-id': expectedAccount.email, 'password': expectedAccount.password}},
    ],
  };
  var res;

  before(function(done) {
    factory.create.account(
      expectedAccount.email,
      hashedPassword
    ).then(function(account) {
      expectedAccount.id = account.id;
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
        Defaults.handlers.login(passCase, res);
      }, (200 * index));
    });
    setTimeout(function() {
      expect(res.json.callCount).to.equal(req.pass.length);
      expect(res.json).to.always.have.been.calledWithMatch(function(calledWith) {
        return (calledWith.status === Constant.code.success.login) &&
          (calledWith.message === null) &&
          (typeof calledWith.data.token === 'string');
      });
      res.json.reset();
      done();
    }, (220 * req.pass.length));
  });

  it('sends a valid JSON response when expected parameter is not found', function() {
    req.fail.forEach(function(failCase, index) {
      setTimeout(function() {
        Defaults.handlers.login(failCase, res);
      }, (200 * index));
    });
    setTimeout(function() {
      expect(res.json).to.be.calledWith(
        Utility.createMissingParameterResponse('user-id')
      );
      expect(res.json).to.be.calledWith(
        Utility.createMissingParameterResponse('password')
      );
      expect(res.json).to.be.calledWith(
        Utility.createMissingParameterResponse(['user-id', 'password'])
      );
      expect(res.json.callCount).to.eq(req.fail.length);
      res.json.reset();
    }, (200 * req.fail.length));
  });
});
