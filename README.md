# :chicken: Fuzzy Memory

## About
This application handles User Management (Login, Logout, Authentication, Verification..) using GraphQL.


### :exclamation: Requirements
* A running PostgreSQL-server.
* Node / npm.

### :runner: Run this project
1. Open a console and run `npm i` (or use `yarn`). 

2. Configure the database parameters in [`ormconfig.json`](./ormconfig.json) file.

_The default configuration specifies the following:_
* username: `postgres` - (Database-user username)
* password: `welcome1` - (Database-user password)
* database: `fuzzymemory` - (Name of an existing database to connect to)
* host: `localhost` - (Address where PostgreSQL is running)
* port: `5432` - (Port where PostgreSQL is running)

This lets TypeORM connect to the database, and perform database handling (create tables, entity handling).

3. Run `npm start`.

### :tshirt: Testing
Start the test-server using `npm test-server`.
Initialize the tests using `npm test` (or `yarn test`).
