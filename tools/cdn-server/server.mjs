/* global console, process, URL */

import * as http from 'http';
import { existsSync } from 'node:fs';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as url from 'url';

const __dirname = url.fileURLToPath( new URL( '.', import.meta.url ) );

const ROOT = path.join( __dirname, '..', '..' );

// Default to test fixture CDN
let cdnPath = path.join( ROOT, 'test', 'e2e', 'fixtures', 'cdn' );

// Check for user-provided CDN path
const cdnPathArg = process.argv.slice( 2 )[ 0 ];
if ( cdnPathArg ) {
    const cdnAbsolutePath = path.resolve( cdnPathArg );
    if ( existsSync( cdnAbsolutePath ) ) {
        cdnPath = cdnAbsolutePath;
    } else {
        console.error( `Invalid CDN path: ${ cdnPathArg }` );
        process.exit( 1 );
    }
}

const listenOn = 'http://localhost:3000';

const server = http.createServer();

function getContentType( pathname ) {
    const fileExtension = pathname.split( '.' ).pop();

    switch ( fileExtension ) {
    case 'css':
        return 'text/css; charset=UTF-8';
    case 'html':
        return 'text/html';
    case 'js':
        return 'application/javascript';
    default:
        return '';
    }
}

function requestListener( request, response ) {
    console.log( `[ REQUEST ] ${ request.method } ${ request.url }` );

    const requestUrl = new URL( request.url, listenOn );
    const contentType = getContentType( requestUrl.pathname );
    const file = path.join( cdnPath, requestUrl.pathname );

    fs.readFile( file )
        .then( contents => {
            response.setHeader( 'Access-Control-Allow-Origin', '*' );
            response.setHeader( 'Content-Type', contentType );
            response.writeHead( 200 );
            response.end( contents );

            console.log( `[ RESPONSE ] ${ file }` );
        } )
        .catch( err => {
            response.writeHead( 404 );
            response.end( `${ request.pathname } not found` );

            console.error( `[ ERROR ] ${ err.message }` );
        } );
}

server.on( 'request', requestListener );

server.listen( new URL( listenOn ).port );

console.log( `CDN server started on ${ listenOn }` );
