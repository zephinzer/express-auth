var Defaults = require('../../../../../components/defaults');

describe('expressAuth/Defaults/model/sequelize', function() {
  it('has the correct keys', function() {
    expect(Defaults.model.sequelize)
      .to.have.keys([
        'config',
        'handle',
      ]);
  });
});
