# hidb-back — Backend setup & DB initialization

Short guide to start the backend and initialize the MariaDB database using Docker

## Table of Contents

- [Deployment Link](#deployment-link)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Initialize Database](#initialize-database)
- [Database Documentation](#database-documentation)
- [Start Database](#start-database)
- [Start Backend](#start-backend)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Resources](#resources)

## Deployment Link

https://hidb-back-git-sdp-2-aviation-museum.2.rahtiapp.fi
- Deplyoment instructions
  [Deployment_instruction.pdf](https://github.com/user-attachments/files/23835207/Deployment_instruction.pdf)
  

## Prerequisites

- Docker & Docker Compose
- Node.js & npm
- DBeaver

## Getting Started

1. Clone the repo:

```bash
    git clone https://github.com/haagahelia/hidb-back
    cd /hidb-back
```

2. Install dependencies:

```bash
    npm install
```

3. Create a `.env` file and add the following environment variables (you can find the values on Teams):

```bash
        # db.env
        MARIADB_DATABASE=casedb
        MARIADB_USER=yourusername
        MARIADB_PASSWORD=yourpw

        # db.root.env
        MARIADB_ROOT_PASSWORD=yourrootpw

        # network.env
        DB_HOST=localhost
        DB_PORT=3306
        BE_SERVER_PORT=4678

        # test.env
        NODE_ENV=test

        # Integration Tests Flag
        RUN_INTEGRATION_TESTS=false
```

## Initialize Database

The `docker-compose-db.yaml` file is set up to automatically create the database and schemas when you run the following command for the first time:

```bash
    docker compose -f docker-compose-db.yaml up -d
```

**Database Content:**
The database includes aviation museum data with:

- **Organizations**: NASA, Boeing, Airbus, Junkers
- **Aircraft**: A320, B737, CRJ900, Junkers A50 Junior (historical trainer)
- **Media**: Historical photos for aircraft (currently A320 and Junkers A50 Junior)

**Note:** The entrypoint init scripts run only on the first initialization of the DB volume. If you need to re-initialize the database, run the following commands:

```bash
# Stop and remove containers and the DB volume
docker compose -f docker-compose-db.yaml down -v

# Start DB container (it will run scripts under /docker-entrypoint-initdb.d)
docker compose -f docker-compose-db.yaml up -d

# Follow the logs to see the SQL execution
docker compose -f docker-compose-db.yaml logs -f mariadb_service
```

**Database Scripts:**

- `00__drop_tables.sql` - Drops existing tables (for clean resets)
- `01__create_tables.sql` - Creates Organization, Aircraft, and Media tables
- `02__insert_test_data.sql` - Inserts test data
- `000__CreateALLdb.sql` - Auto-generated combined script (used by Docker)
- `a_concatenate_needed_db_scripts.sh` - Script to combine SQL files

## Database Documentation

For detailed database schema information, relationships, data types, and sample data, see [DATABASE.md](DATABASE.md).

This includes:

- Complete table schemas with constraints
- Entity Relationship Diagrams (ERD)
- Foreign key relationships
- ENUM value definitions
- Sample data examples
- Maintenance and performance notes

## Start Database

To start the database after it has been initialized, run the following command:

```bash
    docker compose -f docker-compose-db.yaml up -d
```

## Start Backend

- **Note:** The database must be running before starting the backend.
- To build and start the application, run:

```bash
npm run build
npm start
```

- For development with hot-reloading, use:

```bash
npm run dev
```

## Project Structure

The project is structured as follows:

- **src**: Contains the source code of the application.
  - **config**: Contains configuration files for the database connection (Knex).
  - **middleware**: Contains middleware for the Express application.
  - **models**: Contains the data models for the application (e.g., Aircraft, Organization).
  - **responseHandler**: Contains the response handler for the application.
  - **routes**: Contains the API routes for the application.
  - **services**: Contains the business logic of the application.
  - **tests**: Contains the tests for the application.
  - **utils**: Contains utility functions.
  - **validationHandler**: Contains validation handlers for the API routes (express-validator).
    - `aircraft.ts` - Aircraft-specific validation rules
    - `index.ts` - General validation utilities and request validation middleware
  - **app.ts**: The main application file, where the Express application is configured and the routes are mounted.
  - **server.ts**: The entry point of the application, where the server is started.
- **database**: Contains SQL scripts for creating the database and inserting test data.
  - `00__drop_tables.sql` - Drops existing tables for clean database resets
  - `01__create_tables.sql` - Creates Organization, Aircraft, and Media tables
  - `02__insert_test_data.sql` - Inserts test aviation museum data
  - `000__CreateALLdb.sql` - Auto-generated combined script (used by Docker)
  - `a_concatenate_needed_db_scripts.sh` - Script to combine SQL files
- **Dockerfile**: Contains the instructions for building the Docker image for the application.
- **docker-compose-db.yaml**: Contains the configuration for the MariaDB database service.
- **package.json**: Contains the project's dependencies and scripts.

## API Endpoints

The following API endpoints are available:

- **GET /**: Returns a welcome message.
- **GET /hello**: Returns a "Hello from Express + TypeScript!" message.
- **GET /api/aircraft**: Returns a list of all aircraft.
- **GET /api/aircraft/:id**: Returns a specific aircraft by ID.
- **GET /api/organizations**: Returns a list of all organizations.
- **GET /api/organizations/:id**: Returns a specific organization by ID.

**Note:** Media API endpoints are not yet implemented (Media table exists in database but no routes created).

**API Features:**

- Input validation using express-validator
- ID validation for aircraft endpoints (positive integers only)
- Structured error responses
- TypeScript support throughout

## Resources

See [RESOURCES.md](RESOURCES.md) for aviation museum resources including:

- Aircraft specifications and historical data
- Media assets (images, audio, video)
- External links and references
- Development resources and documentation
