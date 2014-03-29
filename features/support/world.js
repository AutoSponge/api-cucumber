/*globals global*/
// #World
exports.World = function World( callback ) {
    'use strict';
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
var replace_ = global.replace_ = part.create_( String.prototype.replace );
var slice_ = global.slice_ = part.create_( Array.prototype.slice );
var take_ = global.take_ = slice_.bind( null, 0 );
global.trim = replace_( /^\s*|\s*$/g, '' );
var leave = global.leave = function ( n ) {
    'use strict';
    return function ( fn ) {
        return function () {
            return fn.apply( this, take_( n )( arguments ) );
        };
    };
};
global.guard = leave( 0 );
global.pluck = function ( prop ) {
    'use strict';
    return function ( obj ) {
        return obj[prop];
    };
};
global.request = function ( options, body, ssl ) {
    'use strict';
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
    'use strict';
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
    'use strict';
    return new Promise( function ( resolve, reject ) {
        return expression ? resolve() : reject( new Error( msg ) );
    } );
};
global.eq = function ( expected ) {
    'use strict';
    return function ( actual ) {
        return expected === actual;
    };
};