const mysql = require('mysql2/promise');
const conn = mysql.createPool({
    host : 'localhost',
    user : 'wni_admin',
    password : 'password',
    database : 'dms'
});


module.exports = conn;