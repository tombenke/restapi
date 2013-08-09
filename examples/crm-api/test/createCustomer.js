var request = require('superagent'),
	should = require('should'),
	mocha = require('mocha');

describe('Succesfully creates a new customer', function() {
	var agent = request.agent();

	it('should Succesfully creates a new customer', function(done) {
		var path = require('path');
		var body = require(path.join(__dirname, '..', 'services', 'customers', 'postCustomer-responseBody.json'));
		agent
			.post('http://localhost:3007/rest/customers')
			.auth('John', 'Doe')
			.send(body)
			.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
			.set('Accept-Encoding', 'gzip, deflate')
			.end(function(err, res) {
				// console.log(res);
				should.not.exist(err);
				res.should.have.status(200);
				
				res.headers['content-type'].should.equal('application/json');
				
				res.headers['x-crm-version'].should.equal('v0.1');
				
				res.headers['x-crm-api-version'].should.equal('v0.1');
				
				res.should.have.property('body');
				// FIXME add further checks if appropriate
				var JaySchema = require('jayschema');
				var js = new JaySchema(JaySchema.loaders.http);
				// done();
				var schema = require(path.join(__dirname, '../services/customers', 'createdCustomer.json'));
				console.log(schema, res.body);
				js.validate(res.body, schema, function(errs) {
					should.not.exist(errs);
					done();
				});
			});
	});
});