/**
 * @module
 */

var fs = require( "fs" ),
    walk = require( "walk" ),
    path = require( "path" ),
    Store = require( "./store" ),
    processCode = require( "./process-code" );

/**
 * Callback calling after process done
 * @callback module:process-path~processPathCallback
 * @param {Object} store PubSub event occurrence store @see store
 */

/**
 * Options for processPath function
 * @typedef {Object} module:process-path.Options
 * @property {String} path                             Path for processing
 * @property {module:store~Store} store                Occurrence event store
 * @property {module:process-path~processPathCallback} finishCallback Done callback
 * @property {Boolean} amdImport                       Preliminary search of importers PubSub with
 *                                                     define
 */

/**
 * Merge passed options and default options
 * @param {module:process-path.Options} opt Passed options;
 */

function defaultOptions( opt ) {
    if ( opt.store === undefined ) {
        opt.store = new Store();
    }
    if ( opt.amdImport === undefined ) {
        opt.amdImport = false;
    }
}

/**
 * Recursive walking patch an processing *.js file
 * @param {module:process-path.Options} opt Options
 */
function processPath( opt ) {
    var walker;

    defaultOptions( opt );

    walker = walk.walk( opt.path,  { followLinks: false } );

    walker.on( "file", function( root, fileStat, next ) {
        var fileExtension,
            filePath;

        // Determinate file extension
        fileExtension = fileStat.name.split( "." );
        fileExtension = fileExtension[ fileExtension.length - 1 ];

        // parsing only *.js
        if ( fileExtension === "js" ) {

            // Get absolute file path
            filePath = path.resolve( root, fileStat.name );

            // Read file and process content
            fs.readFile( filePath, "utf8", function( err, code ) {

                processCode( code, filePath, opt.store, opt.amdImport );

                // Process next file
                next();
            } );
        } else {

            // Skip this file
            next();
        }
    } );

    walker.on( "end", function() {
        opt.finishCallback( opt.store );
    } );
}

/**
 * Recursive walking patch an processing *.js file
 * @type {module:process-path~processPath}
 */
module.exports = processPath;
