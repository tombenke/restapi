/**
 * Recursively traverses the subdirectories under the 'dir' folder, 
 * and find the files that match the 'pattern'.
 * 
 * @param  {String} dir The base directory to start the searching
 * @param {RegExp} patter The regular expression to match the fiilename in directories
 * @return {Array}     An array of objects which contains the directory names and file names found
 */
var fs = require('fs');

function findFiles(dir, pattern) {
    var files = fs.readdirSync(dir);
    var results = [];

    for (var file in files) {
        if (!files.hasOwnProperty(file))
            continue;

        var name = dir + '/' + files[file];
        if (fs.statSync(name).isDirectory()) {
            results = results.concat(findFiles(name, pattern));
        } else if (fs.statSync(name).isFile()) {
            if (files[file].match(pattern)) {
                results.push(name);
            }
        }
    }
    return results;
}

console.log( findFiles('./examples', /service\.yml/));