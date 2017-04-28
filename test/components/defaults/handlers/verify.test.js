var Constant = require('../../../../components/constant');
var Defaults = require('../../../../components/defaults');

describe('ExpressAuth/Defaults/handlers/verify', function() {
  var req = {
    pass: [
      {method: 'get', query: {token: 'a'}},
      {method: 'post', body: {token: 'a'}},
      {method: 'put', body: {token: 'a'}},
      {method: 'delete', query: {token: 'a'}},
    ],
    fail: [
      {method: 'get', query: {tokenz: 'a'}},
    ],
  };
  var res;

  beforeEach(function() {
    res = {json: sinon.spy()};
  });

  it('works as expected', function(done) {
    for(var testCase = 0; testCase < req.pass.length; ++testCase) {
      Defaults.handlers.verify(req.pass[testCase], res);
    }
    setTimeout(function() {
      expect(res.json.callCount).to.equal(req.pass.length);
      expect(res.json).to.always.have.been.calledWithMatch(function(calledWith) {
        return (calledWith.status === Constant.code.success.verify) &&
          (calledWith.message === null);
      });
      res.json.reset();
      done();
    }, 200);
  });

  it('sends a valid JSON response when expected parameter is not found', function() {
    for(var testCase = 0; testCase < req.fail.length; ++testCase) {
      try {
        Defaults.handlers.verify(req.fail[testCase], res);
      } catch(ex) { }
      expect(res.json.callCount).to.equal(1);
      res.json.reset();
    }
  });

  it('returns an error response when expected parameter(s) are not found', function() {
    for(var testCase = 0; testCase < req.fail.length; ++testCase) {
      Defaults.handlers.verify(req.fail[testCase], res);
    }
    expect(res.json.callCount).to.eq(req.fail.length);
  });
});
