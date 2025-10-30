# hidb-back — Backend setup & DB initialization

Short guide to start the backend and initialize the MariaDB database using Docker 
## Deployment Link
https://hidb-back-git-sdp-2-aviation-museum.2.rahtiapp.fi

## Prerequisites
- Docker & Docker Compose
- Node.js & npm 
- DBeaver

## To Start
- Clone the repo
```bash
    git clone https://github.com/haagahelia/hidb-back
    cd /hidb-back
```
- Run 
```bash
    npm install
```
- Then add the .env file (find it on Teams)
```bash
        # db.env
        MARIADB_DATABASE=casedb
        MARIADB_USER=yourusername
        MARIADB_PASSWORD=yourpw

        # db.root.env
        MARIADB_ROOT_PASSWORD=yourrootpw

        # network.env
        DB_HOST=localhost
        DB_PORT=3307
        BE_SERVER_PORT=4678
```

## Initialize (fresh DB)
The 'docker-compose-db.yaml' file is set up so that db and schemas are automatically setup when run: 
```bash
    docker compose -f docker-compose-db.yaml up -d
```
Entrypoint init scripts run only on first initialization of the DB volume. If you come across a problem and want to rerun: 
```bash
# stop and remove containers and the DB volume
docker compose -f docker-compose-db.yaml down -v

# start DB container (it will run scripts under /docker-entrypoint-initdb.d)
docker compose -f docker-compose-db.yaml up -d

# follow logs
docker compose -f docker-compose-db.yaml logs -f mariadb_service
```
If logs show SQL execution, the DB is initialized.

## Start the db after it has been initialized 
- At this phase of the development, we have the database on docker, and it needs to be run first for backend's endpoints to work
    ```bash
    docker compose -f docker-compose-db.yaml up -d
    ```

## Start the backend
- Remember to start database first
    ```bash
    docker compose -f docker-compose-db.yaml up -d
    ```

- Build & start:
```bash
npm run build
npm start
```
- If you want to use Nodemon for hot-reload then use
```bash
npm run dev
```
