var request = require('superagent'),
	should = require('should'),
	mocha = require('mocha');

describe('Successfully retrieves all the customers', function() {
	var agent = request.agent();

	it('should successfully Successfully retrieves all the customers', function(done) {
		agent
			.get('http://localhost:3007/rest/customers')
			.auth('username', 'password')
			
			.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
			
			.set('Accept-Encoding', 'gzip, deflate')
			
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				
				// res.should.have.header('Content-Type', 'application/json');
				
				// res.should.have.header('X-Application-Version', 'v0.4');
				
				// res.should.have.header('X-Application-API-Version', 'v0.1');
				
				res.should.have.property('body');
				// FIXME add further checks if appropriate
				
				var path = require('path');
				var JaySchema = require('jayschema');
				// var js = new JaySchema(JaySchema.loaders.http);
				var js = new JaySchema();

				var schema = require(path.join(__dirname, '..', 'schemas', 'customerList.json'));

				js.validate(res.body, schema, function(errs) {
					should.not.exist(errs);
					done();
				});
				
				
			});
	});
});