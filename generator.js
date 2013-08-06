function saveToJson( obj, toFileName ) {
    verbose && console.log( '  ...saving JSON to ' + toFileName);
    fs.writeFileSync( toFileName, JSON.stringify( obj, ' ', 4 ), encoding='utf8' );
}

/* Returns with the list of file names without the extension */
function getFileNames(path, extension)
{
    var docPath = __dirname + '/' + path;
    var fileNames = [];
    var findPattern = new RegExp("." + extension + "$");
    var replacePattern = new RegExp("." + extension + "$","g");
    fs.readdirSync( docPath ).forEach( function(fileName ) {
        if( fileName.match( findPattern ) ) {
            fileNames.push( fileName.replace( replacePattern, "" ) );
        }
    });

    verbose && console.log('Read "' + extension + '" files from ' + docPath );

    return fileNames;
}


function processFiles( config ) {
    verbose = config.verbose;
    getFileNames(config.fromDir, config.fromExt).forEach( function( fileName ) {
        var fromFileName = __dirname + '/' + config.fromDir + '/' + fileName + '.' + config.fromExt;
        var toFileName = __dirname + '/' + config.toDir + '/' + fileName + '.' + config.toExt;
        verbose && console.log( '\nprocess\n  ' + fromFileName + '\n  >> ' + toFileName);
        var obj = config.converter( fromFileName );
        config.postprocessors.forEach(function(processor) {
            if( processor.fileName == fileName ) {
                var newObj = processor.processorFunc(obj);
                if( processor.toFileName ) {
                    config.writer( newObj, __dirname + '/' + config.toDir + '/' + processor.toFileName + '.' + config.toExt );
                }
            }
        });
        config.writer( obj, toFileName );
//            console.log( JSON.stringify( transform( mmToJson(fromFileName,false) ), null, '    ' ) );
    });
}

function getActiveServices(servicesRoot) {
    var services = require('restapi')({
        servicesRoot: servicesRoot,
        services: [
            "/customers"
        ]});

    // console.log(JSON.stringify(services,null,'  '));
    return services;
}

function getDirectServices(services) {
    var directServices = [];

    for ( service in services ) {
        if ( services.hasOwnProperty(service) ) {
            var serviceDesc = services[service];
            for ( method in services[service].methods ) {
                if ( serviceDesc.methods.hasOwnProperty(method) ) {
                    var directServiceDesc = {
                        ns: serviceDesc.servicePath.replace(/^\//,"")
                            .replace(/\/.*$/,"")
                            .replace(/\//g, "."),
                        name: serviceDesc.name,
                        url: serviceDesc.urlPattern,
                        method: method
                    };
                    var methodParams = serviceDesc.methods[method].parameters;
                    if( methodParams /*&& typeof methodParams === 'list'*/ && methodParams.length > 0 ) {
                        directServiceDesc.paramsKind = {};

                        methodParams.forEach( function(parameter) {
                            directServiceDesc.paramsKind[parameter.name] = parameter.kind;
                        });
                    }
                    directServices.push(directServiceDesc);
                }
            }
        }
    }
    return directServices;
}

console.log(JSON.stringify(getDirectServices(getActiveServices(__dirname + examples')), null, '    '));
