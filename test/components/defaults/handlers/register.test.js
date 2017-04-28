var Defaults = require('../../../../components/defaults');
var Utility = require('../../../../components/utility');
var Constant = require('../../../../components/constant');
var Tokenizer = require('../../../../components/tokenizer');

var factory = require('../../../factory');

describe('ExpressAuth/Defaults/handlers/register', function() {
  var password = 'p@ssw0rd';
  var hashedPassword = Tokenizer.pbkdf2.create(password);
  var expectedAccount = {
    email: 'register.test@address.com',
    password: password,
    nonce: 'nonce_token',
    session: 'session_token',
  };
  var paramNames = Defaults.params.required.register;
  var passQuery = {
    [paramNames.email]: expectedAccount.email,
    [paramNames.password]: expectedAccount.password,
    [paramNames.passwordConfirmation]: expectedAccount.password,
  };
  var req = {
    pass: [
      {method: 'get', query: passQuery},
      {method: 'post', body: passQuery},
      {method: 'put', body: passQuery},
      {method: 'delete', query: passQuery},
    ],
    fail: [
      {method: 'get', query: {
        noEmail: expectedAccount.email,
        [paramNames.password]: expectedAccount.password,
        [paramNames.passwordConfirmation]: expectedAccount.password,
      }},
      {method: 'get', query: {
        [paramNames.email]: expectedAccount.email,
        noPassowrd: expectedAccount.password,
        [paramNames.passwordConfirmation]: expectedAccount.password,
      }},
      {method: 'get', query: {
        [paramNames.email]: expectedAccount.email,
        [paramNames.password]: expectedAccount.password,
        noPassowrdConfirmation: expectedAccount.password,
      }},
      {method: 'get', query: {
        noEmail: expectedAccount.email,
        noPassowrd: expectedAccount.password,
        [paramNames.passwordConfirmation]: expectedAccount.password,
      }},
      {method: 'get', query: {
        noEmail: expectedAccount.email,
        [paramNames.password]: expectedAccount.password,
        noPassowrdConfirmation: expectedAccount.password,
      }},
      {method: 'get', query: {
        [paramNames.email]: expectedAccount.email,
        noPassowrd: expectedAccount.password,
        noPassowrdConfirmation: expectedAccount.password,
      }},
      {method: 'get', query: {
        noEmail: expectedAccount.email,
        noPassowrd: expectedAccount.password,
        noPassowrdConfirmation: expectedAccount.password,
      }},
    ],
  };
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
        Defaults.handlers.register(passCase, res);
      }, (200 * index));
    });
    setTimeout(function() {
      expect(res.json.callCount).to.equal(req.pass.length);
      expect(res.json).to.always.have.been.calledWithMatch(function(calledWith) {
        return (calledWith.status === Constant.code.success.register) &&
          (calledWith.message === null) &&
          (typeof calledWith.data.email === 'string') &&
          (calledWith.data.email === expectedAccount.email);
      });
      res.json.reset();
      done();
    }, (220 * req.pass.length));
  });

  it('sends a valid JSON response when expected parameter is not found', function() {
    req.fail.forEach(function(failCase, index) {
      setTimeout(function() {
        Defaults.handlers.register(failCase, res);
      }, (200 * index));
    });
    setTimeout(function() {
      var standardResponse = Utility.createMissingParameterResponse;
      expect(res.json).to.be.have.been.calledWith(standardResponse(paramNames.email));
      expect(res.json).to.be.have.been.calledWith(standardResponse(paramNames.password));
      expect(res.json).to.be.have.been.calledWith(standardResponse(paramNames.passwordConfirmation));
      expect(res.json).to.be.have.been.calledWith(standardResponse([paramNames.email, paramNames.password]));
      expect(res.json).to.be.have.been.calledWith(standardResponse([paramNames.password, paramNames.passwordConfirmation]));
      expect(res.json).to.be.have.been.calledWith(standardResponse([paramNames.email, paramNames.passwordConfirmation]));
      expect(res.json).to.be.have.been.calledWith(standardResponse(
        [paramNames.email, paramNames.password, paramNames.passwordConfirmation])
      );
      expect(res.json.callCount).to.eq(req.fail.length);
      res.json.reset();
    }, (200 * req.fail.length));
  });
});
