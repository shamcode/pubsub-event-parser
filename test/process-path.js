var expect = require( "chai" ).expect,
    processPath  = require( "../process-path" );

describe( "Processing path", function() {

    it( "Directly file", function( done ) {
        processPath( {
            path: "node_modules/pubsub-js/test/test-bug-9.js",
            finishCallback: function( store ) {
                describe( "All event parse", function() {
                    describe( "Event a.b.c", function() {
                        it( "One subscriber", function() {
                            expect( store.byName ).to.have.property( "a.b.c" )
                                .that.have.property( "subscribe" )
                                .that.have.length( 1 );
                        } );
                        it( "And subscriber parse correct", function() {
                            expect( store.byName ).to.have.property( "a.b.c" )
                                .that.have.deep.property( "subscribe[0].code", "subscriber1" );
                        } );
                        it( "Empty publisher", function() {
                            expect( store.byName ).to.have.property( "a.b.c" )
                                .that.have.property( "publish" )
                                .that.to.be.empty;
                        } );
                    } );
                    describe( "Event a.b", function() {
                        it( "One subscriber", function() {
                            expect( store.byName ).to.have.property( "a.b" )
                                .that.have.property( "subscribe" )
                                .that.have.length( 1 );
                        } );
                        it( "And subscriber parse correct", function() {
                            expect( store.byName ).to.have.property( "a.b" )
                                .that.have.deep.property( "subscribe[0].code", "subscriber2" );
                        } );
                        it( "Empty publisher", function() {
                            expect( store.byName ).to.have.property( "a.b" )
                                .that.have.property( "publish" )
                                .that.to.be.empty;
                        } );
                    } );
                    describe( "Event a", function() {
                        it( "One subscriber", function() {
                            expect( store.byName ).to.have.property( "a" )
                                .that.have.property( "subscribe" )
                                .that.have.length( 1 );
                        } );
                        it( "And subscriber parse correct", function() {
                            expect( store.byName ).to.have.property( "a" )
                                .that.have.deep.property( "subscribe[0].code", "subscriber3" );
                        } );
                        it( "Empty publisher", function() {
                            expect( store.byName ).to.have.property( "a" )
                                .that.have.property( "publish" )
                                .that.to.be.empty;
                        } );
                    } );

                    describe( "Event a.b.c.d", function() {
                        it( "Empty subscriber", function() {
                            expect( store.byName ).to.have.property( "a.b.c.d" )
                                .that.have.property( "subscribe" )
                                .that.to.be.empty;

                        } );
                        it( "One publisher", function() {
                            expect( store.byName ).to.have.property( "a.b.c.d" )
                                .that.have.property( "publish" )
                                .that.have.length( 1 );
                        } );
                        it( "And publisher data parse correct", function() {
                            expect( store.byName ).to.have.property( "a.b.c.d" )
                                .that.have.deep.property( "publish[0].code" )
                                .that.to.be.null;
                        } );
                    } );
                    describe( "Event rootTopic", function() {
                        it( "One subscriber", function() {
                            expect( store.byName ).to.have.property( "rootTopic" )
                                .that.have.property( "subscribe" )
                                .that.have.length( 1 );
                        } );
                        it( "And subscriber parse correct", function() {
                            expect( store.byName ).to.have.property( "rootTopic" )
                                .that.have.deep.property( "subscribe[0].code", "subscriber" );
                        } );
                        it( "Empty publisher", function() {
                            expect( store.byName ).to.have.property( "rootTopic" )
                                .that.have.property( "publish" )
                                .that.to.be.empty;
                        } );
                    } );
                    describe( "Event rootTopic + '.d'", function() {
                        it( "Empty subscriber", function() {
                            expect( store.byName ).to.have.property( "rootTopic + '.d'" )
                                .that.have.property( "subscribe" )
                                .that.to.be.empty;

                        } );
                        it( "One publisher", function() {
                            expect( store.byName ).to.have.property( "rootTopic + '.d'" )
                                .that.have.property( "publish" )
                                .that.have.length( 1 );
                        } );
                        it( "And publisher data parse correct", function() {
                            expect( store.byName ).to.have.property( "rootTopic + '.d'" )
                                .that.have.deep.property( "publish[0].code" )
                                .that.to.be.null;
                        } );
                    } );
                } );
                done();
            }
        } );
    } );

    it( "Directory", function( done ) {
        processPath( {
            path: "node_modules/pubsub-js/test/",
            finishCallback: function( store ) {
                describe( "All event parse", function() {
                    it( "Count event", function() {
                        expect( store.byName ).to.have.satisfy( function( events ) {
                            return Object.keys( events ).length === 24;
                        } );
                    } );
                } );
                done();
            }
        } );
    } );
} );