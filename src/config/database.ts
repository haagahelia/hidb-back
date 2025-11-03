import knex from 'knex';
import config from './knexfile';

require('dotenv').config();

const db = knex(config);

export default db;