#!/usr/bin/env node
'use strict';

var generator = require('./generator.js'),
    mu = require('mu2'),
    fs = require('fs'),
    path = require('path'),
    extend = require('./extend.js');
var verbose = false;
var marked = require('marked');

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
    return serviceDesc.name.toLowerCase().replace(/ /g, "_") + '.html';
};

/**
 * Converts each markdown-format fields of the view
 * @param  {[type]} doc [description]
 * @return {[type]}     [description]
 */
var convertMarkdown = function(doc) {
    var newDoc = {};

    mapOwnProperties(doc, function(property, propertyName) {
        if (typeof property === 'object') {
            if (property instanceof Array ) {
                newDoc[propertyName] = [];
                property.forEach(function(item) {
                    newDoc[propertyName].push(convertMarkdown(item));
                });
            } else {
                newDoc[propertyName] = convertMarkdown(property);
            }
        } else {
            if (propertyName === 'description' ||
                propertyName === 'summary' ||
                propertyName === 'details' ) {
                newDoc[propertyName] = marked(property);
            } else {
                newDoc[propertyName] = property;
            }
        }
    });

    return newDoc;
};

var generateDoc = function(templateFileName, view, outFileName) {
    var buffer = '';

    if (verbose) console.log('templateFileName: ' + templateFileName);
    if (verbose) console.log('fileName: ' + outFileName);

    if (verbose) console.log('template context:', JSON.stringify(view, null, '  '));
    mu.compileAndRender(templateFileName, view)
        .on('data', function(c) {
            buffer += c.toString();
        })
        .on('end', function() {
            // console.log('Writing to: ' + fileName + " " + buffer);
            fs.writeFile(outFileName, buffer, function(err) {
                if (err) throw err;
            });
        });
};

var generateDocIndex = function(context) {
    var templateFileName = path.join(process.cwd(), 'templates', 'docs', 'index.html'),
        outFileName = path.join(process.cwd(), 'docs/index.html');

    console.log('Generate document index');
    generateDoc(templateFileName, context, outFileName);
};

var generateServiceDoc = function(serviceDesc, context) {
    var templateFileName = path.join(process.cwd(), 'templates', 'docs', 'restapi.html'),
        outFileName = path.join(process.cwd(), 'docs', generateDocFileName(serviceDesc)),
        view = {};
    console.log('Generate service doc: ' + serviceDesc.name);

    extend(view, context, convertMarkdown(serviceDesc));
    generateDoc(templateFileName, view, outFileName);
};

var mapOwnProperties = function(obj, func) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            func(obj[property], property);
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

    // Load service descriptors
    var services = require('./services.js');
    services.load(process.cwd());

    // Prepare the list of all services for generation of documents
    var allServices = services.getServices();
    if (verbose) console.log('All Services: ', allServices);

    var serviceDocNames = [];
    context.serviceDocNames = serviceDocNames;
    mapOwnProperties( allServices, function( serviceDesc, property ) {
        serviceDocNames.push({
            name: serviceDesc.name,
            docFileName: generateDocFileName(serviceDesc)
        });
    });

    // Generate the documents for each service
    mapOwnProperties( allServices, function( serviceDesc, property ) {
        generateServiceDoc(serviceDesc, context);
    });

    // Generate the index.html
    generateDocIndex(context);
};
