var Constant = require('../../constant');
var Utility = require('../../utility');

var handlerId = 'forgot';

module.exports = function(req, res, next) {
  var params = Utility.parseRequestForParams(req);
  var requiredParams = this.params.required.forgot;
  var missingParams = Utility.getMissingParameters(params, requiredParams);
  if(missingParams.length > 0) {
    res.json(Utility.createMissingParameterResponse(missingParams.toString()));
  } else {
    var challengeEmail = params[requiredParams.email];
    var model = this.model[this.options.modelStrategy];
    var modelHandler = model.handle[handlerId].bind(model.config);
    var responseHandler = (function(returnableObject) {
      if(typeof this.handlers.after.forgot === 'function') {
        this.handlers.after.forgot(req, res, returnableObject);
      } else {
        res.json(returnableObject);
      }
    }).bind(this);
    modelHandler(challengeEmail)
      .then(function() {
        responseHandler(Utility.createResponse(
          Constant.code.success.forgot, null, true
        ));
      })
      .catch(function(err) {
        responseHandler(Utility.createResponse(
          Constant.code.error.requiredGeneric, null, err
        ));
      });
  }
};
