/*globals global*/
exports.World = function World( callback ) {

    this.selectedEnvironment = 'DEV';
    this.responses = [];

    callback( this );

};

// #Dependencies
var http = require( 'http' );
var https = require( 'https' );
var part = require( 'part' );
var Promise = require( 'es6-promise' ).Promise;

// #Globals
global._push = part._create( Array.prototype.push );
global.replace_ = part.create_( String.prototype.replace );
global.slice_ = part.create_( Array.prototype.slice );
global.take_ = slice_.bind( null, 0 );
global.trim = replace_( /^\s*|\s*$/g, '' );
global.leave = function ( n ) {
    return function ( fn ) {
        return function () {
            return fn.apply( this, take_( n )( arguments ) );
        };
    };
};
global.pluck = function ( prop ) {
    return function ( obj ) {
        return obj[prop];
    };
};
global.request = function ( options, body, ssl ) {
    return new Promise( function ( resolve, reject ) {
        var httpLib = ssl ? https : http,
            req = httpLib.request( options, resolve );
        req.on( 'error', reject );
        if ( body ) {
            req.write( body );
        }
        req.end();
    } );
};
global.processResponse = function ( res ) {
    var body = '';
    res.on( 'data', function ( chunk ) {
        body += chunk;
    } );
    return new Promise( function ( resolve ) {
        res.on( 'end', function () {
            return resolve( {
                statusCode: res.statusCode,
                body: body
            } );
        } );
    } );
};
global.ok = function ( expression, msg ) {
    return new Promise( function ( resolve, reject ) {
        return expression ? resolve() : reject( new Error( msg ) );
    } );
};
global.eq = function ( expected ) {
    return function ( actual ) {
        console.log( expected, actual, typeof expected, typeof actual );
        return expected === actual;
    };
};