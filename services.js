#!/usr/bin/env node
'use strict';

/**
 * Service Loader for the restapi tool
 */

var path = require( 'path' );
var fs = require('fs');

// Load the YAML parser module
require( 'js-yaml' );

// Load the should module for validation
var should = require( 'should' );

var config = {};    // restapi configuration file
var services = {};  // Descriptors of all services

var loadFile = function (contentFileName, encoding) {
    console.log('loadFile:' + contentFileName);
    return(fs.readFileSync(contentFileName, encoding));
};

var loadJsonFile = function (contentFileName) {
    var content = require(contentFileName);
    return content;
};

var loadConfig = function(configFileName) {
    return loadJsonFile(configFileName);
};

var validateServiceParameter = function (parameter) {
    parameter.should.be.instanceof(Object);
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
    statusCode.should.be.instanceof(Object);
    statusCode.should.have.property('statusCode');
    statusCode.should.have.property('reason');
};

var validateServiceCookie = function (cookie) {
    cookie.should.be.instanceof(Object);
    cookie.should.have.property('Cookie');
};

var validateServiceExample = function (example) {
    example.should.be.instanceof(Object);
    example.should.have.property('url');

    example.should.have.property('request');
    example.request.should.be.instanceof(Object);
    example.request.should.have.property('cookies').and.be.an.instanceOf(Array);
    example.request.should.have.property('headers').and.be.an.instanceOf(Array);

    example.should.have.property('response');
    example.response.should.be.instanceof(Object);
    example.response.should.have.property('cookies').and.be.an.instanceOf(Array);
    example.response.should.have.property('headers').and.be.an.instanceOf(Array);
    example.response.should.have.property('statusCode');
    example.response.should.have.property('body');
};

var validateServiceDescriptor = function (serviceDesc) {
    serviceDesc.should.be.instanceof(Object);
    serviceDesc.should.have.property('name');
    serviceDesc.should.have.property('description');
    serviceDesc.should.have.property('style');
    serviceDesc.should.have.property('urlPattern');
    serviceDesc.should.have.property('methods');

    serviceDesc.methods.should.be.instanceof(Object);

    for( var method in serviceDesc.methods ) {
        if( serviceDesc.methods.hasOwnProperty(method) ) {
            ['GET', 'PUT', 'POST', 'DELETE'].should.include( method );
            var serviceMethod = serviceDesc.methods[method];
            serviceMethod.should.be.instanceof(Object);
            serviceMethod.should.have.property('summary');
            serviceMethod.should.have.property('notes');
            // serviceMethod.should.have.property('implementation');
            serviceMethod.should.have.property('request');
            serviceMethod.should.have.property('responses');
            serviceMethod.should.have.property('testCases');

            serviceMethod.request.should.have.property('parameters').and.be.an.instanceOf(Array);
            serviceMethod.request.parameters.forEach(function(parameter){validateServiceParameter(parameter);});

            // serviceMethod.should.have.property('statusCodes').and.be.an.instanceOf(Array);
            // serviceMethod.statusCodes.forEach(function(statusCode){validateServiceStatusCode(statusCode)});

            serviceMethod.request.should.have.property('cookies').and.be.an.instanceOf(Array);
            // TODO: validate the array items
            serviceMethod.request.cookies.forEach(function(cookie){validateServiceCookie(cookie);});

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

    return loadServices(restapiRoot, config.servicesRoot, servicesToLoad);
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

var loadServices = function(restapiRoot, servicesRoot, servicesToLoad) {
    var baseFolder = path.resolve(restapiRoot, servicesRoot);
    console.log('loadServices from ', baseFolder);

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
        serviceDescriptor.restapiRoot = restapiRoot;
        serviceDescriptor.contentPath = servicesRoot + servicePath;
        services[serviceDescriptor.urlPattern] = serviceDescriptor;
    });
    return services;
};

var findHeaderValue = function ( headers, field ) {
    var content = null;
    headers.forEach(function(header) {
        // console.log(header);
        if(header.field.toLowerCase() === field.toLowerCase()) {
            // console.log('Found ', header.content);
            content = header.content;
        }
    });
    return content;
};

exports.getMockResponseBody = function(method, serviceDesc) {
    var mockResponseBody = '';

    var mockBody = '';
    var contentType = 'application/json';

    serviceDesc.methods[method].responses.forEach(function(response) {
        if (response.name === 'OK' &&
            typeof response.mockBody != 'undefined' &&
            response.mockBody !== null) {
            mockBody = response.mockBody;
            contentType = findHeaderValue( response.headers, 'Content-Type' );
        }
    });

    console.log('mockBody: ' + mockBody + ' contentType: ' + contentType);
    if ( mockBody !== '' ) {
        mockBody = serviceDesc.restapiRoot + '/' + serviceDesc.contentPath + '/' + mockBody;
        if( contentType === 'application/json') {
            mockResponseBody = loadJsonFile(mockBody);
        } else {
            if( contentType === 'text/plain' ||
                contentType === 'text/html' ||
                contentType === 'text/xml') {
                mockResponseBody = loadFile(mockBody, 'utf-8');
            } else {
                mockResponseBody = loadFile(mockBody, null);
            }
        }
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
                                contentPath: serviceDesc.contentPath,
                                template: testCaseDesc.template,
                                request: testCaseDesc.request,
                                response: testCaseDesc.response
                            }
                        });
                    });
                }
            }
        }
    }
    return testCases;
};