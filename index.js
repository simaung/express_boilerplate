import {} from "dotenv/config";
import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import db from "./config/database.js";
import router from "./routes/index.js";

const app = express()
const port = process.env.PORT || 5000

try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
    // await db.sync(); // untuk generate table database via schema
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

app.use(cors({ credential: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})