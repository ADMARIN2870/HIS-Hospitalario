const mysql = require('mysql2/promise');

// Crear pool de conexiones a la base de datos
const db = mysql.createPool({
  host: 'localhost',           // o '127.0.0.1'
  user: 'root',                // usuario por defecto en XAMPP
  password: '',                // en XAMPP/MAMP suele ser cadena vacía
  database: 'his_hospital',    // tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;
