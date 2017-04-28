var ExpressAuth = require('../../../');

describe('ExpressAuth/Defaults/keys', function() {
  it('has the correct keys', function() {
		expect(ExpressAuth.get('keys')).to.contain('access');
    expect(ExpressAuth.get('keys')).to.contain('forgot');
    expect(ExpressAuth.get('keys')).to.contain('login');
    expect(ExpressAuth.get('keys')).to.contain('logout');
    expect(ExpressAuth.get('keys')).to.contain('register');
    expect(ExpressAuth.get('keys')).to.contain('verify');
	});
});
