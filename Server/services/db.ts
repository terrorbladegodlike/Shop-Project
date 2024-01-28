import mysql, { Connection } from "mysql2/promise";

const host = process.env.LOCAL_HOST;
const port = Number(process.env.DATABASE_PORT);
const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;
const databaseName = process.env.DATABASE_NAME;

export async function initDataBase(): Promise<Connection | null> {
    let connection: Connection | null = null;

    try {
        connection = await mysql.createConnection({
            host: host,
            port: port,
            password: password,
            user: username,
            database: databaseName
        });
    } catch (err: any) {
        console.error(err.message || err);
        return null;
    }

    console.log(`Connection to DB ProductsApplication established`);
    return connection;
}