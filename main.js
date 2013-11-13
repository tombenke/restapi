/**
 * Service Manager for the mocking REST API
 */

// Load the YAML parser module
require( 'js-yaml' );

// Load the should module for validation
var should = require( 'should' );

var services = {};

var validateServiceParameter = function (parameter) {
    parameter.should.be.an.Object;
    parameter.should.have.property('name');
    parameter.should.have.property('kind');
    ['URL', 'QUERY', 'BODY'].should.include(parameter.kind);
    parameter.should.have.property('required'); // true | false
    [true, false].should.include(parameter.required);
    parameter.should.have.property('type');
    parameter.should.have.property('summary');
    parameter.should.have.property('default');
}

var validateServiceStatusCode = function (statusCode) {
    statusCode.should.be.an.Object;
    statusCode.should.have.property('statusCode');
    statusCode.should.have.property('reason');
}

var validateServiceCookie = function (cookie) {
    cookie.should.be.an.Object;
    cookie.should.have.property('Cookie');
 }

var validateServiceExample = function (example) {
    example.should.be.an.Object;
    example.should.have.property('url');

    example.should.have.property('request');
    example.request.should.be.an.Object;
    example.request.should.have.property('cookies').and.be.an.instanceOf(Array);
    example.request.should.have.property('headers').and.be.an.instanceOf(Array);

    example.should.have.property('response');
    example.response.should.be.an.Object;
    example.response.should.have.property('cookies').and.be.an.instanceOf(Array);
    example.response.should.have.property('headers').and.be.an.instanceOf(Array);
    example.response.should.have.property('statusCode');
    example.response.should.have.property('body');
}

var validateServiceDescriptor = function (serviceDesc) {
    serviceDesc.should.be.an.Object;
    serviceDesc.should.have.property('name');
    serviceDesc.should.have.property('description');
    serviceDesc.should.have.property('urlPattern');
    serviceDesc.should.have.property('style');
    serviceDesc.should.have.property('methods');
    serviceDesc.methods.should.be.an.Object;

    for( var method in serviceDesc.methods ) {
        if( serviceDesc.methods.hasOwnProperty(method) ) {
            ['GET', 'PUT', 'POST', 'DELETE'].should.include( method );
            var serviceMethod = serviceDesc.methods[method];
            serviceMethod.should.be.an.Object;
            serviceMethod.should.have.property('parameters').and.be.an.instanceOf(Array);
            serviceMethod.parameters.forEach(function(parameter){validateServiceParameter(parameter)});

            serviceMethod.should.have.property('statusCodes').and.be.an.instanceOf(Array);
            serviceMethod.statusCodes.forEach(function(statusCode){validateServiceStatusCode(statusCode)});

            serviceMethod.should.have.property('cookies').and.be.an.instanceOf(Array);
            // TODO: validate the array items
            serviceMethod.cookies.forEach(function(cookie){validateServiceCookie(cookie)});

            serviceMethod.should.have.property('examples').and.be.an.Object;
            // TODO: validate the array items
            // serviceMethod.examples.forEach(function(example){validateServiceExample(example)});

            serviceMethod.should.have.property('responseValidationSchema');
        }
    }
}

var load = function(baseFolder, servicesToLoad) {
    // serviceFolders
    servicesToLoad.forEach(function (servicePath) {
        var serviceDescriptorFileName = baseFolder + servicePath + '/service.yml';

        // Load the YAML format service descriptor
        console.log('Loading ' + serviceDescriptorFileName);
        var serviceDescriptor = require( serviceDescriptorFileName );

        // Validate the service description
        console.log('Validating ' + serviceDescriptorFileName);
        validateServiceDescriptor(serviceDescriptor);

        // Set service description to services map
        console.log(serviceDescriptorFileName + 'service is loaded.\n');
        serviceDescriptor.contentPath = baseFolder + servicePath;
        services[serviceDescriptor.urlPattern] = serviceDescriptor;
    });
    return services;
};

var loadContent = function (contentFileName) {
    var content = require(contentFileName);
    return content;
};

exports = module.exports = function Services(opts) {
    load(opts.servicesRoot, opts.services);
    return services;
}

exports.loadContent = loadContent;