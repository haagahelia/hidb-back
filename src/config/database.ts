import knex from 'knex';
import config from './knexfile';

// Load environment variables
require('dotenv').config();

// Initialize Knex with the configuration
const db = knex(config);

export default db;