var Sequelize = require('sequelize');

var Defaults = require('../../../../../components/defaults');
var ExpressAuth = require('../../../../../');

describe('expressAuth/Defaults/model/sequelize/config', function() {
  it('has the correct keys', function() {
    expect(ExpressAuth.get(['model', 'sequelize', 'config']))
      .to.have.keys([
        'extraColumns',
        'get',
        'path',
        'names',
        'model',
        'table',
      ]);
  });

  it('.path should be a string', function() {
    expect(ExpressAuth.get(['model', 'sequelize', 'config', 'path'])).to.be.a('string');
  });

  it('.names has the right keys', function() {
    expect(ExpressAuth.get(['model', 'sequelize', 'config', 'names'])).to.have.keys([
      'columnEmail',
      'columnPassword',
      'columnNonce',
      'columnSession',
    ]);
  });

  it('.model returns a Sequelize Model with correctly defined attributes', function() {
    var sequelize = new Sequelize(ExpressAuth.get(['model', 'sequelize', 'config']).get());
    var columnNames = ExpressAuth.get(['model', 'sequelize', 'config', 'names']);
    expect(Defaults.model.sequelize.config.model(sequelize).attributes)
      .to.contain.keys([
        'id',
        columnNames.columnEmail,
        columnNames.columnPassword,
        columnNames.columnNonce,
        columnNames.columnSession,
      ]);
  });
});