const mysql = require('mysql2/promise');
const conn = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : 'secret',
    database : 'dms'
});


module.exports = conn;