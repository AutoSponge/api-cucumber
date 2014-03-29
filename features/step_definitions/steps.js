/*globals _push, replace_, slice_, take_, trim, leave, pluck, request, processResponse, ok, eq */
module.exports = function () {

    this.World = require( '../support/world.js' ).World;

    this.Given( /^I call the API$/, function ( table, callback ) {
        var world = this;
        world.environment = world.environment || {};
        table.hashes().map( function ( hash ) {
            world.environment[hash.environment] = hash.baseURL;
        } );
        callback();
    } );

    this.When( /^I send a (.*?) request to (.*?)$/, function ( method, path, callback ) {
        var environment = this.environment[this.selectedEnvironment].split( '://' );
        return request( {
            hostname: environment[1],
            path: encodeURI( path ),
            method: method
        }, '', eq( 'https' )( environment[0] ) )
            .then( processResponse )
            .then( _push( this.responses ) )
            .then( leave( 0 )( callback ) )
            .catch( callback.fail );
    } );

    this.Then( /^the response code is (\d+)$/, function ( statusCode, callback ) {
        ok( this.responses
                .map( pluck( 'statusCode' ) )
                .map( String )
                .every( eq( statusCode ) ),
                'expected statusCode: ' + statusCode )
            .then( callback )
            .catch( callback.fail );
    } );

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