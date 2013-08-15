/**
 * Service Loader for the restapi tool
 */

var path = require( 'path' );

// Load the YAML parser module
require( 'js-yaml' );

// Load the should module for validation
var should = require( 'should' );

var config = {};    // restapi configuration file
var services = {};  // Descriptors of all services

var loadFile = function (contentFileName) {
    var content = require(contentFileName);
    return content;
};

var loadConfig = function(configFileName) {
    return loadFile(configFileName);
};

var validateServiceParameter = function (parameter) {
    parameter.should.be.a('object');
    parameter.should.have.property('name');
    parameter.should.have.property('kind');
    ['URL', 'QUERY', 'BODY'].should.include(parameter.kind);
    parameter.should.have.property('required'); // true | false
    [true, false].should.include(parameter.required);
    parameter.should.have.property('type');
    parameter.should.have.property('summary');
    parameter.should.have.property('default');
};

var validateServiceStatusCode = function (statusCode) {
    statusCode.should.be.a('object');
    statusCode.should.have.property('statusCode');
    statusCode.should.have.property('reason');
};

var validateServiceCookie = function (cookie) {
    cookie.should.be.a('object');
    cookie.should.have.property('Cookie');
};

var validateServiceExample = function (example) {
    example.should.be.a('object');
    example.should.have.property('url');

    example.should.have.property('request');
    example.request.should.be.a('object');
    example.request.should.have.property('cookies').and.be.an.instanceOf(Array);
    example.request.should.have.property('headers').and.be.an.instanceOf(Array);

    example.should.have.property('response');
    example.response.should.be.a('object');
    example.response.should.have.property('cookies').and.be.an.instanceOf(Array);
    example.response.should.have.property('headers').and.be.an.instanceOf(Array);
    example.response.should.have.property('statusCode');
    example.response.should.have.property('body');
};

var validateServiceDescriptor = function (serviceDesc) {
    serviceDesc.should.be.a('object');
    serviceDesc.should.have.property('name');
    serviceDesc.should.have.property('description');
    serviceDesc.should.have.property('urlPattern');
    serviceDesc.should.have.property('style');
    serviceDesc.should.have.property('methods');

    serviceDesc.methods.should.be.a('object');

    for( var method in serviceDesc.methods ) {
        if( serviceDesc.methods.hasOwnProperty(method) ) {
            ['GET', 'PUT', 'POST', 'DELETE'].should.include( method );
            var serviceMethod = serviceDesc.methods[method];
            serviceMethod.should.be.a('object');
            serviceMethod.should.have.property('summary');
            serviceMethod.should.have.property('notes');
            // serviceMethod.should.have.property('implementation');
            serviceMethod.should.have.property('request');
            serviceMethod.should.have.property('responses');
            serviceMethod.should.have.property('testCases');

            serviceMethod.request.should.have.property('parameters').and.be.an.instanceOf(Array);
            serviceMethod.request.parameters.forEach(function(parameter){validateServiceParameter(parameter)});

            // serviceMethod.should.have.property('statusCodes').and.be.an.instanceOf(Array);
            // serviceMethod.statusCodes.forEach(function(statusCode){validateServiceStatusCode(statusCode)});

            serviceMethod.request.should.have.property('cookies').and.be.an.instanceOf(Array);
            // TODO: validate the array items
            serviceMethod.request.cookies.forEach(function(cookie){validateServiceCookie(cookie)});

            // serviceMethod.should.have.property('examples').and.be.a('object');
            // TODO: validate the array items
            // serviceMethod.examples.forEach(function(example){validateServiceExample(example)});

            // serviceMethod.should.have.property('responseValidationSchema');
        }
    }
};

exports.load = function(restapiRoot) {

    config = loadConfig(path.resolve(restapiRoot,'config.yml'));

    var baseFolder = path.resolve(restapiRoot, config.servicesRoot),
        servicesToLoad = config.services;

    return loadServices(baseFolder, servicesToLoad);
};

