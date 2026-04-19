const sql = require("mssql");
require("dotenv").config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        const pool = await sql.connect(config);
        console.log("SQL Server bağlantısı başarılı.");
        return pool;
    } catch (error) {
        console.error("Veritabanı bağlantı hatası:", error);
        throw error;
    }
}

module.exports = { sql, connectDB };