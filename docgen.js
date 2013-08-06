var verbose = false;

/**
 * Generate the HTML format documentation
 * @return {bool}           `true` if succesfully executed, `false` otherwise
 */
exports.update = function (mode) {
    verbose = mode;
    console.log('Generate the HTML format documentation');
}

