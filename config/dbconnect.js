const mysql = require('mysql');
const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'secret',
    database : 'dms'
})

conn.connect((err)=>{
    if(err) throw err;
});

module.exports = conn;