# database-project
This project provides simple REST API for your MySQL database with user authorization support.
There is also a sample frontend written in Angular.js

## How to run the backend + sample frontend
* Install Node.js
* npm install
* node server.js
* point your browser to http://localhost:3000

## Quick API reference:
### Authorization:
* /login (GET - returns 200 if user is authorized, POST - logs user in)
* /logoff (GET - log user off)
 
### Fetching data from tables:
* /tables (GET - list tables)
* /table/:name (GET - list avaliable fields in the given table or view)
* /table/:name/:fields (GET - fetches data for the fields separated by commas)
* /reports (GET - list views)
 
### Writing data to the tables:
* /table/:name/:key/:id (POST - updates row on the given value of key)
