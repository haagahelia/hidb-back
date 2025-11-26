# Aviation Museum Database Documentation

This document provides detailed information about the aviation museum database schema, relationships, and data structure.

## Table of Contents

- [Database Overview](#database-overview)
- [Schema Diagrams](#schema-diagrams)
- [Tables](#tables)
- [Relationships](#relationships)
- [Data Types](#data-types)
- [Constraints](#constraints)
- [Sample Data](#sample-data)

## Database Overview

**Database Name:** `casedb` (Case Database)  
**Engine:** MariaDB (MySQL compatible)  
**Tables:** 3 main tables (Organization, Aircraft, Media)

### Purpose

The database stores information about aviation museum exhibits including:

- Aircraft manufacturers and organizations
- Aircraft specifications and museum details
- Media assets (photos, videos, audio) related to aircraft

## Schema Diagrams

### Entity Relationship Diagram (ERD)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Organization  │       │    Aircraft     │       │      Media      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────┤ organization_id │       │ id (PK)         │
│ name            │       │ id (PK)         │       │ aircraft_id (FK)│
│ type            │       │ name            │       │ media_type      │
│ country         │       │ manufacturer    │       │ is_thumbnail    │
│ founding_year   │       │ model           │       │ url             │
│ logo_url        │       │ year_built      │       │ caption         │
│                 │       │ weight          │       │ date_taken      │
│                 │       │ crew_capacity   │       │ creator         │
│                 │       │ passenger_cap.  │       │ is_historical   │
│                 │       │ type            │       └─────────────────┘
│                 │       │ museum_loc_num  │
│                 │       │ display_section │
│                 │       │ qr_code_url     │
│                 │       │ description     │
│                 │       │ status          │
└─────────────────┘       └─────────────────┘
```

## Tables

### Organization Table

Stores information about aircraft manufacturers and aviation organizations.

| Column          | Type         | Constraints                 | Description                                                                          |
| --------------- | ------------ | --------------------------- | ------------------------------------------------------------------------------------ |
| `id`            | INT          | PRIMARY KEY, AUTO_INCREMENT | Unique identifier                                                                    |
| `name`          | VARCHAR(255) | NOT NULL                    | Organization name                                                                    |
| `type`          | ENUM         | NOT NULL                    | Type: 'airline', 'military', 'border_guard', 'postal_service', 'commercial', 'other' |
| `country`       | VARCHAR(255) | NOT NULL                    | Country of origin                                                                    |
| `founding_year` | YEAR         | NULL                        | Year founded (1901-2155)                                                             |
| `logo_url`      | VARCHAR(255) | NULL                        | URL to organization logo                                                             |

### Aircraft Table

Main table storing aircraft information and museum exhibit details.

| Column                   | Type          | Constraints                    | Description                                                                                 |
| ------------------------ | ------------- | ------------------------------ | ------------------------------------------------------------------------------------------- |
| `id`                     | INT           | PRIMARY KEY, AUTO_INCREMENT    | Unique identifier                                                                           |
| `name`                   | VARCHAR(255)  | NOT NULL                       | Aircraft name/model                                                                         |
| `manufacturer`           | VARCHAR(255)  | NOT NULL                       | Manufacturer name                                                                           |
| `model`                  | VARCHAR(255)  | NOT NULL                       | Specific model designation                                                                  |
| `year_built`             | YEAR          | NOT NULL                       | Year aircraft was built                                                                     |
| `weight`                 | DECIMAL(10,2) | NOT NULL                       | Aircraft weight in kg                                                                       |
| `organization_id`        | INT           | NULL, FOREIGN KEY              | Reference to manufacturer organization                                                      |
| `crew_capacity`          | INT           | NULL                           | Number of crew members                                                                      |
| `passenger_capacity`     | INT           | NULL                           | Number of passengers                                                                        |
| `type`                   | ENUM          | NOT NULL                       | Aircraft type: 'military', 'commercial', 'general aviation', 'cargo', 'rotorcraft', 'other' |
| `museum_location_number` | INT           | NULL                           | Museum location identifier                                                                  |
| `display_section`        | VARCHAR(255)  | NULL                           | Museum display section                                                                      |
| `qr_code_url`            | VARCHAR(255)  | NULL                           | QR code for exhibit information                                                             |
| `description`            | TEXT          | NULL                           | Detailed aircraft description                                                               |
| `status`                 | ENUM          | NOT NULL, DEFAULT 'in storage' | Status: 'on display', 'in storage', 'under restoration', 'loaned', 'decommissioned'         |

### Media Table

Stores media assets (photos, videos, audio) related to aircraft.

| Column          | Type         | Constraints                 | Description                                          |
| --------------- | ------------ | --------------------------- | ---------------------------------------------------- |
| `id`            | INT          | PRIMARY KEY, AUTO_INCREMENT | Unique identifier                                    |
| `aircraft_id`   | INT          | NULL, FOREIGN KEY           | Reference to related aircraft                        |
| `media_type`    | ENUM         | NOT NULL                    | Type: 'photo', 'video', '3d model', 'audio', 'other' |
| `is_thumbnail`  | BOOLEAN      | NOT NULL, DEFAULT FALSE     | Whether this is a thumbnail image                    |
| `url`           | VARCHAR(255) | NOT NULL                    | URL to media file                                    |
| `caption`       | TEXT         | NULL                        | Media caption/description                            |
| `date_taken`    | DATETIME     | NULL                        | When the media was created/captured                  |
| `creator`       | VARCHAR(255) | NULL                        | Media creator/artist                                 |
| `is_historical` | BOOLEAN      | NULL, DEFAULT FALSE         | Whether this is historical media                     |

## Relationships

### Foreign Key Relationships

- **Aircraft.organization_id** → **Organization.id** (Many-to-One)

  - Each aircraft belongs to one organization
  - Organizations can have multiple aircraft
  - ON DELETE SET NULL (preserves aircraft if organization is deleted)

- **Media.aircraft_id** → **Aircraft.id** (Many-to-One)
  - Each media item belongs to one aircraft
  - Aircraft can have multiple media items
  - ON DELETE CASCADE (deletes media if aircraft is deleted)

### Relationship Summary

- **Organization → Aircraft**: One-to-Many (1:N)
- **Aircraft → Media**: One-to-Many (1:N)
- **Organization → Media**: Many-to-Many through Aircraft (N:M)

## Data Types

### ENUM Values

**Organization.type:**

- `'airline'` - Commercial airlines
- `'military'` - Military organizations
- `'border_guard'` - Border security
- `'postal_service'` - Postal/cargo services
- `'commercial'` - Commercial manufacturers
- `'other'` - Other types

**Aircraft.type:**

- `'military'` - Military aircraft
- `'commercial'` - Commercial airliners
- `'general aviation'` - Private/light aircraft
- `'cargo'` - Cargo/transport aircraft
- `'rotorcraft'` - Helicopters
- `'other'` - Other types

**Aircraft.status:**

- `'on display'` - Currently exhibited
- `'in storage'` - Stored, not displayed
- `'under restoration'` - Being restored
- `'loaned'` - On loan to another museum
- `'decommissioned'` - No longer active

**Media.media_type:**

- `'photo'` - Photographs
- `'video'` - Video recordings
- `'3d model'` - 3D models
- `'audio'` - Audio recordings
- `'other'` - Other media types

## Constraints

### Primary Keys

- All tables use auto-incrementing INT primary keys

### Foreign Keys

- `Aircraft.organization_id` references `Organization.id`
- `Media.aircraft_id` references `Aircraft.id`

### Check Constraints

- YEAR fields limited to 1901-2155 range
- ENUM fields restrict values to predefined options
- NOT NULL constraints on required fields

### Unique Constraints

- No unique constraints defined (multiple aircraft can have same name)

## Sample Data

### Organizations

```sql
INSERT INTO Organization VALUES
(1, 'NASA', 'other', 'USA', 1958, NULL),
(2, 'Boeing', 'commercial', 'USA', 1916, NULL),
(3, 'Airbus', 'commercial', 'France', 1970, NULL),
(4, 'Junkers', 'commercial', 'Germany', 1901, NULL);
```

### Aircraft

```sql
INSERT INTO Aircraft VALUES
(1, 'A320', 'Airbus', 'A320-200', 1998, 73500.00, 1, 2, 150, 'commercial', NULL, NULL, NULL, 'A popular short-haul airliner.', 'on display'),
(4, 'Junkers A50 Junior', 'Junkers', 'A50 Junior', 1929, 1800.00, 4, 1, 1, 'general aviation', NULL, NULL, NULL, 'A German two-seat trainer aircraft from the late 1920s.', 'on display');
```

### Media

```sql
INSERT INTO Media VALUES
(1, 1, 'photo', 1, 'https://finna.fi/Record/elka.143410808738800_158684673005400?sid=5184639845', 'Airbus A320 lentokone (1987)', '1987-01-01 00:00:00', 'INP/Lufthansa', 0),
(3, 4, 'photo', 1, 'https://finna.fi/Record/sim.M016-10085', 'Junkers A 50 Junior on display in 1977', '1977-05-16 00:00:00', 'Hielm. Börje', 1);
```

## Database Scripts

The database is managed through SQL scripts in the `database/SQL-scripts/` directory:

- `00__drop_tables.sql` - Clean database reset
- `01__create_tables.sql` - Table creation
- `02__insert_test_data.sql` - Sample data insertion
- `000__CreateALLdb.sql` - Combined script (Docker initialization)

## Maintenance Notes

### Data Integrity

- Foreign key constraints maintain referential integrity
- ENUM restrictions prevent invalid data entry
- CASCADE deletes ensure orphaned records are cleaned up

### Performance Considerations

- Indexes on primary keys (automatic)
- Consider adding indexes on frequently queried columns
- TEXT fields for descriptions (unlimited length)

### Backup Strategy

- Database runs in Docker container
- Volume persistence ensures data survival
- Use `docker-compose down -v` for complete reset

---

_Last updated: November 24, 2025_
