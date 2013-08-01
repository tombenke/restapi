#!/usr/bin/env node
/**
 * RestApi Specification Generator utility
 */
(function() {
    var verbose = false;
    var fs = require('fs');
    var jsyaml = require( 'js-yaml' );
    // var engine = require('../processor.js');
    var program = require('commander');
    program._name = 'rasgen';
    var version = require(__dirname + '/../package.json').version;

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
        .version(version)
        .usage('[options]')
        .option('-c, --config <path>', 'set config path [./pconf.yml]')
        .parse(process.argv);

    if ( program.config && program.config !=="" ) {
        console.log('configuration ', readConfig(program.config));
        // engine.run( readConfig(program.config) );
    } else {
        program.help();
    }
})();
