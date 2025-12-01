
/* --- 01 CREATE TABLES --- */

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
    description   TEXT           NOT NULL,
    history       TEXT           NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

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
    specifications      JSON           NULL,
    history              TEXT           NULL,
    importance           TEXT           NULL,
    fun_facts           JSON          NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (organization_id) REFERENCES Organization(id) ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

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
  DEFAULT CHARSET = utf8mb4;




/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */
/* -------------------------- END --------------------------- */
/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */