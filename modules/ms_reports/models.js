const conn = require('../../config/dbconnect');
const table_name =  'v_ms_service_detail';
const primary_key = 'id';

let Mdl = {
    select: async(param, customParam)=>{
        try{
            let qry = "";
            let ary = [];
            qry += " WHERE is_deleted = 'N' "; //preventif deleted data

            if(param){
                for(var i in param){
                    qry += " " +(!andOr?"AND":andOr)+ " ";
                    qry += i + " = ? ";
                    ary.push(param[i]);
                }
            }
            if(customParam){
                qry += customParam;
            }
            let sql = "SELECT * FROM " + table_name + qry;
            let res = await conn.query(sql,ary);
            return {
                status : true,
                data : res[0]
            };
        }catch(err){
             
            return {
                status : false,
                message: err.message
            };
        }
    }
}

module.exports = Mdl;