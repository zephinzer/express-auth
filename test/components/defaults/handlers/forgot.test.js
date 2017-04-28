var Defaults = require('../../../../components/defaults');
var Utility = require('../../../../components/utility');
var Constant = require('../../../../components/constant');

describe('ExpressAuth/Defaults/handlers/forgot', function() {
  var req = {
    pass: [
      {method: 'get', query: {email: 'a@b.com'}},
      {method: 'post', body: {email: 'a@b.com'}},
      {method: 'put', body: {email: 'a@b.com'}},
      {method: 'delete', query: {email: 'a@b.com'}},
    ],
    fail: [
      {method: 'get', query: {emailz: 'a'}},
    ],
  };
  var res;

  beforeEach(function() {
    res = {json: sinon.spy()};
  });

  it('works as expected', function(done) {
    req.pass.forEach(function(passCase, index) {
      setTimeout(function() {
        Defaults.handlers.forgot(passCase, res);
      }, (200 * index));
    });
    setTimeout(function() {
      expect(res.json.callCount).to.equal(req.pass.length);
      expect(res.json).to.be.calledWith(
        Utility.createResponse(Constant.code.success.forgot, null, true)
      );
      res.json.reset();
      done();
    }, (220 * req.pass.length));
  });

  it('sends a valid JSON response when expected parameter is not found', function() {
    for(var testCase = 0; testCase < req.fail.length; ++testCase) {
      try {
        Defaults.handlers.forgot(req.fail[testCase], res);
      } catch(ex) { }
      expect(res.json.callCount).to.equal(req.fail.length);
      expect(res.json).to.be.calledWith(
        Utility.createMissingParameterResponse('email')
      );
      res.json.reset();
    }
  });

  it('returns an error response when expected parameter(s) are not found', function() {
    for(var testCase = 0; testCase < req.fail.length; ++testCase) {
      Defaults.handlers.forgot(req.fail[testCase], res);
    }
    expect(res.json.callCount).to.eq(req.fail.length);
  });
});
