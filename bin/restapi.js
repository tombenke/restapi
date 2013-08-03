#!/usr/bin/env node
/**
 * RestApi Specification Generator utility
 */
(function() {
    var verbose = false;
    var fs = require('fs');
    var jsyaml = require( 'js-yaml' );
    var engine = require('proper');
    var program = require('commander');
    var thisPackage = require(__dirname + '/../package.json');
    program._name = thisPackage.name;

    /**
     * Read the config file
     * @param  {string} fileName The name of the config file
     * @return {Object}          The configuration object
     */
    var readConfig = function( fileName ) {
        console.log('Read configuration from ' + fileName);
        var pathSep = require('path').sep;
        var inFileName = process.cwd() + pathSep + fileName;

        console.log( 'input file: ', inFileName );
        var config = require( inFileName );

        // TODO: validate config

        for ( var procs in config ) {
            if ( config.hasOwnProperty(procs) ) {
                config[procs].forEach(function(proc){
                    if ( proc.hasOwnProperty('fileName') ) {
                        proc.fileName = process.cwd() + pathSep + proc.fileName;
                    }
                });
            }
        }
        return config;
    };

    program
        .version(thisPackage.version)
        .command('docgen [target]')
        .description('Generate documentation')
        .option("-s, --standalone", "Creates a standalone copy of API specifications for docs")
        .action(function(target, options) {
                var mode = options.standalone || false;
                target = target || 'local';
                console.log('Generate docs for "%s" target with %s mode', target, mode);
            });

    program.parse(process.argv);

    // console.log(program);
    // if ( program.config && program.config !=="" ) {
    //     // console.log('configuration ', readConfig(program.config));
    //     engine.run( readConfig(program.config) );
    // } else {
    //     program.help();
    // }
})();
