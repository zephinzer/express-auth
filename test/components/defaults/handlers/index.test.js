var ExpressAuth = require('../../../../');
var Defaults = require('../../../../components/defaults');

describe('.handlers', function() {
  var identifierKeys = ExpressAuth.get('keys');

  it('has the correct keys', function() {
    expect(Defaults.handlers).to.contain.keys(identifierKeys);
  });

  it('has an `after` property for custom post hooks', function() {
    expect(Defaults.handlers).to.contain.key('after');
  });

  it('implements functions for each of the keys', function() {
    for(var handlerIndex = 0; handlerIndex < identifierKeys.length; ++handlerIndex) {
      expect(Defaults.handlers[identifierKeys[handlerIndex]]).to.be.a('function');
    }
  });
});
