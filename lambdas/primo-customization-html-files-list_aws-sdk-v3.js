// Based on https://github.com/awsdocs/aws-doc-sdk-examples/blob/9d1011c5a28763d5b8c0698fef84e7de59765287/javascriptv3/example_code/s3/actions/list-objects.js
'use strict';

import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const CDN_BUCKET_NAME = 'cdn-local-da70.library.nyu.edu';
const HTML_PREFIX = 'primo-customization/01NYU_INST-TESTWS01/html/';

const listObjectsV3Params = {
    Bucket: CDN_BUCKET_NAME,
    Prefix: HTML_PREFIX,
};
const client = new S3Client( { region: 'us-east-1' } );

async function getHtmlFilesArray() {
    const command = new ListObjectsV2Command( listObjectsV3Params );

    try {
        let isTruncated = true;

        let htmlFiles = [];
        while ( isTruncated ) {
            const {
                Contents,
                IsTruncated,
                NextContinuationToken,
            } = await client.send( command );

            const newTemplateNames = Contents.map( object => {
                const [ skip, templateName ] = object.Key.match( new RegExp( `^${ HTML_PREFIX }(.*)\.html` ), '' );

                return templateName;
            } );

            htmlFiles = htmlFiles.concat( newTemplateNames );

            isTruncated = IsTruncated;

            command.input.ContinuationToken = NextContinuationToken;
        }

        return htmlFiles;
    } catch ( err ) {
        throw err;
    }
}

export async function handler( event, context, callback ) {
    const htmlFiles = await getHtmlFilesArray();

    const response = {
        status           : '200',
        statusDescription: 'OK',
        headers: {
            'access-control-allow-origin' : [
                {
                    key   : 'Access-Control-Allow-Origin',
                    value : '*'
                }
            ],
            'content-type': [{
                key: 'Content-Type',
                value: 'application/json'
            }]
        },
        body: JSON.stringify( htmlFiles, null, '    ' ),
    };

    callback( null, response );
}
