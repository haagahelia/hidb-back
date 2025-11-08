/* This script is added to docker-compose-db.yaml for automatic initialization whenever docker is set up */

USE casedb;

DROP TABLE IF EXISTS Organization;
DROP TABLE IF EXISTS Aircraft;
DROP TABLE IF EXISTS Media;

/* ---------------------------------------------------------- */
/* --- 01 CREATE TABLES ------------------------------------- */
/* ---------------------------------------------------------- */

CREATE TABLE IF NOT EXISTS Organization (
    id            INT            NOT NULL AUTO_INCREMENT,
    name          VARCHAR(255)   NOT NULL,
    type          ENUM(
                    'airline',
                    'military',
                    'border_guard',
                    'postal_service',
                    'commercial',
                    'other'
                  )              NOT NULL,
    country       VARCHAR(255)   NOT NULL,
    founding_year YEAR           NULL,
    logo_url      VARCHAR(255)   NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

CREATE TABLE IF NOT EXISTS Aircraft (
    id                   INT            NOT NULL AUTO_INCREMENT,
    name                 VARCHAR(255)   NOT NULL,
    manufacturer         VARCHAR(255)   NOT NULL,
    model                VARCHAR(255)   NOT NULL,
    year_built           YEAR           NOT NULL,
    weight               DECIMAL(10,2)  NOT NULL,
    organization_id      INT            NULL,
    crew_capacity        INT            NULL,
    passenger_capacity   INT            NULL,
    type                 ENUM(
                           'military',
                           'commercial',
                           'general aviation',
                           'cargo',
                           'rotorcraft',
                           'other'
                         )              NOT NULL,
    museum_location_number INT          NULL,
    display_section      VARCHAR(255)   NULL,
    qr_code_url          VARCHAR(255)   NULL,
    description          TEXT           NULL,
    status               ENUM(
                           'on display',
                           'in storage',
                           'under restoration',
                           'loaned',
                           'decommissioned'
                         )              NOT NULL DEFAULT 'in storage',
    PRIMARY KEY (id),
    FOREIGN KEY (organization_id) REFERENCES Organization(id) ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

CREATE TABLE IF NOT EXISTS Media (
    id           INT            NOT NULL AUTO_INCREMENT,
    aircraft_id  INT            NULL,
    media_type   ENUM(
                   'photo',
                   'video',
                   '3d model',
                   'audio',
                   'other'
                 )              NOT NULL,
    is_thumbnail BOOLEAN        NOT NULL DEFAULT FALSE,
    url          VARCHAR(255)   NOT NULL,
    caption      TEXT           NULL,
    date_taken   DATETIME       NULL,
    creator      VARCHAR(255)   NULL,
    is_historical BOOLEAN       NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (aircraft_id) REFERENCES Aircraft(id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

/* ---------------------------------------------------------- */
/* --- INSERTS ---------------------------------------------- */
/* ---------------------------------------------------------- */

USE casedb;

/* --- Insert: Organization --- */
INSERT INTO Organization (
    name,
    type,
    country,
    founding_year,
    logo_url
) VALUES
    ('NASA',   'other',      'USA',    1958, NULL),
    ('Boeing', 'commercial', 'USA',    1916, NULL),
    ('Airbus', 'commercial', 'France', 1970, NULL);

/* --- Insert: Aircraft --- */
INSERT INTO Aircraft (
    name,
    manufacturer,
    model,
    year_built,
    weight,
    organization_id,
    crew_capacity,
    passenger_capacity,
    type,
    museum_location_number,
    display_section,
    qr_code_url,
    description,
    status
) VALUES
    ('A320',  'Airbus',     'A320-200', 1998, 73500.00, 1, 2, 150, 'commercial', NULL, NULL, NULL, 'A popular short-haul airliner.', 'on display'),
    ('B737',  'Boeing',     '737-800',  2005, 79015.00, 2, 2, 160, 'commercial', NULL, NULL, NULL, 'A widely used medium-range airliner.', 'in storage'),
    ('CRJ900','Bombardier', 'CRJ900',   2003, 37000.00, 3, 2, 90,  'cargo',      NULL, NULL, NULL, 'An old regional jet with a capacity of 90 passengers, later modified into a cargo plane.', 'in storage');

/* ---------------------------------------------------------- */
/* -------------------------- END --------------------------- */
/* ---------------------------------------------------------- */