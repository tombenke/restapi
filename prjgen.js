var verbose = false;

/**
 * Create a new REST API project
 * @param  {string} projectName The name of the project
 * @return {bool}           `true` if succesfully executed, `false` otherwise
 */
exports.create = function (projectName, mode) {
    verbose = mode;
    console.log('Create a new REST API project named: "' + projectName + '"');
}

