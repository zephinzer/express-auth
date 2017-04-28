var ExpressAuth = require('../../../');

describe('ExpressAuth/Defaults/methods', function() {
  var methods = ExpressAuth.get('method');
  it('has the right keys', function() {
    expect(methods).to.have.keys(ExpressAuth.get('keys'));
  });

  it('uses GET for the default HTTP method', function() {
    var methodKeys = Object.keys(methods);
    methodKeys.forEach(function(methodKey) {
      expect(methods[methodKey]).to.equal('get');
    });
  });
});
