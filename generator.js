var mu = require('mu2'),
    fs = require('fs'),
    path = require('path'),
    wrench = require('wrench'),
    extend = require('./extend.js');
var verbose = true;

exports.createDirectoryTree = function(rootDirName, projectTree, removeIfExist) {
    var rootDirPath = path.resolve(rootDirName);

    if (fs.existsSync(rootDirPath)) {
        console.log( "ERROR: Directory exists yet! " + rootDirPath);
        if( ! removeIfExist ) {
            return false;
        }
        console.log('Remove existing directory...');
        wrench.rmdirSyncRecursive(rootDirPath);
    }

    fs.mkdirSync(rootDirPath);
    projectTree.forEach( function(dir) {
        var dirToCreate = path.resolve( path.join( rootDirName, dir));
        verbose && console.log('Create "' + dirToCreate + '"');
        fs.mkdirSync(dirToCreate);
    });
    return true;
};

exports.copyDir = function(dirName, sourceBaseDir, targetBaseDir, context, opts) {
    var sourceDirName = path.resolve(sourceBaseDir, dirName),
        destDirName = path.resolve(context.projectName, targetBaseDir, dirName);

    verbose && console.log('Copy dir from: ' + sourceDirName + ' to: ' + destDirName);
    wrench.copyDirSyncRecursive(sourceDirName, destDirName, opts);
}

exports.copyFile = function(fileName, sourceBaseDir, targetBaseDir, context) {
        console.log('copyFile...' + fileName);

    var sourceFileName = path.resolve(sourceBaseDir, fileName),
        destFileName = path.resolve(context.projectName, targetBaseDir, fileName);

    verbose && console.log('Copy file from: ' + sourceFileName + ' to: ' + destFileName);
    fs.writeFileSync(destFileName, fs.readFileSync(sourceFileName));
}

exports.processTemplate = function(template, context) {
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

