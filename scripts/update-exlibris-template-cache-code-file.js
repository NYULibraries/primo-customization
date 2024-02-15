/* global console fetch process URL */

import * as fs from 'node:fs';
import path from 'node:path';
import * as url from 'url';

const __dirname = url.fileURLToPath( new URL( '.', import.meta.url ) );

const ROOT = path.join( __dirname, '..' );
const EXLIBRIS_TEMPLATE_CACHE_CODE_FILE =
    path.join( ROOT, 'scripts/exlibris-template-cache-code.txt' );

// Regular expression for loose checking of valid domain name.
// Source:
//     Regular Expressions Cookbook, 2nd Edition
//     section 8.15: "Validating Domain Names"
// Direct link:
//     https://learning.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch08s15.html#uripath-domain-solution
const looksLikeValidDomainRegExp =
    new RegExp( '^([a-z0-9]+(-[a-z0-9]+)*\\.)+[a-z]{2,}$' );

// Regular expression for checking valid IPv4 address.
// Source:
//     Regular Expressions Cookbook, 2nd Edition
//     section 8.16: "Matching IPv4 Addresses"
// Direct link:
//     https://learning.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch08s16.html#uripath-ip4-solution
const validIPv4AddressRegExp =
    new RegExp( '^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$' );

async function fetchSourceMapJson( url ) {
    const response = await fetch( url );

    if ( response.status === 200 ) {
        const responseText = await response.text();

        return JSON.parse( responseText );
    } else {
        throw `${ url }: HTTP ${ response.status } (${ response.statusText })`;
    }
}

async function main() {
    const primoDomain = process.argv[ 2 ];

    if ( !primoDomain ) {
        console.error( 'Please provide a valid Primo VE domain name or IP address.' );
        console.error( `Usage: ${ path.basename( process.argv[ 1 ] ) } PRIMO_DOMAIN_NAME_OR_IP_ADDRESS` );

        process.exit( 1 );
    }

    // Note that certain Ex Libris IP addresses cause `fetch` to fail due to
    // certificate issues.  Example:
    // "Error [ERR_TLS_CERT_ALTNAME_INVALID]: Hostname/IP does not match
    // certificate's altnames: IP: 216.147.212.109 is not in the cert's list"
    if (
        !primoDomain.match( looksLikeValidDomainRegExp ) &&
        !primoDomain.match( validIPv4AddressRegExp )
    ) {
        console.error( `"${ primoDomain }" is not a valid domain name or IPv4 address.` );

        process.exit( 1 );
    }

    let sourceMapJson;
    try {
        sourceMapJson = await fetchSourceMapJson(
            `https://${ primoDomain }/discovery/lib/bundle.js.map` );
    } catch ( e ) {
        console.error( e );

        process.exit( 1 );
    }

    const templateCacheFileIndex =
        sourceMapJson.sources.findIndex( source => source === 'templates.js' );

    fs.writeFileSync(
        EXLIBRIS_TEMPLATE_CACHE_CODE_FILE,
        sourceMapJson.sourcesContent[ templateCacheFileIndex ],
        { 'encoding' : 'utf8' },
    );
}

main();
