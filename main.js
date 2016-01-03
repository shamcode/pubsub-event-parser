/**
 * @module
 */

var Store = require( "./store" ),
    processCode = require( "./process-code" ),
    processPath = require( "./process-path" ),
    cli = require( "./cli" );

var path;

// if call directly by command line
if ( require.main === module ) {

    // Get file path argv
    path = process.argv[ 2 ];

    if ( path ) {

        // Path exists, process
        processPath( {
            path: path,
            finishCallback: cli.printResult
        } )
    } else {

        // Output error and hint
        console.log( "Path to file or directory empty. " );
        console.log( "Use: node main.js path-to-file-or-directory" )
    }
}
/** @type {module:process-code} */
module.exports.processCode = processCode;

/** @type {module:process-path} */
module.exports.processPath = processPath;

/** @type {module:store} */
module.exports.Store = Store;
