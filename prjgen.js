var verbose = false;

var createProjectTree = function(projectName, projectTree) {
    var path = require('path'),
        fs = require('fs');

    var projectPath = path.resolve(projectName);
    if (fs.existsSync(projectPath)) {
        console.log( "ERROR: Project folder exists yet!");
    } else {
        fs.mkdirSync(projectPath);
        console.log('Create the "' + projectPath + '" REST API project"');
        projectTree.forEach( function(dir) {
            var dirToCreate = path.resolve( path.join( projectName, dir));
            verbose && console.log('Create "' + dirToCreate + '"');
            fs.mkdirSync(dirToCreate);
        });
    }
}


/**
 * Create a new REST API project
 * @param  {string} projectName The name of the project
 * @return {bool}           `true` if succesfully executed, `false` otherwise
 */
exports.create = function (projectName, mode) {
    verbose = mode;

    createProjectTree(projectName, [
        "docs",
        "server",
        "services",
        "templates",
        "templates/docs",
        "templates/server",
        "templates/test",
        ]);
}
