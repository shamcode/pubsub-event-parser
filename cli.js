/**
 * @module
 */

/**
 * Print array of event occurrence with once occurrence type
 * @param {Array<module:store.EventOneOccurrence>} occurrences
 */
function printEventOneOccurrence( occurrences ) {
    occurrences.
        forEach( function( occurrence ) {
            console.log( "\t\t" + occurrence.code );
            console.log( "\t\t" + occurrence.loc.file );
            console.log(
                "\t\t\tLine: " + occurrence.loc.line +
                " Column: " + occurrence.loc.column
            );
        } );
}

/**
 * Print all occurrence type of eventOccurrence for one event
 * @param {module:store.EventOccurrence} eventOccurrence
 */
function printEventOccurrence( eventOccurrence ) {
    Object.keys( eventOccurrence ).
        forEach( function( typeName ) {
            var occurrences = eventOccurrence[ typeName ];

            console.log( "\t" + typeName );

            printEventOneOccurrence( occurrences );
        } );
}

/**
 * Output all PubSub event occurrence in store
 * @param {module:store~Store} store Event occurrence store @see Store
 */
function printResult( store ) {
    Object.keys( store.byName ).
        forEach( function( eventName ) {
            var eventOccurrence;

            console.log( eventName );

            eventOccurrence = store.byName[ eventName ];

            printEventOccurrence( eventOccurrence );
        } );
}

/**
 * Output all PubSub event occurrence in store
 * @type {module:cli~printResult}
 */
module.exports.printResult = printResult;
