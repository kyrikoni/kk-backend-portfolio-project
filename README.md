# Northcoders House of Games API

## Background

We will be building an API for the purpose of accessing board games review data programmatically. We will be building a backend service which should provide this information to the front end architecture.

Our database is built using PSQL, and we will be interacting with it using node-postgres. It contains data on users, reviews, categories and comments, which are accessible via the endpoints provided and appropriate GET, POST, PATCH and DELETE methods.

**Hosted Version**

The hosted version of the API can be found here: <https://kk-backend-portfolio-project.onrender.com/api>

The gitHub repository can be found here: <https://github.com/kyrikoni/kk-backend-portfolio-project>

## Prerequisites

Please ensure the following are installed on your client as a minimum version, otherwise `npm install` will fail:

- **Node**: v19.0.0
- **Node Package Manager**: v8.19.2
- **PSQL**: v14.6

## Initial Setup

To set up your own repository, please follow the instructions below.

1. Copy the code from the repository and clone it to your client locally, using the following command:

   `git clone https://github.com/kyrikoni/kk-backend-portfolio-project`

2. Once it has been successfully cloned, access and open the directory using your code editor of choice (e.g. VSCode):

   ```
   cd kk-backend-portfolio-project/
   code .
   ```

3. In your editor, you will need to install all required dependencies using node package manager, using the `npm install` command.

**The following dependencies should now be installed:**

- **cors** v2.8.5
- **dotenv** v16.0.0
- **express** v4.18.2
- **pg** v8.7.3
- **pg-format** v1.0.4

**The following developer dependencies should now be installed:**

- **husky** v7.0.0
- **jest** v27.5.1
- **jest-extended** v2.0.0
- **jest-sorted** v1.0.14
- **supertest** v6.3.3

4. After cloning the repo locally, you will need to create the necessary environment variables in order to complete the setup and to successfully connect to both the development and test databases locally.

   To do this, please create two `.env` files to the root of the directory, as follows:

   `.env.dev`

- This will need to set the development environment database using the following code: `PGDATABASE=nc_games`

  `.env.test`

- This will need to set the test environment database using the following code: `PGDATABASE=nc_games_test`

  Ensure both files are added to your `.gitignore` file (this should be in place already but always worth a check!) so that they are not committed and pushed to your public repo on Github.

5. Create both databases by running the following command in your terminal:

   `npm run setup-dbs`

   The console should confirm the two databases have been created.

   If an error occurs, please ensure you have named/set up the `.env` files as outlined in step 4, and that they are stored in the root level of your directory.

6. The development database can then be seeded by running the following command in the terminal:

   `npm run seed`

   The terminal should confirm that four tables have been inserted into. If an error occurs, please ensure you have created th databases prior to seeding.

7. All that's left is to run the server locally, by using the following command:

   `npm start`

   The terminal should confirm that it has started listening for requests.

8. All method requests (GET, POST, PATCH and DELETE) can now be performed at `http://localhost:9090` using your API endpoint testing tool of choice (e.g. Insomnia)

_The available routes and methods on this API can be found below._

## Routes

The server has the following 9 endpoints:

- **GET /api** serves a JSON object of all available endpoints with example requests and responses
- **GET /api/categories** serves a list of all game categories
- **GET /api/users** serves a list of all active users
- **GET /api/reviews** serves a list of all game reviews submitted by users
- **GET /api/reviews/:review_id** serves the specific review corresponding to the review_id passed in
- **GET /api/reviews/:review_id/comments** serves a list of all associated comments with the corresponding review_id passed in
- **POST /api/reviews/:review_id/comments** posts a new comment to the requested review_id
- **PATCH /api/reviews/:review_id** modifies the votes on the requested review_id
- **DELETE /api/comments/:comment_id** deletes the requested comment from the corresponding review_id passed in

## Testing

The tests created can be found in the following directory:

`__tests__/app.test.js`

To run the testing suite, run the following command in your terminal:

`npm run test`

Please ensure you have the testing development dependencies installed (listed above), so that the tests complete successfully.

This should seed the tests database, with the test data, before each test, which the terminal should display that this is happening.
