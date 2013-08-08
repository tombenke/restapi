var mu = require('mu2'),
    fs = require('fs'),
    path = require('path'),
    extend = require('./extend.js');
var verbose = false;

var createProjectTree = function(projectName, projectTree) {
    var projectPath = path.resolve(projectName);
    if (fs.existsSync(projectPath)) {
        console.log( "ERROR: Project folder exists yet!");
        return false;
    } else {
        fs.mkdirSync(projectPath);
        console.log('Create the "' + projectPath + '" REST API project"');
        projectTree.forEach( function(dir) {
            var dirToCreate = path.resolve( path.join( projectName, dir));
            verbose && console.log('Create "' + dirToCreate + '"');
            fs.mkdirSync(dirToCreate);
        });
        return true;
    }
};

var processTemplate = function(template, context) {
    var templateFileName = path.resolve(__dirname, "templates/project", template),
        fileName = path.resolve(context.projectName, template),
        buffer = '',
        view = {};
    verbose && console.log('templateFileName: ' + templateFileName);
    verbose && console.log('fileName: ' + fileName);

    extend(view, context);

    mu.compileAndRender(templateFileName, view)
        .on('data', function(c) {
            buffer += c.toString();
        })
        .on('end', function() {
            fs.writeFile(fileName, buffer, function(err) {
                if (err) throw err;
            });
        });
}

/**
 * Create a new REST API project
 * @param  {string} projectName The name of the project
 * @return {bool}           `true` if succesfully executed, `false` otherwise
 */
exports.create = function (context, mode) {
    verbose = mode;

    if ( createProjectTree(context.projectName, [
        "docs",
        "server",
        "services",
        "services/monitoring",
        "services/monitoring/isAlive",
        "templates",
        "templates/docs",
        "templates/server",
        "templates/test",
        "test" ]) ) {

        [
            "README.md",
            "Makefile",
            "config.yml",
            "package.json",

            "services/monitoring/isAlive/service.yml",

            "server/Readme.md",
            "server/api.js",
            "server/app.js",
            "server/config.js",
            "server/config.yml",
            "server/monitoring.js",
            "server/package.json",

            "templates/test/testGetMethod.mustache",
            "templates/test/testPostMethod.mustache"
        ].forEach(function(template) {
            processTemplate(template, context);
        });
    }
}