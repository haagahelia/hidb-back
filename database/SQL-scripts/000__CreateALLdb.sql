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