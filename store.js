/**
 * @module
 */

var TYPES = require( "./types" );

/**
 * PubSub event occurrence record
 * @typedef {Object} module:store.EventOneOccurrence
 * @property {String} code       PubSub MemberCall second argument (callback or data argument)
 * @property {module:process-code.CodeLocation} loc  Location of code
 */

/**
 *  All PubSub event occurrence for once event (publish, subscribe, etc)
 *  @typedef {
 *      Object.<module:types.OccurrenceType, Array<module:store.EventOneOccurrence>>
 *  } module:store.EventOccurrence
 */

/**
 * Parsed event store
 * @constructor
 */
var Store = function() {
    /**
     * Store grouped by name.
     * @type {Object.<String, module:store.EventOccurrence>}
     */
    this.byName = {};
};

/**
 * Create occurrence store for event with passed name
 * @param {String} name Event name
 * @private
 */
Store.prototype._createEventOccurrence = function( name ) {

    // Flush or first create store
    this.byName[ name ] = {};

    // Create empty array for each supported occurrence type
    TYPES.forEach(
        function( typeName ) {
            this[ typeName ] = [];
        },
        this.byName[ name ]
    );
};

/**
 * Get one event occurrence store by name. If is not set, then create empty store for this event
 * @param {String} name Event name
 * @returns {module:store.EventOccurrence}
 */
Store.prototype.touchEventByName = function( name ) {
    if ( this.byName[ name ] === undefined ) {
        this._createEventOccurrence( name );
    }
    return this.byName[ name ];
};

/**
 * Save event occurrence in store
 * @param {module:process-code.ParsedOccurrence} eventOccurrence
 */
Store.prototype.save = function( eventOccurrence ) {
    var event;

    event = this.touchEventByName( eventOccurrence.name );

    event[ eventOccurrence.type ].push( {
        code: eventOccurrence.code,
        loc: eventOccurrence.loc
    } )
};

/**
 * Parsed event store
 * @type {module:store~Store}
 * @see module:store~Store
 */
module.exports = Store;
