# Test Documentation

## Test Directory Structure

```
tests/
├── setup.ts                          # Common setup for all tests
├── utils/
│   └── testHelpers.ts               # Helper functions and mock data
├── routes/                          # Unit tests for routes
│   ├── hello.test.ts
│   ├── index.test.ts
│   ├── aircraft.test.ts
│   └── organization.test.ts
└── integration/                     # Integration tests with database
    ├── aircraft.integration.test.ts
    ├── organization.integration.test.ts
    └── all.integration.test.ts
```

## Test Types

### 1. Unit Tests (routes/)
- **Description**: Test routes independently, mock services
- **Not Required**: Database connection
- **Fast Execution**: ✓
- **Default Execution**: ✓

### 2. Integration Tests (integration/)
- **Description**: Test with real database
- **Required**: Database connection
- **Slower Execution**: ✓
- **Run with flag**: `RUN_INTEGRATION_TESTS=true`

## Running Tests

### Run all unit tests (default)
```bash
npm test
```

### Run tests with watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run only unit tests (skip integration)
```bash
npm run test:unit
```

### Run integration tests (requires database)
```bash
# Ensure database is running
docker-compose up -d

# Run integration tests
npm run test:integration
```

### Run with detailed output
```bash
npm run test:verbose
```

### Run specific tests
```bash
# Run specific test file
npm test -- aircraft.test.ts

# Run tests by pattern
npm test -- --testNamePattern="should return all aircraft"

# Run tests in specific folder
npm test -- routes/
```

## Environment Variables

### For Unit Tests
```bash
NODE_ENV=test
```

### For Integration Tests
```bash
NODE_ENV=test
RUN_INTEGRATION_TESTS=true

# Database config
DB_HOST=localhost
DB_PORT=3306
MARIADB_USER=root
MARIADB_PASSWORD=your_password
MARIADB_DATABASE=casedb
```

## Test Coverage

After running `npm run test:coverage`, view report at:
- Terminal: Displays summary
- File: `coverage/lcov-report/index.html` (open in browser)

### Coverage Goals
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Test Helpers

### Basic Helpers (`tests/utils/testHelpers.ts`)

Provides basic functions:

```typescript
import {
  createMockAircraft,
  createMockOrganization,
  createMultipleMockAircraft,
  createRealWorldAircraft,
  expectSuccessResponse,
  expectErrorResponse,
  isValidAircraftType
} from '../utils/testHelpers';

// Create mock data
const aircraft = createMockAircraft({ name: 'Custom Name' });
const fleet = createMultipleMockAircraft(10);
const realAircraft = createRealWorldAircraft.airbus();

// Validate responses
expectSuccessResponse(response, 200);
expectErrorResponse(response, 404, 'Not found');

// Validate ENUM values
expect(isValidAircraftType('commercial')).toBe(true);
```

### Advanced Helpers (`tests/utils/advancedHelpers.ts`)

For complex test cases:

```typescript
import {
  createFleet,
  createAircraftWithOrganization,
  createAircraftWithEdgeCases,
  filterByStatus,
  assertAircraftStructure,
  calculateAircraftStats
} from '../utils/advancedHelpers';

// Create fleet
const fleet = createFleet(organizationId, 20);

// Create aircraft + organization
const { aircraft, organization } = createAircraftWithOrganization(
  { name: 'F-16' },
  { name: 'US Air Force' }
);

// Edge cases
const edgeCases = createAircraftWithEdgeCases();
const minimal = edgeCases.minimal;
const maximal = edgeCases.maximal;

// Filtering
const onDisplay = filterByStatus(aircraft, 'on display');

// Assertions
assertAircraftStructure(aircraft);

// Statistics
const stats = calculateAircraftStats(fleet);
console.log(stats.averageWeight);
console.log(stats.byType);
```

## Writing New Tests

### Route Test Template (Using Helpers)

```typescript
import request from 'supertest';
import app from '../../src/app';
import yourService from '../../src/services/YourService';
import { 
  createMockAircraft, 
  expectSuccessResponse 
} from '../utils/testHelpers';

jest.mock('../../src/services/YourService');

describe('Your Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle success case', async () => {
    // Use helper to create mock data
    const mockData = createMockAircraft();
    (yourService.method as jest.Mock).mockResolvedValue(mockData);

    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);

    // Use helper to validate response
    expectSuccessResponse(response, 200);
  });
});
```

### Integration Test Template

```typescript
import request from 'supertest';
import app from '../../src/app';
import db from '../../src/config/database';

describe('Integration Test', () => {
  const shouldRun = process.env.RUN_INTEGRATION_TESTS === 'true';

  beforeAll(async () => {
    if (shouldRun) {
      await db.raw('SELECT 1');
    }
  });

  afterAll(async () => {
    if (shouldRun) {
      await db.destroy();
    }
  });

  (shouldRun ? describe : describe.skip)('Real DB Tests', () => {
    it('should work with real database', async () => {
      const response = await request(app).get('/api/endpoint');
      expect(response.status).toBe(200);
    });
  });
});
```

## Best Practices

### ✅ DO:
- Mock external dependencies (database, APIs)
- Test both success and error cases
- Test edge cases (null, undefined, invalid input)
- Use descriptive test names
- Keep tests independent
- Clean up after tests (afterEach, afterAll)
- Use test helpers for common operations

### ❌ DON'T:
- Depend on test execution order
- Use real database in unit tests
- Test multiple things in one test
- Hardcode test data (use helpers)
- Leave console.logs in tests
- Skip error handling tests

## Test Data

### Mock Data Locations
- `tests/utils/testHelpers.ts` - Helper functions
- Inline in test files - Specific test data

### Seed Data (Integration Tests)
- `database/SQL-scripts/02__insert_test_data.sql`
- Organizations: NASA, Boeing, Airbus
- Aircraft: A320, B737, CRJ900

## Debugging Tests

### Run single test in debug mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand aircraft.test.ts
```

### VSCode Debug Configuration
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "${file}"],
  "console": "integratedTerminal"
}
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Unit Tests
  run: npm test

- name: Run Integration Tests
  run: npm run test:integration
  env:
    RUN_INTEGRATION_TESTS: true
    DB_HOST: localhost
    MARIADB_DATABASE: test_db
```

## Troubleshooting

### Tests not running
```bash
# Clear Jest cache
npm test -- --clearCache

# Rebuild
npm run build
```

### Integration tests failing
```bash
# Check database connection
docker-compose ps

# Check environment variables
echo $RUN_INTEGRATION_TESTS

# Restart database
docker-compose restart
```

### Coverage inaccurate
```bash
# Remove old coverage
rm -rf coverage/

# Run again
npm run test:coverage
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)