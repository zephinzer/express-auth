var Constant = require('../../constant');
var Utility = require('../../utility');

/**
 * Express handler for managing verify requests. Verify requests are the kind that
 * come from a link in the email after initial registration. See the access handler
 * for the sort of request that comes from email through an email-login strategy.
 *
 * @param {ExpressRequest} req
 * @param {ExpresResponse} res
 * @param {Function} next
 */
module.exports = function(req, res, next) {
  var params = Utility.parseRequestForParams(req);
  var requiredParams = this.params.required.verify;
  var missingParams = Utility.getMissingParameters(params, requiredParams);
  if(missingParams.length > 0) {
    res.json(Utility.createMissingParameterResponse(missingParams.toString()));
  } else {
    var challengeNonce = params[requiredParams.nonce];
    var responseHandler = (function(returnableObject) {
      if(typeof this.handlers.after.verify === 'function') {
        this.handlers.after.verify(req, res, returnableObject);
      } else {
        res.json(returnableObject);
      }
    }).bind(this);
    var modelHandler = this.model[this.options.modelStrategy].handle.verify.bind(
      this.model[this.options.modelStrategy].config
    );
    modelHandler(challengeNonce)
      .then((function(response) {
        if(response === false) {
          responseHandler(Utility.createResponse(Constant.code.success.verify, null, response));
        } else {
          var tokenGenerator = this.token[this.options.tokenStrategy].generate;
          var token = tokenGenerator({id: response.id});
          responseHandler(Utility.createResponse(Constant.code.success.verify, null, {token: token}));
        }
      }).bind(this))
      .catch(function(err) {
        responseHandler(Utility.createResponse(Constant.code.error.requiredGeneric, null, err));
      });
  }
};
