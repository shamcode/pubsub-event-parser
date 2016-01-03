var gulp = require( "gulp" );
var jscpd = require( "gulp-jscpd" );
var jscs = require( "gulp-jscs" );
var shell = require( "gulp-shell" );
var complexity = require( "gulp-complexity" );

gulp.task( "doc", shell.task( [
    "node ./node_modules/jsdoc/jsdoc.js -P ./package.json -c ./conf.json -R ./README.md"
] ) );

gulp.task( "complexity", function() {
    return gulp.src( [
        "*.js"
    ] ).pipe(
        complexity( { breakOnErrors: false } )
    );
} );

gulp.task( "cp-detector", function() {
    return gulp.src( [
        "*.js"
    ] ).pipe( jscpd( {
        verbose: true
    } ) );
} );

gulp.task( "code-style", function() {
    return gulp.src( [
        "*.js"
    ] ).pipe( jscs( {
        preset: "jquery"
    } ) ).on( "error", function() {
        debugger;
    } )
} );

gulp.task( "default", [ "complexity", "cp-detector", "code-style" ] );
