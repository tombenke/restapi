var request = require('superagent'),
	should = require('should'),
	mocha = require('mocha');

describe('Successfully checks if server is alive', function() {
	var agent = request.agent();

	it('should successfully Successfully checks if server is alive', function(done) {
		agent
			.get('http://localhost:3007/rest/monitoring/isAlive')
			.auth('username', 'password')
			
			.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
			
			.set('Accept-Encoding', 'gzip, deflate')
			
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				
				res.should.have.header('Content-Type', 'application/json');
				
				res.should.have.header('X-Application-API-Version', 'v0.0.0');
				
				res.should.have.property('body');
				// FIXME add further checks if appropriate
				
				done();
			});
	});
});