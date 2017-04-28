var Tokenizer = require('../tokenizer');

module.exports = function(_config) {
  var config = _config || this;

  return {
    jwt: {
      generate: function(payload) {
        var tokenStrategy = config.options.tokenStrategy;
        var secretStrategy = config.options.secretStrategy;
        var secret = config.secret[secretStrategy]();
        var tokenizer = Tokenizer[tokenStrategy][secretStrategy];
        var token = tokenizer.encode(payload, secret.encryptor);
        return token;
      },
      validate: function(payload) {
        var secretStrategy = config.options.secretStrategy;
        var secret = config.secret[secretStrategy]();
        var tokenizer = Tokenizer[config.options.tokenStrategy][secretStrategy];
        var token = tokenizer.decode(payload, secret.decryptor);
        return token;
      },
    },
  };
};
