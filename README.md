# Project-metrics

## Docker compose

### Requirements:

- api.env file
- client.env file
- db.env file
- metricsAnalyticsData.json file

### Start up

This builds and runs 3 docker containers; the database, API and Client applications.

```
docker-compose up -d --build
```

### Volumes

Running these containers will create 2 local directories at the root of the project:

- `data` - Persistent data storage for the MongoDB. If the containers are deleted and recreated, the data will not be lost.
- `PDFStore` - Contains the PDF reports generated each month by the API container. If the containers are deleted and recreated, the PDFs are not lost.

Optional:

- `dumps` - See Backup section below - contains data dumps of the database for restoration purposes if the data directory is also lost.

### Backup / Restore

---

Backup to `dump/{Date}` (eg - /dumps/24-06-2021)

Command

```
docker exec -it {DB_CONTAINER_NAME} mongodump -d {DATABASE_NAME} -o /dump/$(date +'%d-%m-%Y') -u {DATABASE_USERNAME} -p {DATABASE_PASSWORD} --authenticationDatabase {DATABASE_AUTH_DATABASE}
```

Command Options

`-d` -> Name of the database inside the database container. (eg - container called metrics-db containing a database called ZoweMetricsDB)

`-o` -> Output directory of the data dump. This directory will container a new directory called the same name as the database, containing files used to backup the data.

`-u` -> Username for the database, specififed initially in the db.env file.

`-p` -> Password for the database, specififed initially in the db.env file.

`--authenticationDatabase` -> Database used to authenticate the user - Default is admin

---

Restore dumped data

Command

```
docker exec -it {DB_CONTAINER_NAME} mongorestore {DIR_OF_DUMP} -u {DATABASE_USERNAME} -p {DATABASE_PASSWORD} --authenticationDatabase {DATABASE_AUTH_DATABASE}
```

Command Options

`-d` -> Name of the database inside the database container. (eg - container called metrics-db containing a database called ZoweMetricsDB)

`DIR_OF_DUMP` -> Directory specified in the backup command (eg - `dump/24-06-2021`)

`-u` -> Username for the database, specififed initially in the db.env file.

`-p` -> Password for the database, specififed initially in the db.env file.

`--authenticationDatabase` -> Database used to authenticate the user - Default is admin
