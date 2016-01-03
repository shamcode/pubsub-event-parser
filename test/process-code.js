var expect = require( "chai" ).expect,
    Store = require( "../store" ),
    processCode  = require( "../process-code" );

describe( "Processing code", function() {

    describe( "Empty code", function() {
        var store = new Store();
        processCode( "", "", store );

        it( "Store empty", function() {
            expect( store.byName ).to.be.empty;
        } );
    } );

    describe( "Code with syntax error", function() {
        var store = new Store();
        processCode( "var a =;", "", store );

        it( "Store empty", function() {
            expect( store.byName ).to.be.empty;
        } );
    } );

    describe( "One event", function() {
        var sample,
            store;

        sample = function() {
            PubSub.subscribe( "foo", function() {
                PubSub.subscribe( "foo", function() {
                    PubSub.publish( "foo", 1 );
                } )
            } );

            PubSub.publish( "foo", 2 );
            PubSub.subscribe( "foo", function() {
                return 1;
            } )
        };

        store = new Store();

        // add "(" and ")" to correct AST build, else have syntax error: http://goo.gl/YykOs4
        processCode( "(" + sample.toString().replace( /\s+/g, "" ) + ")", "", store );

        it( "Event parsed", function() {
            expect( store.byName).to.have.property( "foo" );
        } );

        describe( "publish", function() {
            it( "Count publish eq 2", function() {
                expect( store.byName ).to.have.deep.property( "foo.publish" )
                    .that.to.have.length( 2 );
            } );

            it( "First publish data", function() {
                expect( store.byName ).to.have.deep.property( "foo.publish[0].code", "1" );
            } );

            it( "Second publish data", function() {
                expect( store.byName ).to.have.deep.property( "foo.publish[1].code", "2" );
            } );
        } );

        describe( "subscribe", function() {
            it( "Count subscribe eq 3", function() {
                expect( store.byName ).to.have.deep.property( "foo.subscribe" )
                    .that.to.have.length( 3 );
            } );

            it( "First subscribe data", function() {
                expect( store.byName ).to.have.deep.property(
                    "foo.subscribe[0].code",
                    ( function() {
                        PubSub.subscribe( "foo", function() {
                            PubSub.publish( "foo", 1 );
                        } )
                    } ).toString().replace( /\s+/g, "" )
                );
            } );

            it( "Second subscribe data", function() {
                expect( store.byName ).to.have.deep.property(
                    "foo.subscribe[1].code",
                    function() {
                        PubSub.publish( "foo", 1 );
                    }.toString().replace( /\s+/g, "" )
                )
            } );

            it( "Third subscribe data", function() {
                expect( store.byName ).to.have.deep.property(
                    "foo.subscribe[2].code",
                    ( function() {
                        return 1;
                    } ).toString().replace( /\s+/g, "" )
                );
            } )
        } );
    } );

    describe( "Two event", function() {
        var sample,
            store;

        sample = function() {
            PubSub.subscribe( "foo", function() {
                PubSub.subscribe( "bar", function() {
                    PubSub.publish( "foo", 1 );
                } )
            } );

            PubSub.publish( "bar", 2 );
            PubSub.subscribe( "foo", function() {
                return 1;
            } )
        };

        store = new Store();

        // add "(" and ")" to correct AST build, else have syntax error: http://goo.gl/YykOs4
        processCode( "(" + sample.toString().replace( /\s+/g, "" ) + ")", "", store );

        describe( "Event parsed foo", function() {
            it( "Have property foo", function() {
                expect( store.byName).to.have.property( "foo" );
            } );

            describe( "publish", function() {
                it( "Count publish eq 1", function() {
                    expect( store.byName ).to.have.deep.property( "foo.publish" )
                        .that.to.have.length( 1 );
                } );

                it( "First publish data", function() {
                    expect( store.byName ).to.have.deep.property( "foo.publish[0].code", "1" );
                } );
            } );

            describe( "subscribe", function() {
                it( "Count subscribe eq 2", function() {
                    expect( store.byName ).to.have.deep.property( "foo.subscribe" )
                        .that.to.have.length( 2 );
                } );

                it( "First subscribe data", function() {
                    expect( store.byName ).to.have.deep.property(
                        "foo.subscribe[0].code",
                        ( function() {
                            PubSub.subscribe( "bar", function() {
                                PubSub.publish( "foo", 1 );
                            } )
                        } ).toString().replace( /\s+/g, "" )
                    );
                } );

                it( "Second subscribe data", function() {
                    expect( store.byName ).to.have.deep.property(
                        "foo.subscribe[1].code",
                        ( function() {
                            return 1;
                        } ).toString().replace( /\s+/g, "" )
                    )
                } );
            } );
        } );

        describe( "Event parsed bar", function() {
            it( "Have property bar", function() {
                expect( store.byName).to.have.property( "bar" );
            } );

            describe( "publish", function() {
                it( "Count publish eq 1", function() {
                    expect( store.byName ).to.have.deep.property( "bar.publish" )
                        .that.to.have.length( 1 );
                } );

                it( "First publish data", function() {
                    expect( store.byName ).to.have.deep.property( "bar.publish[0].code", "2" );
                } );
            } );

            describe( "subscribe", function() {
                it( "Count subscribe eq 1", function() {
                    expect( store.byName ).to.have.deep.property( "bar.subscribe" )
                        .that.to.have.length( 1 );
                } );

                it( "First subscribe data", function() {
                    expect( store.byName ).to.have.deep.property(
                        "bar.subscribe[0].code",
                        ( function() {
                            PubSub.publish( "foo", 1 );
                        } ).toString().replace( /\s+/g, "" )
                    );
                } );
            } );
        } );
    } );

} );