USE casedb;

DROP TABLE IF EXISTS Organization;
DROP TABLE IF EXISTS Media;
DROP TABLE IF EXISTS Aircraft;

/* ---------------------------------------------------------- */
/* --- 00 DROP TABLES --------------------------------------- */
/* ---------------------------------------------------------- */
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

  CREATE TABLE IF NOT EXISTS Media (
    id           INT            NOT NULL AUTO_INCREMENT,
    
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
    media_id            INT           NULL,
    specifications      JSON           NULL,
    history              TEXT           NULL,
    importance           TEXT           NULL,
    fun_facts           JSON          NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (organization_id) REFERENCES Organization(id) ON DELETE SET NULL, 
    FOREIGN KEY (media_id) REFERENCES Media(id) ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;




/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */
/* -------------------------- END --------------------------- */
/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */

/* INSERTS */

/* --- Insert: Organization --- */
INSERT INTO Organization (
    name,
    type,
    country,
    founding_year,
    logo_url,
    description,
    history
) VALUES
-- 1. Finnish Air Force
(
    'Finnish Air Force',
    'military',
    'Finland',
    1918,
    NULL,
    'The Finnish Air Force is one of the oldest independent air forces in the world, having gained independence alongside Finland in 1918.',
    'Founded on March 6, 1918, the Finnish Air Force has played a crucial role in defending Finnish sovereignty through the Winter War, Continuation War, and throughout the Cold War era. Known for achieving exceptional kill ratios with limited resources.'
),

-- 2. Finnair (Aero O/Y)
(
    'Finnair (Aero O/Y)',
    'airline',
    'Finland',
    1923,
    NULL,
    'Finland''s flagship airline and one of the world''s oldest continuously operating airlines.',
    'Founded as Aero O/Y in 1923, Finnair has connected Finland to the world for over 100 years. The airline pioneered Arctic routes and became known for its reliability and safety record.'
),

-- 3. Soviet Air Forces
(
    'Soviet Air Forces',
    'military',
    'Soviet Union',
    1918,
    NULL,
    'The air warfare branch of the Soviet Armed Forces during the existence of the Soviet Union.',
    'One of the largest and most powerful air forces in history, the Soviet Air Forces played a decisive role in World War II and maintained air superiority throughout the Cold War.'
),

-- 4. Royal Air Force
(
    'Royal Air Force',
    'military',
    'United Kingdom',
    1918,
    NULL,
    'The United Kingdom''s aerial warfare force and the oldest independent air force in the world.',
    'Founded on April 1, 1918, the RAF defended Britain during the Battle of Britain and played crucial roles in all theaters of World War II. Known for technological innovation and exceptional pilot training.'
),

-- 5. Luftwaffe
(
    'Luftwaffe',
    'military',
    'Germany',
    1935,
    NULL,
    'The aerial warfare branch of the Wehrmacht during Nazi Germany.',
    'Reformed in 1935, the Luftwaffe became one of the most technologically advanced air forces of its time. Despite early success, it was eventually overcome by Allied air superiority.'
);

/* --- Insert: Media --- */
INSERT INTO Media (
    media_type,
    is_thumbnail,
    url,
    caption,
    date_taken,
    creator,
    is_historical
) VALUES
    ('photo', TRUE, 'https://finna.fi/Record/elka.143410808738800_158684673005400?sid=5184639845', 'Airbus A320 lentokone (1987)', '1987-01-01 00:00:00', 'INP/Lufthansa', FALSE),
    ('photo', FALSE, 'https://finna.fi/Record/sim.M016-39913?sid=5184639845', 'Finnairin Airbus A320-200 Helsinki-Vantaan lentoasemalla elokuussa 2017', '2017-08-01 00:00:00', 'Juutinen, Tapio', TRUE),
    ('photo', TRUE, 'https://finna.fi/Record/sim.M016-10085', 'Junkers A 50 Junior on display in the airport terminal in 1977', '1977-05-16 00:00:00', 'Hielm. Börje', TRUE),
    ('photo', FALSE, 'https://finna.fi/Record/sim.M016-35349', 'Junkers A50 Junior OH-ABB and Santa Claus', '1981-01-01 00:00:00', 'Wikman. Matti', TRUE);

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
    status,
    media_id,
    specifications,
    history,
    importance,
    fun_facts
) VALUES
-- -------------------------------------------------------------
-- 1. Airbus A320 (Finnair)
-- -------------------------------------------------------------
(
    'Airbus A320',
    'Airbus',
    'A320-200',
    1987,
    73500.00,
    2,
    2,
    150,
    'commercial',
   NULL,
   NULL,
    NULL,
    'One of the world’s most successful short- to medium-haul commercial airliners, widely used by Finnair for European routes.',
    'on display',
   1,
    JSON_OBJECT(
        'length', '37.57 m',
        'wingspan', '34.10 m',
        'height', '11.76 m',
        'maxSpeed', '871 km/h',
        'range', '6,150 km',
        'engine', 'CFM56-5 or IAE V2500',
        'armament', NULL
    ),
    'The Airbus A320 first flew in 1987 and revolutionized commercial aviation with its fly-by-wire control system. Finnair introduced the A320 family to modernize regional service.',
    'The A320 was a landmark in digital flight technology and remains essential to European commercial aviation.',
    JSON_ARRAY(
        'First commercial airliner with fully digital fly-by-wire controls.',
        'Over 10,000 A320-family aircraft built.',
        'Finnair operated its first A320 in the early 1990s.'
    )
),