var updateMethodLists = function (serviceDescriptor) {
    serviceDescriptor.methodList = [];

    for(var method in serviceDescriptor.methods) {
        if(serviceDescriptor.methods.hasOwnProperty(method)) {
            serviceDescriptor.methods[method].methodName = method;
            serviceDescriptor.methodList.push(serviceDescriptor.methods[method]);
        }
    }
};

var loadServices = function(baseFolder, servicesToLoad) {
    // serviceFolders
    servicesToLoad.forEach(function (servicePath) {
        var serviceDescriptorFileName = baseFolder + servicePath + '/service.yml';

        // Load the YAML format service descriptor
        console.log('Loading ' + serviceDescriptorFileName);
        var serviceDescriptor = require( serviceDescriptorFileName );

        // Validate the service description
        console.log('Validating ' + serviceDescriptorFileName);
        validateServiceDescriptor(serviceDescriptor);

        updateMethodLists(serviceDescriptor);

        // Set service description to services map
        console.log(serviceDescriptorFileName + 'service is loaded.\n');
        serviceDescriptor.contentPath = baseFolder + servicePath;
        services[serviceDescriptor.urlPattern] = serviceDescriptor;
    });
    return services;
};

exports.getMockResponseBody = function(method, serviceDesc) {
    var mockResponseBody = false;

    var mockBody = '';

    serviceDesc.methods[method].responses.forEach(function(response) {
        if (response.name === 'OK' &&
            typeof response.mockBody != 'undefined' &&
            response.mockBody != null) {
            mockBody = response.mockBody;
        }
    });

    console.log('mockBody: ', mockBody);
    if ( mockBody !== '' ) {
        mockResponseBody = loadFile(serviceDesc.contentPath + '/' + mockBody);
    }
    return mockResponseBody;
};

exports.getServices = function () {
    return services;
};

exports.getConfig = function () {
    return config;
};

// exports.getAllTestCases = function () {
//     var testCases = [];

//     for (var service in services ) {
//         if ( services.hasOwnProperty(service) ) {
//             console.log('get test cases of ' + service);
//             var serviceDesc = services[service];
//             for (var method in serviceDesc.methods ) {
//                 if( serviceDesc.methods.hasOwnProperty(method) ) {
//                     var methodDesc = serviceDesc.methods[method];
//                     for (var testCase in methodDesc.testCases ) {
//                         if( methodDesc.testCases.hasOwnProperty(testCase) ) {
//                             var testCaseDesc = methodDesc.testCases[testCase];
//                             testCases.push({
//                                 service: {
//                                     name: serviceDesc.name,
//                                     description: serviceDesc.description,
//                                     urlPattern: serviceDesc.urlPatern,
//                                     style: serviceDesc.style
//                                 },
//                                 method: method,
//                                 testCase: {
//                                     name: testCase,
//                                     description: testCaseDesc.description,
//                                     url: testCaseDesc.url,
//                                     template: testCaseDesc.template,
//                                     request: testCaseDesc.request,
//                                     response: testCaseDesc.response
//                                 }
//                             });
//                         }
//                     }
//                 }
//             };
//         }
//     }
//     return testCases;
// };

exports.getAllTestCases = function () {
    var testCases = [];

    for (var service in services ) {
        if ( services.hasOwnProperty(service) ) {
            console.log('get test cases of ' + service);
            var serviceDesc = services[service];
            for (var method in serviceDesc.methods ) {
                if( serviceDesc.methods.hasOwnProperty(method) ) {
                    var methodDesc = serviceDesc.methods[method];
                    methodDesc.testCases.forEach( function(testCaseDesc) {
                        testCases.push({
                            service: {
                                name: serviceDesc.name,
                                description: serviceDesc.description,
                                urlPattern: serviceDesc.urlPatern,
                                style: serviceDesc.style
                            },
                            method: method,
                            testCase: {
                                name: testCaseDesc.name,
                                description: testCaseDesc.description,
                                url: testCaseDesc.url,
                                template: testCaseDesc.template,
                                request: testCaseDesc.request,
                                response: testCaseDesc.response
                            }
                        });
                    });
                }
            };
        }
    }
    return testCases;
};