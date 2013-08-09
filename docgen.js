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
}

var generateServiceDoc = function(serviceDesc, context) {
    var templateFileName = path.join(process.cwd(), 'templates', 'docs', 'restapi.html'),
        fileName = path.join(process.cwd(), 'docs', serviceDesc.urlPattern.replace(/\//g, "_") + '.html'),
        buffer = '',
        view = {};
    console.log('Generate service doc: ' + serviceDesc.name);
    verbose && console.log('templateFileName: ' + templateFileName);
    verbose && console.log('fileName: ' + fileName);

    extend(view, context, serviceDesc);

    verbose && console.log('template context:', view);
    mu.compileAndRender(templateFileName, view)
        .on('data', function(c) {
            buffer += c.toString();
        })
        .on('end', function() {
            console.log('Writing to: ' + fileName + " " + buffer);
            fs.writeFile(fileName, buffer, function(err) {
                if (err) throw err;
            });
        });
}

/**
 * Generate the HTML format documentation
 * @return {bool}           `true` if succesfully executed, `false` otherwise
 */
exports.update = function (context, mode) {
    verbose = mode;
    console.log('Generate the HTML format documentation', context);
    initDocsFolder(context, mode);

    var services = require('./services.js');
    console.log();
    services.load( path.resolve( process.cwd(), context.servicesRoot), context.services);

    var allServices = services.getServices();
    verbose && console.log('All Services: ', allServices);

    for (var service in allServices) {
        if (allServices.hasOwnProperty(service)) {
            generateServiceDoc(allServices[service], context);
        }
    }
}
