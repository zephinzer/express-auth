var Constant = require('../../constant');
var Utility = require('../../utility');
var Tokenizer = require('../../tokenizer');

var handlerId = 'logout';

module.exports = function(req, res, next) {
  var params = Utility.parseRequestForParams(req);
  var requiredParams = this.params.required.logout;
  var missingParams = Utility.getMissingParameters(params, requiredParams);
  if(missingParams.length > 0) {
    res.json(Utility.createMissingParameterResponse(missingParams.toString()));
  } else {
    var challengeToken = params[requiredParams.token];
    var model = this.model[this.options.modelStrategy];
    var modelHandler = model.handle[handlerId].bind(model.config);
    var responseHandler = (function(returnableObject) {
      if(typeof this.handlers.after.logout === 'function') {
        this.handlers.after.logout(req, res, returnableObject);
      } else {
        res.json(returnableObject);
      }
    }).bind(this);
    var secretStrategy = this.options.secretStrategy;
    var secretDecryptor = this.secret[secretStrategy]().decryptor;
    var tokenDecode = Tokenizer[this.options.tokenStrategy][secretStrategy].decode;
    var tokenPayload = (tokenDecode(challengeToken, secretDecryptor));
    modelHandler(tokenPayload.id)
      .then(function(response) {
        responseHandler(Utility.createResponse(Constant.code.success.logout, null, response));
      })
      .catch(function(err) {
        responseHandler(Utility.createResponse(Constant.code.error.requiredGeneric, null, err));
      });
  }
};
