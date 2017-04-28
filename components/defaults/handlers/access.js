var Constant = require('../../constant');
var Utility = require('../../utility');

var handlerId = 'access';

module.exports = function(req, res, next) {
  var params = Utility.parseRequestForParams(req);
  var requiredParams = this.params.required.access;
  var missingParams = Utility.getMissingParameters(params, requiredParams);
  if(missingParams.length > 0) {
    res.json(Utility.createMissingParameterResponse(missingParams.toString()));
  } else {
    var challengeToken = params[requiredParams.token];
    var model = this.model[this.options.modelStrategy];
    var modelHandler = model.handle[handlerId].bind(model.config);
    var responseHandler = (function(returnableObject) {
      if(typeof this.handlers.after.access === 'function') {
        this.handlers.after.access(req, res, returnableObject);
      } else {
        res.json(returnableObject);
      }
    }).bind(this);
    modelHandler(challengeToken)
      .then((function(identifiedAccount) {
        var tokenGenerator = this.token[this.options.tokenStrategy].generate;
        var token = tokenGenerator({id: identifiedAccount.id});
        responseHandler(Utility.createResponse(
          Constant.code.success.access, null, {token: token}
        ));
      }).bind(this))
      .catch(function(err) {
        responseHandler(Utility.createResponse(
          Constant.code.error.requiredGeneric, null, err
        ));
      });
  }
};
