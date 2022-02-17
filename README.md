# NodeJS backend for listicle report

## Start server

Run `npm start` to start the node server in dev mode. Make sure to update the config settings in `config.env` file which has to be created in the root folder of the project

## Before running test `npm run test`

Change the below lines in `node_modules/whatwg-url/lib/encoding.js` from

`const utf8Encoder = new TextEncoder();`
`const utf8Decoder = new TextDecoder("utf-8", { ignoreBOM: true });`

to

`const util= require('util');`
`const utf8Encoder = new util.TextEncoder();`
`const utf8Decoder = new util.TextDecoder("utf-8", { ignoreBOM: true });`
