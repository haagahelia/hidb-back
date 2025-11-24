USE casedb; 

/* INSERTS */

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
    ('Airbus', 'commercial', 'France', 1970, NULL),
    ('Junkers', 'commercial', 'Germany', 1901, NULL);

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
    ('CRJ900','Bombardier', 'CRJ900',   2003, 37000.00, 3, 2, 90,  'cargo',      NULL, NULL, NULL, 'An ol regional jet with a capacity of 90 passengers, later modified into a cargo plane.', 'in storage'),
    ('Junkers A50 Junior', 'Junkers', 'A50 Junior', 1929, 1800.00, 4, 1, 1, 'general aviation', NULL, NULL, NULL, 'A German two-seat trainer aircraft from the late 1920s, known for its corrugated metal construction.', 'on display');

/* --- Insert: Media --- */
INSERT INTO Media (
    aircraft_id,
    media_type,
    is_thumbnail,
    url,
    caption,
    date_taken,
    creator,
    is_historical
) VALUES
    (1, 'photo', TRUE, 'https://finna.fi/Record/elka.143410808738800_158684673005400?sid=5184639845', 'Airbus A320 lentokone (1987)', '1987-01-01 00:00:00', 'INP/Lufthansa', FALSE),
    (1, 'photo', FALSE, 'https://finna.fi/Record/sim.M016-39913?sid=5184639845', 'Finnairin Airbus A320-200 Helsinki-Vantaan lentoasemalla elokuussa 2017', '2017-08-01 00:00:00', 'Juutinen, Tapio', TRUE),
    (4, 'photo', TRUE, 'https://finna.fi/Record/sim.M016-10085', 'Junkers A 50 Junior on display in the airport terminal in 1977', '1977-05-16 00:00:00', 'Hielm. Börje', TRUE),
    (4, 'photo', FALSE, 'https://finna.fi/Record/sim.M016-35349', 'Junkers A50 Junior OH-ABB and Santa Claus', '1981-01-01 00:00:00', 'Wikman. Matti', TRUE);

/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */
/* -------------------------- END --------------------------- */
/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */