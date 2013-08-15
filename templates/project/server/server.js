var fs = require( 'fs' );
var express = require( 'express' );
var request = require( 'request' );
var api = require('./api.js');
var monitoring = require('./monitoring.js');
var services = require('restapi').services;
// var services = require('../../../index.js').services;
var httpProxy = require('http-proxy');
var proxy = new httpProxy.RoutingProxy();

// Get configured
var config = {};
exports.config = config;
if( process.argv.length >= 3 ) {
    var baseConfig = require( './config.js' );
    config = baseConfig.setEnvironment( process.argv[2] );
} else {
    config = require( './config.js' ).parameters;
}
console.log( config );

// Load services config and service descriptors
services.load(__dirname + '/' + config.restapiRoot);
var allServices = services.getServices();
var servicesConfig = services.getConfig();
console.log('restapi config:', servicesConfig);

function apiProxy(host, port) {
    return function (req, res, next) {
        // console.log('apiProxy called to ' + req.host + ' ' + req.ip);
        if ((req.url.match(new RegExp('^' + servicesConfig.serviceUrlPrefix.replace(/\//gi, '\\/') + '\\/')) ) &&
            config.useRemoteServices) {
            console.log('forwarding ' + req.method + ' ' + req.url + ' request to ' + req.method + ' ' + host + ':' + port + req.url + '  from '+ req.host + ' - ' + req.ip);
            var proxyBuffer = httpProxy.buffer(req);
            proxy.proxyRequest(req, res, {host: host, port: port, buffer: proxyBuffer});
        } else {
            next();
        }
    }
}

var server = module.exports = express();
server.set('env', config.environment );

// Configure the middlewares
server.configure( function() {
        server.use( express.bodyParser() );
        server.use( express.methodOverride() );
        server.use( express.cookieParser() );
        server.use( express.session( {secret: 'keyboard cat'} ) );
        server.use( apiProxy(config.remoteHost, config.remotePort) );
        server.use( server.router );
        // server.use( '/data', express.static( __dirname + '/' + '../resources/data' ) );
        server.use( '/docs', express.static( __dirname + '/' + '../docs/build' ) );
        server.use( express.static( __dirname + '/' + config.documentRoot ) );
    });

server.configure( 'development', function() {
        server.use( express.errorHandler( {
                    dumpExceptions: true,
                    showStack: true
                }));
    });

server.configure( 'production', function() {
        server.use( express.errorHandler() );
    });

function restrict( req, res, next ) {
    next();
}

function accessLogger( req, res, next ) {
    console.log( req.method, req.url );
    next();
}

// Routes
server.all("*", accessLogger, restrict);

function writeHeader(response) {
    response.header( 'Content-Type', 'serverlication/json' );
    response.header( 'X-pmd-api-API-Version', servicesConfig.apiVersion );
}
exports.writeHeader = writeHeader;

function writeResponse(response, content) {
    writeHeader(response);
    response.write( JSON.stringify(content, null, '  ') );
    response.end( '\n' );
}
exports.writeResponse = writeResponse;

var defaultServiceCall = function (request, response, serviceDesc) {
    response.header( 'Content-Type', 'application/json' );
    // TODO: Use Headers and Cookies from serviceDesc
    writeResponse(response, services.getMockResponseBody(request.method, serviceDesc ) || serviceDesc);
}

var reformatUrlPattern = function (urlPattern) {
    // TODO: Replace {parameter} to :parameter
    var resultPattern = urlPattern.replace(/{/gi, ":").replace(/}/gi, "").toString();
    console.log(resultPattern);
    return resultPattern;
}

// Setup the services for mocking
function registerServiceMethod(serviceDesc, method) {
    console.log('register service ' + method + ' ' + serviceDesc.urlPattern);
    var methodDesc = serviceDesc.methods[method];
    var implementation = eval( serviceDesc.methods[method].implementation ) || defaultServiceCall;
    server[method.toLowerCase()](servicesConfig.serviceUrlPrefix + reformatUrlPattern(serviceDesc.urlPattern), function(request, response) {
        implementation(request, response, serviceDesc);
    });
}

for ( service in allServices ) {
    if ( allServices.hasOwnProperty(service) ) {
        var serviceDesc = allServices[service];
        for ( method in allServices[service].methods ) {
            if ( serviceDesc.methods.hasOwnProperty(method) ) {
                registerServiceMethod(serviceDesc, method);
            }
        }
    }
}

// Start the server to listen
server.listen( config.port );
console.log( "Express server listening on port %d in %s mode",
    config.port, server.settings.env );