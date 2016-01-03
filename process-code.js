/**
 * @module
 */
var esprima = require( "esprima" ),
    estraverse = require( "estraverse" ),
    TYPES = require( "./types" );

/**
 * Parse event name
 * @param {Object} node First argument of FunctionCall
 * @param {String} code Listing or source code
 * @returns {String}
 */
function parseEventName( node, code ) {
    var name;

    name = node.value;

    if ( name === undefined ) {

        // event is expression, save code of this expression as event name
        name = code.slice( node.range[ 0 ], node.range[ 1 ] )
    }

    return name;
}

/**
 * Parse second argument of PubSub.<member>(...)
 * @param {Object|undefined} node Second argument, if exist
 * @param {String} code Listing or source code
 * @returns {String}
 */
function parseSecondArgument( node, code ) {
    if ( node === undefined ) {
        return null;
    }
    return code.slice( node.range[ 0 ], node.range[ 1 ] );
}

/**
 * Location of code occurrence
 * @typedef {Object} module:process-code.CodeLocation
 * @property {Number} line   Number of line occurrence code
 * @property {Number} column Number of column occurrence code
 * @property {String} file   Absolute path to file contains occurrence code
 */

/**
 * Position argumentsCode in listing
 * @param {Array} args     Arguments node array
 * @param {String} filePath Absolute path to file contains occurrence code
 * @returns {module:process-code.CodeLocation}
 */
function parseSecondArgumentCodeLocation( args, filePath ) {
    var loc;

    loc = args.length === 1 ? args[ 0 ].loc.end : args[ 1 ].loc.start;

    return {
        line: loc.line,
        column: loc.column,
        file: filePath
    }
}

/**
 * @typedef {Object} module:process-code.ParsedOccurrence
 * @property {module:types.OccurrenceType} type Type of occurrence event
 * @property {String} name         Event name or part of code
 * @property {String} code         Code PubSub second arguments (callback or data argument)
 * @property {module:process-code.CodeLocation} loc    Location of code
 */

/**
 * Parse occurrence
 * @param {Object} node     Finded node of occurrence
 * @param {Object} parent   Parent node
 * @param {String} code     Listing of this source code file's
 * @param {String} filePath Absolute file path to source code
 * @returns {module:process-code.ParsedOccurrence}
 */
function parse( node, parent, code, filePath ) {
    var event,
        argumentCode,
        loc;

    event = parseEventName( parent.arguments[ 0 ], code );

    argumentCode = parseSecondArgument( parent.arguments [ 1 ], code );

    loc = parseSecondArgumentCodeLocation( parent.arguments, filePath );

    return {
        name: event,
        type: node.property.name,
        code: argumentCode,
        loc: loc
    }
}

/**
 * Parsing code, find all occurrence PubSub event and save in store
 * @param {String} code                 Listing of code
 * @param {String} filePath             Absolute  path to listing file
 * @param {module:store~Store} store    Event occurrence store @see store
 */
function processCode( code, filePath, store ) {
    try {

        // Parse and build AST-tree, see https://en.wikipedia.org/wiki/Abstract_syntax_tree
        var ast = esprima.parse( code, {
            tokens: true,
            comment: true,
            attachComment: true,
            loc: true,
            range: true,
            raw: true
        } );
    } catch ( exception ) {

        // Force silent parsing error
        return;
    }

    // Search all MemberCall for PubSub
    estraverse.traverse( ast, {
        enter: function( node, parent ) {
            var parsedOccurrence;

            // Search MemberExpression of PubSub
            if ( node.type === esprima.Syntax.MemberExpression &&
                node.object.name === "PubSub" &&
                TYPES.indexOf( node.property.name ) > -1 &&
                parent.arguments !== undefined ) {

                parsedOccurrence = parse( node, parent, code, filePath );

                // Save event occurrence
                store.save( parsedOccurrence );
            }
        }
    } );
}

/**
 * Parsing code, find all occurrence PubSub event and save in store
 * @type {module:process-code~processCode}
 */
module.exports = processCode;
