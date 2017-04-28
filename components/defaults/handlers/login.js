var Constant = require('../../constant');
var Utility = require('../../utility');

var handlerId = 'login';

module.exports = function(req, res, next) {
  var params = Utility.parseRequestForParams(req);
  var requiredParams = this.params.required.login;
  var missingParams = Utility.getMissingParameters(params, requiredParams);
  if(missingParams.length > 0) {
    res.json(Utility.createMissingParameterResponse(missingParams.toString()));
  } else {
    var challengeUserIdentifier = params[requiredParams.userIdentifier];
    var challengePassword = params[requiredParams.password];
    var model = this.model[this.options.modelStrategy];
    var modelHandler = model.handle[handlerId].bind(model.config);
    var responseHandler = (function(returnableObject) {
      if(typeof this.handlers.after.login === 'function') {
        this.handlers.after.login(req, res, returnableObject);
      } else {
        res.json(returnableObject);
      }
    }).bind(this);
    modelHandler(challengeUserIdentifier, challengePassword)
      .then((function(response) {
        if(response === false) {
          responseHandler(Utility.createResponse(Constant.code.success.login, null, response));
        } else {
          var tokenGenerator = this.token[this.options.tokenStrategy].generate;
          var token = tokenGenerator({id: response.id});
          responseHandler(Utility.createResponse(Constant.code.success.login, null, {token: token}));
        }
      }).bind(this))
      .catch(function(err) {
        responseHandler(Utility.createResponse(Constant.code.error.requiredGeneric, null, err));
      });
  }
};
