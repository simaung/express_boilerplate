import { Sequelize } from "sequelize";

const DB_HOST = process.env.DB_HOST;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_DIALECT = process.env.DB_DIALECT;

const db = new Sequelize(DB_DATABASE, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: DB_DIALECT
});

export default db;