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
    ('CRJ900','Bombardier', 'CRJ900',   2003, 37000.00, 3, 2, 90,  'cargo',      NULL, NULL, NULL, 'An ol regional jet with a capacity of 90 passengers, later modified into a cargo plane.', 'in storage');

/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */
/* -------------------------- END --------------------------- */
/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */