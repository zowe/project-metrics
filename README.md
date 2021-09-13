# Project-metrics

### Contents
 - [Requirements](#requirements)
 - [Getting Started](#getting-started)
    - [Clone the repository](#clone-the-repository)
    - [The repository structure](#the-repository-struct)
    - [Running the containers](running-the-containers)
    - [Missing Data](#missing-data)
    - [Error logs](#error-logs)
    - [Report Generation](#report-generation)
    - [Volumes](#volumes)
 - [Backup and Restore](#backup-and-restore)
    - [Backup](#backup)
    - [Restore dumped data](#restore-dumped-data)
 - [License](LICENSE)

### Requirements
- `api.env` file
- `client.env` file
- `db.env` file

These 3 files must be filled with the detail provided by the template to their corresponding .env.example files.

- `metricsAnalyticsData.json` file

Contains the JSON for accessing the Google analytics api.

## Getting Started
### Clone the repository
```
git clone https://github.com/zowe/project-metrics.git
```
### The repository structure
- `├──`[`zowe-metrics-api`](./zowe-metrics-api) — contains source code for the server-side.<br>
  <!-- - `├──`[`eslint-plugin-zowe-explorer`](./packages/eslint-plugin-zowe-explorer) — includes necessary files to configure ESLint plug-in for Zowe Explorer
  - `├──`[`zowe-explorer-api`](./packages/zowe-e) -->
- `├──`[`zowe-metrics-client`](./zowe-metrics-client) — contains source code for the client-side.<br>


### Running the containers
Move into the `project-metrics` directory

```
cd project-metrics
```
Then run

```
docker-compose up -d --build
```
This builds and runs 3 docker containers:
- The database (metrics-db)
- API (metrics-api)
- Client (metrics-client)

Then navigate to the client `PORT` specified in the `client.env` file e.g. `http://localhost:3001/` to see the locally hosted metric site.

### Missing data
On start-up, you may find that the graphs and data have not been restored. To dump and restore the backed-up data, refer to [Backup and Restore](#Backup-and-Restore).

### Error logs
To monitor the error logs for each of the three containers, run

```
docker logs [CONTAINER]
```
where CONTAINER is one of `metrics-db`, `metrics-api` or `metrics-client`.

More documentation can be found [here](https://docs.docker.com/engine/reference/commandline/logs/).

### Report Generation
Reports are periodically generated at 00:01:00 every month, which is defined in [app.js](./zowe-metrics-api/app.js).

### Volumes
Running these containers will create 2 local directories at the root of the project:

- `data` - Persistent data storage for the MongoDB. If the containers are deleted and recreated, the data will not be lost.
- `PDFStore` - Contains the PDF reports generated each month by the API container. If the containers are deleted and recreated, the PDFs are not lost.

Optional:

- `dumps` - See Backup section below - contains data dumps of the database for restoration purposes if the data directory is also lost.

## Backup and Restore
### Backup
To backup the data to the directory `dump/{Date}` (eg - /dump/24-06-2021), execute the command:


```
docker exec -it {DB_CONTAINER_NAME} mongodump -d {DATABASE_NAME} -o /dump/$(date +'%d-%m-%Y') -u {DATABASE_USERNAME} -p {DATABASE_PASSWORD} --authenticationDatabase {DATABASE_AUTH_DATABASE}
```

#### Command Options
`-d` - Name of the database inside the database container. (eg - container called metrics-db containing a database called ZoweMetricsDB).

`-o` - Output directory of the data dump. This directory will container a new directory called the same name as the database, containing files used to backup the data.

`-u` - Username for the database, specififed initially in the db.env file.

`-p` - Password for the database, specififed initially in the db.env file.

`--authenticationDatabase` - Database used to authenticate the user - Default is admin.

### Restore dumped data
Restore dumped/backed-up data by executing the command:

```
docker exec -it {DB_CONTAINER_NAME} mongorestore {DIR_OF_DUMP} -u {DATABASE_USERNAME} -p {DATABASE_PASSWORD} --authenticationDatabase {DATABASE_AUTH_DATABASE}
```

#### Command Options
`-d` - Name of the database inside the database container. (eg - container called `metrics-db` containing a database called ZoweMetricsDB).

`DIR_OF_DUMP` - Directory specified in the backup command (eg - `dump/24-06-2021`).

`-u` - Username for the database, specififed initially in the `db.env` file.

`-p` - Password for the database, specififed initially in the `db.env` file.

`--authenticationDatabase` - Database used to authenticate the user - Default is admin.