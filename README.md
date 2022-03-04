# NodeJS backend for listicle report

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/eric-stanley/listicle/api-test?label=api-test&logo=github&style=for-the-badge)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/eric-stanley/listicle/e2e-test?label=e2e-test&logo=github&style=for-the-badge)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/eric-stanley/listicle/load-test?label=load-test&logo=github&style=for-the-badge)

<br />

![GitHub repo size](https://img.shields.io/github/repo-size/eric-stanley/listicle?logo=github&style=for-the-badge)
![Twitter Follow](https://img.shields.io/twitter/follow/ericstanley84?logo=twitter&style=for-the-badge)
![GitHub branch checks state](https://img.shields.io/github/checks-status/eric-stanley/listicle/main?logo=github&style=for-the-badge)
![Depfu](https://img.shields.io/depfu/dependencies/github/eric-stanley/listicle?logo=github&style=for-the-badge)
![GitHub](https://img.shields.io/github/license/eric-stanley/listicle?logo=github&style=for-the-badge)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/eric-stanley/listicle?logo=github&style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/eric-stanley/listicle?logo=github&style=for-the-badge)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/eric-stanley/listicle?logo=github&style=for-the-badge)

<br />

## Start server

`npm start` - Start node server in dev mode

`npm test` - To run all test suites

`npm run start:prod` - Start node server in prod mode

Make sure to update the config settings in `config.env` file which has to be created in the root folder of the project. To do this, just remove the `.sample` extension in `config.env.sample` and update the values as per need

To import initial setup data in `production` use
`mongorestore --db <databasename> --verbose <path-to-dump-folder-which-is-in-data/prod/dump>`
