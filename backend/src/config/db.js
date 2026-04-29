const sql = require('mssql');
require('dotenv').config({ path: '../.env' }); // Bir üst klasöre bakmasını söyle
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: true, // Azure için true gereklidir, local için false yapılabilir
        trustServerCertificate: true // Local geliştirme ortamı için true olmasında fayda var
    }
};

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log('MSSQL Veritabanına başarıyla bağlanıldı (APAYS)');
    } catch (err) {
        console.error('Veritabanı bağlantı hatası:', err);
    }
};

module.exports = {
    sql,
    connectDB,
    config
};
