var ExpressAuth = require('../../../');

describe('ExpressAuth/Defaults/params', function() {
  var defaultParams = ExpressAuth.get(['params']);
  it('has the correct properties', function() {
    expect(defaultParams).to.have.keys([
      'required',
      'get',
    ]);
  });

  describe('.required', function() {
    it('is defined for /access', function() {
      var accessParameters = ExpressAuth.get(['params', 'required', 'access']);
      expect(accessParameters).to.contain.key('token');
    });

    it('is defined for /login', function() {
      var loginParameters = ExpressAuth.get(['params', 'required', 'login']);
      expect(loginParameters).to.contain.key('userIdentifier');
      expect(loginParameters).to.contain.key('password');
    });

    it('is defined for /logout', function() {
      var logoutParameters = ExpressAuth.get(['params', 'required', 'logout']);
      expect(logoutParameters).to.contain.key('token');
    });

    it('is defined for /register', function() {
      var registerParameters = ExpressAuth.get(['params', 'required', 'register']);
      expect(registerParameters).to.contain.key('email');
      expect(registerParameters).to.contain.key('password');
      expect(registerParameters).to.contain.key('passwordConfirmation');
    });

    it('is defined for /verify', function() {
      var verifyParameters = ExpressAuth.get(['params', 'required', 'verify']);
      expect(verifyParameters).to.contain.key('nonce');
    });

    it('is defined for /forgot', function() {
      var forgotParameters = ExpressAuth.get(['params', 'required', 'forgot']);
      expect(forgotParameters).to.contain.key('email');
    });
  });
});
