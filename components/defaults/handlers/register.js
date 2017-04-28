var Constant = require('../../constant');
var Utility = require('../../utility');
var Tokenizer = require('../../tokenizer');

var isEmail = require('../../validators/is-email');
var isPassword = require('../../validators/is-password');

var validateParameters = function(challengeEmail, challengePassword, challengePasswordConfirmation) {
  if(!isEmail.check(challengeEmail)) {
    return Constant.code.error.invalidEmail;
  } else if(challengePassword !== challengePasswordConfirmation) {
    return Constant.code.error.invalidPasswordConfirmation;
  } else if(isPassword.check(challengePassword) !== 0) {
    return Constant.code.error.invalidPassword;
  } else {
    return true;
  }
};

module.exports = function(req, res, next) {
  var params = Utility.parseRequestForParams(req);
  var requiredParams = this.params.required.register;
  var missingParams = Utility.getMissingParameters(params, requiredParams);
  if(missingParams.length > 0) {
    res.json(Utility.createMissingParameterResponse(missingParams.toString()));
  } else {
    var challengeEmail = params[requiredParams.email];
    var challengePassword = params[requiredParams.password];
    var challengePasswordConfirmation = params[requiredParams.passwordConfirmation];
    var validationResults = validateParameters(challengeEmail, challengePassword, challengePasswordConfirmation);
    if(validationResults !== true) {
      res.json(Utility.createResponse(validationResults, null, null));
    } else {
      var model = this.model[this.options.modelStrategy];
      var modelHandler = model.handle.register.bind(model.config);
      var hashedPassword = Tokenizer.pbkdf2.create(challengePassword);
      modelHandler(challengeEmail, hashedPassword)
        .then(function(response) {
          var account = {email: response[model.config.names.columnEmail]};
          res.json(Utility.createResponse(Constant.code.success.register, null, account));
        })
        .catch(function(err) {
          res.json(Utility.createResponse(Constant.code.error.requiredGeneric, null, err));
        });
    }
  }
};
