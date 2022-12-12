# Northcoders House of Games API

## Background

We will be building an API for the purpose of accessing board games review data programmatically. We will be building a backend service which should provide this information to the front end architecture.

Our database is built using PSQL, and we will be interacting with it using node-postgres.

## Initial Setup

After cloning the repo locally, you will need to create the necessary environment variables in order to complete the setup and to successfully connect to both the development and test databases locally.

To do this, please create two `.env` files as follows:

`.env.dev`

- This will need to set the development environment database using the following code: `PGDATABASE=nc_games`

`.env.test`

- This will need to set the test environment database using the following code: `PGDATABASE=nc_games_test`

Ensure both files are added to your `.gitignore` file (this should be in place already but always worth a check!) so that they are not committed and pushed to your public repo on Github.
