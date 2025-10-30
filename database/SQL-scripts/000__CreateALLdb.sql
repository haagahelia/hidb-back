/* This script is added to docker-compose-db.yaml for automatic initialization whenever docker is set up */
USE casedb; 

DROP TABLE IF EXISTS Aircraft;
DROP TABLE IF EXISTS Organization;

/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */
/* -------------------------- END --------------------------- */
/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */

CREATE TABLE IF NOT EXISTS Aircraft (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year_built YEAR NOT NULL,
    weight DECIMAL(10,2) NOT NULL,
    aircraft_type VARCHAR(100) NULL,
    museum_location_number INT NOT NULL,
    display_section VARCHAR(255) NOT NULL,
    description TEXT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS Organization (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type ENUM('airline', 'military', 'border_guard', 'postal_service', 'other') NOT NULL,
    country VARCHAR(255) NOT NULL,
    founding_year YEAR NULL,
    logo_url VARCHAR(255) NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */
/* -------------------------- END --------------------------- */
/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */

USE casedb; 

/* INSERTS */
/* --- Insert: Aircraft --- */
INSERT INTO Aircraft (name, manufacturer, model, year_built, weight, aircraft_type, museum_location_number, display_section, description) VALUES
('A320', 'Airbus', 'A320-200', 1998, 73500.00, 'Commercial', 1, 'Jetliners', 'Short-haul narrow-body airliner'),
('B737', 'Boeing', '737-800', 2005, 79015.00, 'Commercial', 2, 'Jetliners', 'Popular medium-range airliner'),
('CRJ900', 'Bombardier', 'CRJ900', 2003, 37000.00, 'Regional', 3, 'Regional', NULL);

/* --- Insert: Organization --- */
INSERT INTO Organization (name, type, country, founding_year, logo_url) VALUES
('NASA', 'other', 'USA', 1958, NULL),
('Boeing', 'other', 'USA', 1916, NULL),
('Airbus', 'other', 'France', 1970, NULL);


/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */
/* -------------------------- END --------------------------- */
/* ---------------------------------------------------------- */
/* ---------------------------------------------------------- */