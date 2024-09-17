import mysql from "mysql2/promise";
import dotenv from 'dotenv'

dotenv.config()


const DbConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
};

const poolPromise = (async () => {
    try {
        const pool = await mysql.createPool(DbConfig);
        console.log("Connected to MySQL Database");
        return pool;
    } catch (err) {
        throw err; // Ensure errors are properly handled
    }
})();



export { poolPromise };
