'use strict';

require('dotenv').config();

/** @type {import('sequelize-cli').Config} */
module.exports = {
  development: {
    dialect: 'postgres',
    host: 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'crm',
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  },
  test: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'crm_test',
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  },
  production: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  },
}; 