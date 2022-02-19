# NodeJS backend for listicle report

## Start server

`npm start` - Start node server in dev mode

`npm test` - Start node server in test mode

`npm start:prod` - Start node server in prod mode

Make sure to update the config settings in `config.env` file which has to be created in the root folder of the project

To import initial setup data in `production` use
`mongorestore --db <databasename> --verbose <path-to-dump-folder-which-is-in-data/prod/dump>`
