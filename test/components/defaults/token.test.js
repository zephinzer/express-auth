var ExpressAuth = require('../../../');

describe('ExpressAuth/Defaults/token', function() {
  var expectedTokenStrategies = [
    'jwt',
  ];
  var tokenStrategyInterfaceKeys = [
    'generate',
    'validate',
  ];
  var tokens = ExpressAuth.get(['token']);
  var tokenKeys = Object.keys(tokens);

  it('returns the right keys', function() {
    expect(tokens).to.have.keys(expectedTokenStrategies);
  });

  it('should have `generate` and `validate` implemented for all strategy methods', function() {
    tokenKeys.forEach(function(tokenStrategy) {
      expect(tokens[tokenStrategy]).to.have.keys(tokenStrategyInterfaceKeys);
    });
  });

  describe('/jwt', function() {
    var tokenizer = tokens.jwt;
    var expectedObject = {n: 1, s: 's', o: {nested: 'obj'}, f: 3.1412};
    it('.generate( payload : Object ) => ( token : String )', function() {
      var token = tokenizer.generate(expectedObject);
      expect(token).to.be.a('string');
    });

    it('.validate( token : String ) => ( payload : Object )', function() {
      var payload = tokenizer.validate(tokenizer.generate(expectedObject));
      expect(payload).to.be.a('object');
      expect(payload).to.contain.keys(Object.keys(expectedObject));
    });

    it('works on integers', function() {
      var payload = tokenizer.validate(tokenizer.generate( {n: 1} ));
      expect(payload).to.contain.key('n');
      expect(payload.n).to.eq(1);
    });

    it('works on floating point numbers', function() {
      var payload = tokenizer.validate(tokenizer.generate( {fp: 1.12345} ));
      expect(payload).to.contain.key('fp');
      expect(payload.fp).to.eq(1.12345);
    });

    it('works on strings', function() {
      var payload = tokenizer.validate(tokenizer.generate( {s: '1'} ));
      expect(payload).to.contain.key('s');
      expect(payload.s).to.eq('1');
    });

    it('works on nested objects', function() {
      var payload = tokenizer.validate(tokenizer.generate( {no: {o: {p: 1}}} ));
      expect(payload).to.contain.key('no');
      expect(payload.no).to.contain.key('o');
      expect(payload.no.o).to.contain.key('p');
      expect(payload.no.o.p).to.eq(1);
    });
  });
});
