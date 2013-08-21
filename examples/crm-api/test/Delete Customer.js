var request = require('superagent'),
    should = require('should'),
    mocha = require('mocha');

describe('Successfully delete the customer', function() {
    var agent = request.agent();

    it('should Successfully delete the customer', function(done) {
        agent
            .del('http://localhost:3007/rest/customers/1')
            .auth('John', 'Doe')
            
            .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
            
            .set('Accept-Encoding', 'gzip, deflate')
            
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                
                res.should.have.header('X-Application-Version', 'v0.4');
                
                res.should.have.header('X-Application-API-Version', 'v0.1');
                
                res.should.have.property('body');
                // FIXME add further checks if appropriate
                
                done();
            });
    });
});