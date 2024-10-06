# User Auth App
-  a simple authentication and user management API
  
# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|NODE_ENV                       | Environment                         | development                                    |
|DB_URI                         | Mongo Database URI                  | "mongodb://localhost:27017/db_name"            |
|JWT_SECRET                     | JWT secret key for encrypting       | "abc123'                                       |
|REQUESTS_RATE_LIMIT            | How many requests to be sent in a given interval  | 50                               |
|RATE_LIMIT_INTERVAL_IN_MS      | How long to remember requests for, in milliseconds. | 300000                         |



# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 20.15.1
- Install [Mongodb] `brew install mongodb`.
- Setup [Mongodb Cluster](https://www.mongodb.com/docs/guides/atlas/cluster/) to get your `DB_URI`


# Getting started locally
- Clone the repository
  
```console
git clone `git@github.com:MernaMaklad25/UserAuthAppEY.git`
```

- Install dependencies

```console
cd UserAuthAppEY
npm install
```

- Build and run the project

```console
npm start
```

- The test can be run using
 
  ```console
  npm test
  ```

- API Document endpoints

  Swagger Spec Endpoint : `http://localhost:3000/api-docs/#/`

# Getting started docker
You can also run this app as a Docker container:

- Clone the repository

```console
git clone `git@github.com:MernaMaklad25/UserAuthAppEY.git`
```

- Run docker compose

```console
docker compose up.
```

