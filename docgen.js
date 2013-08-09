var generator = require('./generator.js');
var verbose = false;

/**
 * Generate the HTML format documentation
 * @return {bool}           `true` if succesfully executed, `false` otherwise
 */
exports.update = function (context, mode) {
    verbose = mode;
    console.log('Generate the HTML format documentation', context);

    if ( generator.createDirectoryTree('docs', [
        "/docs",
        "/docs/images",
        "/docs/js",
        "/docs/sass",
        "/docs/stylesheets" ], true) ) {

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
            "docs/README.md"
        ].forEach(function(fileName) {
            generator.copyFile(fileName, "templates", "docs", context);
        });
    }
    return true;
}
