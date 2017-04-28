var Defaults = require('../../../components/defaults');

describe('expressAuth/Defaults', function() {
	it('has the correct keys', function() {
    expect(Defaults).to.have.keys([
      'handlers',
      'keys',
      'method',
      'model',
      'options',
      'params',
      'secret',
      'slug',
      'token',
    ]);
  });
});
