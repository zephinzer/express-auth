var fs = require('fs');
var path = require('path');

var ExpressAuth = require('../../../');

describe('expressAuth/Defaults/secret', function() {
  it('has the correct keys', function() {
    expect(ExpressAuth.get(['secret'])).to.have.keys([
      'keys',
      'password',
      'symmetric',
      'asymmetric',
    ]);
  });

  it('can retrieve a symmetric set of keys', function() {
    var symmetricKey = ExpressAuth.get(['secret', 'symmetric'])();
    var expectedKey = ExpressAuth.get(['secret', 'password']);
    expect(symmetricKey.encryptor).to.equal(expectedKey);
    expect(symmetricKey.decryptor).to.equal(expectedKey);
  });

  it('can retrieve an asymmetric set of keys', function() {
    var symmetricKey = ExpressAuth.get(['secret', 'asymmetric'])();
    var expectedEncryptorKeyPath = ExpressAuth.get(['secret', 'keys', 'private']);
    var expectedDecryptorKeyPath = ExpressAuth.get(['secret', 'keys', 'public']);
    var expectedEncryptorKey = fs.readFileSync(path.join(process.cwd(), expectedEncryptorKeyPath)).toString();
    var expectedDecryptorKey = fs.readFileSync(path.join(process.cwd(), expectedDecryptorKeyPath)).toString();
    expect(symmetricKey.encryptor).to.equal(expectedEncryptorKey);
    expect(symmetricKey.decryptor).to.equal(expectedDecryptorKey);
  });

  it('has a selected value that is a key of a function in this component', function() {
    var defaultSecretModule = ExpressAuth.get(['secret']);
    expect(defaultSecretModule).to.contain.keys([ExpressAuth.get(['options', 'secretStrategy'])]);
  });

  it('has working bindings to internal references', function() {
    var originalPassword = ExpressAuth.get(['secret', 'password']);
    var expectedPassword = 'password2';
    ExpressAuth.set(['secret', 'password'], expectedPassword);
    expect(originalPassword).to.not.equal(expectedPassword);
    expect(ExpressAuth.get(['secret', 'password'])).to.equal(expectedPassword);
  });

  it('defines a symmetric an asymmetric property', function() {
    expect(ExpressAuth.get(['secret'])).to.contain.keys([
      'symmetric', 'asymmetric',
    ]);
  });

  describe('.symmetric', function() {
    var symmetric = ExpressAuth.get(['secret', 'symmetric']);
    it('identifies a function that returns { decryptor : String, encryptor : String }', function() {
      expect(symmetric).to.be.a('function');
    });
    it('returns the correct default password', function() {
      expect(symmetric().encryptor).to.equal(ExpressAuth.get(['secret', 'password']));
      expect(symmetric().decryptor).to.equal(ExpressAuth.get(['secret', 'password']));
    });
    it('can be altered', function() {
      ExpressAuth.set(['secret', 'password'], 'new password');
      expect(ExpressAuth.get(['secret', 'password'])).to.equal('new password');
      expect(symmetric().encryptor).to.equal('new password');
      expect(symmetric().decryptor).to.equal('new password');
    });
  });

  describe('.asymmetric', function() {
    var asymmetric = ExpressAuth.get(['secret', 'asymmetric']);
    it('identifies a function that returns', function() {
      expect(asymmetric).to.be.a('function');
    });

    it('returns the correct default keys', function() {
      expect(asymmetric().encryptor).to.equal(
        fs.readFileSync(path.join(process.cwd(),
        ExpressAuth.get(['secret', 'keys', 'private']))).toString()
      );
      expect(asymmetric().decryptor).to.equal(
        fs.readFileSync(path.join(process.cwd(),
        ExpressAuth.get(['secret', 'keys', 'public']))).toString()
      );
    });

    it('can be altered', function() {
      ExpressAuth.set(['secret', 'keys', 'private'], './package.json');
      ExpressAuth.set(['secret', 'keys', 'public'], './package.json');
      expect(asymmetric().encryptor).to.equal(
        fs.readFileSync(path.join(process.cwd(),
        ExpressAuth.get(['secret', 'keys', 'private']))).toString()
      );
      expect(asymmetric().decryptor).to.equal(
        fs.readFileSync(path.join(process.cwd(),
        ExpressAuth.get(['secret', 'keys', 'public']))).toString()
      );
    });
  });
});
