var verbose = false;

/**
 * Update test cases or create them, if they are missing
 * @param  {bool} overwrite Overwrite the existing files if `true`
 * @param  {bool} verbose   Work in verbose mode if `true`
 * @return {bool}           `true` if succesfully executed, `false` otherwise
 */
exports.update = function ( config, overwrite, mode ) {
    verbose = mode;
    console.log('Update test cases or create them, if they are missing.');
    if( overwrite ) {
        console.log('Overwrite the existing files');
    } else {
        console.log('Existing files will not be overwritten');
    }
}

