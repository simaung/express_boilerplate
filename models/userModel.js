import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    uuid: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        required: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        required: true
    },
    refresh_token: {
        type: DataTypes.TEXT
    },
}, {
    freezeTableName: true
});

export default Users;