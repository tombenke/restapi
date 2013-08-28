var generator = require('./generator.js'),
    path = require('path');
var verbose = false;

/**
 * Create a new REST API project
 * @param  {string} projectName The name of the project
 * @return {bool}           `true` if succesfully executed, `false` otherwise
 */
exports.create = function (context, mode) {
    verbose = mode;

    if ( generator.createDirectoryTree(context.projectName, [
        "docs",
        "server",
        "services",
        "services/monitoring",
        "services/monitoring/isAlive",
        "templates",
        "templates/docs",
        "templates/docs/images",
        "templates/docs/js",
        "templates/docs/sass",
        "templates/docs/stylesheets",
        "templates/server",
        "templates/test",
        "test" ], false) ) {

        [
            "docs",
            "templates/docs"
        ].forEach(function(dirName) {
            generator.copyDir(dirName, path.resolve(__dirname, "templates/project"), context.projectName, context, {
                forceDelete: true, // Whether to overwrite existing directory or not
                excludeHiddenUnix: true, // Whether to copy hidden Unix files or not (preceding .)
                preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
                inflateSymlinks: true // Whether to follow symlinks or not when copying files
                // filter: regexp, // A filter to match files against; if matches, do nothing (exclude).
                // whitelist: bool, // if true every file or directory which doesn't match filter will be ignored
            });
        });

        [
            "README.md",
            "Makefile",
            "config.yml",
            "package.json",

            "services/monitoring/isAlive/service.yml",

            "server/Readme.md",
            "server/api.js",
            "server/server.js",
            "server/config.js",
            "server/config.yml",
            "server/monitoring.js",
            "server/package.json",

            "templates/test/testGetMethod.mustache",
            "templates/test/testPostMethod.mustache"
        ].forEach(function(template) {
            generator.processTemplate(template, context);
        });
    }
}