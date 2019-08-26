const conn = require('../../../config/dbconnect');
const table_name =  'c_user';
const primary_key = 'id';
const dataSet = [
    'username',
    'password',
    'firstname',
    'lastname'
];

let Mdl = {
    select : async ()=>{
        try{
            let sql = "SELECT * FROM " + table_name;
            let res = await conn.query(sql);
            return res[0];
        }catch(err){
            console.log(err);   
            return false;
        }
    },

    selectOne: async (id)=>{
        try{
            if(!id) return false;
            let sql = "SELECT * FROM " + table_name + " WHERE " + primary_key + " = '" + id + "'";
            let res = await conn.query(sql);
            return res[0][0];
        }catch(err){
            console.log(err);   
            return false;
        }
    },

    insert : async (data)=>{
        try{
            if(!data) return false;
            for(var i in dataSet){
                data[dataset[i]];
            }
        }catch(err){
            console.log(err);   
            return false;
        }
    },
    update : (id,data)=>{},
    delete : (id)={}
}

module.exports = Mdl;
