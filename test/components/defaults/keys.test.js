var ExpressAuth = require('../../../');

describe('ExpressAuth/Defaults/keys', function() {
  it('has the correct keys', function() {
		expect(ExpressAuth.get('keys')).to.contain.key('access');
    expect(ExpressAuth.get('keys')).to.contain.key('forgot');
    expect(ExpressAuth.get('keys')).to.contain.key('login');
    expect(ExpressAuth.get('keys')).to.contain.key('logout');
    expect(ExpressAuth.get('keys')).to.contain.key('register');
    expect(ExpressAuth.get('keys')).to.contain.key('verify');
	});
});
