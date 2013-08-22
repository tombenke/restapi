var request = require('superagent'),
	should = require('should'),
	mocha = require('mocha');

describe('Succesfully creates a new customer', function() {
	var agent = request.agent();

	it('should successfully Succesfully creates a new customer', function(done) {
		var path = require('path');
		var body = require(path.join(__dirname, '..', 'services', 'customers', 'postCustomer-responseBody.json'));
		agent
			.post('http://localhost:3007/rest/customers')
			.auth('username', 'password')
			.send(body)
			
			.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
			
			.set('Accept-Encoding', 'gzip, deflate')
			
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				
				res.should.have.header('Content-Type', 'application/json');
				
				res.should.have.header('X-Application-Version', 'v0.4');
				
				res.should.have.header('X-Application-API-Version', 'v0.1');
				
				res.should.have.property('body');
				// FIXME add further checks if appropriate
				
				var JaySchema = require('jayschema');
				var js = new JaySchema(JaySchema.loaders.http);
				var schema = require(path.join(__dirname, '..', 'schemas', 'customer.json'));
				js.validate(res.body, schema, function(errs) {
					should.not.exist(errs);
					done();
				});
				
				
			});
	});
});