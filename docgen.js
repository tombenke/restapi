var generator = require('./generator.js'),
    mu = require('mu2'),
    fs = require('fs'),
    path = require('path'),
    extend = require('./extend.js');
var verbose = false;

var initDocsFolder = function(context, mode) {
     if ( generator.createDirectoryTree('docs', [
        "/images",
        "/js",
        "/sass",
        "/stylesheets" ], true) ) {

        [
            "images",
            "js",
            "sass",
            "stylesheets"
        ].forEach(function(dirName) {
            generator.copyDir(dirName, "templates/docs", "docs", context, {
                forceDelete: true, // Whether to overwrite existing directory or not
                excludeHiddenUnix: true, // Whether to copy hidden Unix files or not (preceding .)
                preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
                inflateSymlinks: true // Whether to follow symlinks or not when copying files
                // filter: regexp, // A filter to match files against; if matches, do nothing (exclude).
                // whitelist: bool, // if true every file or directory which doesn't match filter will be ignored
            });
        });

        [
            "README.md"
        ].forEach(function(fileName) {
            generator.copyFile(fileName, "templates/docs", "docs", context);
        });
    }
    return true;
};

var generateDocFileName = function (serviceDesc) {
    console.log('generateDocFileName', serviceDesc);
    return serviceDesc.name.toLowerCase().replace(/ /g, "_") + '.html';
};

var generateServiceDoc = function(serviceDesc, context) {
    var templateFileName = path.join(process.cwd(), 'templates', 'docs', 'restapi.html'),
        fileName = path.join(process.cwd(), 'docs', generateDocFileName(serviceDesc)),
        buffer = '',
        view = {};
    console.log('Generate service doc: ' + serviceDesc.name);
    verbose && console.log('templateFileName: ' + templateFileName);
    verbose && console.log('fileName: ' + fileName);

    extend(view, context, serviceDesc);

    verbose && console.log('template context:', JSON.stringify(view, null, '  '));
    mu.compileAndRender(templateFileName, view)
        .on('data', function(c) {
            buffer += c.toString();
        })
        .on('end', function() {
            // console.log('Writing to: ' + fileName + " " + buffer);
            fs.writeFile(fileName, buffer, function(err) {
                if (err) throw err;
            });
        });
};

var mapOwnProperties = function(obj, func) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            // console.log('mapOwnProperty obj[' + property + '] : ' + obj[property]);
            func(obj[property]);
        }
    }
};

/**
 * Generate the HTML format documentation
 * @return {bool}           `true` if succesfully executed, `false` otherwise
 */
exports.update = function (context, mode) {
    verbose = mode;
    console.log('Generate the HTML format documentation', context);
    initDocsFolder(context, mode);

    mu.root = path.resolve('templates/docs/');

    var services = require('./services.js');
    services.load(process.cwd());

    var allServices = services.getServices();
    verbose && console.log('All Services: ', allServices);

    var serviceDocNames = [];
    mapOwnProperties( allServices, function( serviceDesc ) {
        serviceDocNames.push({
            name: serviceDesc.name,
            docFileName: generateDocFileName(serviceDesc)
        });
    });

    mapOwnProperties( allServices, function( serviceDesc ) {
        context.serviceDocNames = serviceDocNames;
        generateServiceDoc(serviceDesc, context);
    });
};
