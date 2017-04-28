/**
 * expressAuth/Defaults/secret
 *
 * Exposes information related to encryption that can be used by different encryption
 * or hashing strategies.
 */
var fs = require('fs');
var path = require('path');

var configuration = {
  keys: {
    private: './config/key.priv',
    public: './config/key.pub',
  },
  password: 'password',
};

/**
 * Returns an object that contains an encryption and decryption key for a
 * symmetric key authentication
 *
 * @return {Object} => { decryptor : String, encryptor : String }
 */
function getSymmetric() {
  return {
    decryptor: configuration.password,
    encryptor: configuration.password,
  };
};

/**
 * Returns an object that contains an encryption and decryption key for an
 * asymmetric key authentication
 *
 * @return {Object} => { decryptor : String, encryptor : String }
 */
function getAsymmetric() {
  var publicKeyPath = path.join(process.cwd(), configuration.keys.public);
  var privateKeyPath = path.join(process.cwd(), configuration.keys.private);
  return {
    decryptor: fs.readFileSync(publicKeyPath).toString(),
    encryptor: fs.readFileSync(privateKeyPath).toString(),
  };
}

module.exports = function() {
	return Object.assign(
    configuration,
    {
      symmetric: getSymmetric,
      asymmetric: getAsymmetric,
    }
  );
};
