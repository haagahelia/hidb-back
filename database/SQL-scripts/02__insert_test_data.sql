USE casedb; 

/* INSERTS */
/* --- Insert: Aircraft --- */
INSERT INTO Aircraft (name, manufacturer, model, year_built, weight, aircraft_type, museum_location_number, display_section, description) VALUES
('A320', 'Airbus', 'A320-200', 1998, 73500.00, 'Commercial', 1, 'Jetliners', 'Short-haul narrow-body airliner'),
('B737', 'Boeing', '737-800', 2005, 79015.00, 'Commercial', 2, 'Jetliners', 'Popular medium-range airliner'),
('CRJ900', 'Bombardier', 'CRJ900', 2003, 37000.00, 'Regional', 3, 'Regional', NULL);

/* --- Insert: Organization --- */
INSERT INTO Organization (name, type, country, founding_year,  logo_url) VALUES
('NASA', 'other', 'USA', 1958, NULL),
('Boeing', 'other', 'USA', 1916, NULL),
('Airbus', 'other', 'France', 1970, NULL);