-- -------------------------------------------------------------
-- 3. MiG-21Bis (Soviet Air Forces)
-- -------------------------------------------------------------
(
    'MiG-21Bis',
    'Mikoyan-Gurevich',
    'MiG-21Bis',
    1972,
    5400.00,
    3,
    1,
    0,
    'military',
    NULL,
    NULL,
    NULL,
    'A supersonic Soviet fighter used by both the Soviet Air Forces and later the Finnish Air Force.',
    'on display',
    3,
    JSON_OBJECT(
        'length', '15.76 m',
        'wingspan', '7.15 m',
        'height', '4.10 m',
        'maxSpeed', '2,230 km/h (Mach 2.05)',
        'range', '1,210 km',
        'engine', 'Tumansky R-25-300 turbojet',
        'armament', '23 mm cannon, R-60 air-to-air missiles'
    ),
    'The MiG-21 is one of the most produced jet fighters in history and became a symbol of Cold War aerial combat.',
    'Played a major role in global Cold War conflicts and introduced supersonic capability to many smaller air forces.',
    JSON_ARRAY(
        'More than 11,000 produced worldwide.',
        'Used by over 60 countries.',
        'Nicknamed “the People’s Fighter”.'
    )
),

-- -------------------------------------------------------------
-- 4. Junkers A50 Junior (Royal Air Force)
-- -------------------------------------------------------------
(
    'Junkers A50 Junior',
    'Junkers',
    'A50',
    1929,
    680.00,
    4,
    1,
    1,
    'general aviation',
    NULL,
    NULL,
    NULL,
    'A lightweight sports aircraft known for long-distance record flights in the early 1930s.',
    'on display',
    4,
    JSON_OBJECT(
        'length', '6.8 m',
        'wingspan', '10.5 m',
        'height', '2.4 m',
        'maxSpeed', '185 km/h',
        'range', '450 km',
        'engine', 'Armstrong Siddeley Genet radial engine',
        'armament', NULL
    ),
    'The Junkers A50 was used widely for sport flying, distance competitions, and early training programs.',
    'Represents the transition from wooden biplanes to modern lightweight metal aircraft.',
    JSON_ARRAY(
        'One A50 flew from Germany to Tokyo in 1931.',
        'Features corrugated metal construction.',
        'Very popular with early aviation sporting clubs.'
    )
); 


/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */
/* -------------------------- END --------------------------- */
/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */