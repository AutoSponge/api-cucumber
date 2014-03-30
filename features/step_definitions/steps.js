/*globals _push, trim, leave, pluck, request, processResponse, ok, eq */
module.exports = function () {
    'use strict';

    // standard boilerplate including the World constructor
    this.World = require( '../support/world.js' ).World;

    // processes the Background section
    // this will cache the API table to the world instance
    // this runs at the beginning of every scenario
    this.Given( /^I call the API$/, function ( table, callback ) {
        var world = this;
        world.environment = world.environment || {};
        table.hashes().map( function ( hash ) {
            world.environment[hash.environment] = hash.baseURL;
        } );
        callback();
    } );

    // a fairly generic request step which you can extend to
    // include authentication or to make multiple requests with different data
    this.When( /^I send a (.*?) request to (.*?)$/, function ( method, path, callback ) {
        var environment = this.environment[this.selectedEnvironment].split( '://' );
        return request( {
            hostname: environment[1],
            path: encodeURI( path ),
            method: method
        }, '', eq( 'https' )( environment[0] ) )
            .then( processResponse )
            .then( _push( this.responses ) )
            // leave( 0 ) acts as a guard.  if you don't guard the callback
            // the value of the previously resolved promise will cause the test to fail
            .then( leave( 0 )( callback ) )
            .catch( callback.fail );
    } );

    // a generic status code step
    this.Then( /^the response code is (\d+)$/, function ( statusCode, callback ) {
        ok( this.responses
                .map( pluck( 'statusCode' ) )
                .map( String )
                .every( eq( statusCode ) ),
                'expected statusCode: ' + statusCode )
            .then( callback )
            .catch( callback.fail );
    } );

    // a generic response body step
    // this allows us to check both string responses and and
    // structured responses because our request function does not parse
    this.Then( /^the response body is (.*?)$/, function ( body, callback ) {
        ok( this.responses
                .map( pluck( 'body' ) )
                .map( trim )
                .every( eq( trim( body ) ) ),
                'expected response body: ' + body )
            .then( callback )
            .catch( callback.fail );
    } );

    this.BeforeFeature( function ( _, callback ) {
        console.time( 'completed' );
        callback();
    } );

    this.AfterFeature( function ( _, callback ) {
        console.timeEnd( 'completed' );
        callback();
    } );

};