const conn = require('../../../config/dbconnect');
const table_name =  'at_ticket';
const primary_key = 'id';
const dataSetAdd = [
    'atm_serial_number',
    'date_plan',
    'ticket',
    'date_actual',
    'status'
];
const dataSetUpdate = [
    'atm_serial_number',
    'date_plan',
    'ticket',
    'date_actual',
    'status'
];

let Mdl = {
    selectWhereIn : async (pField,param)=>{
        try{
            let params = "" ;
            if(param && param.length > 0){
                params = "'" + param.join("','") + "'";
            }
            let sql = "SELECT * FROM t_atm WHERE "+ pField +" IN("+ params +")";
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0]
            };
        }catch(err){
            //console.log(err);   
            return {
                status : false,
                message: err.message
            };
        }
    },
    select : async (param)=>{
        try{
            let qry = "";
            if(param){
                for(var i in param){
                    if(i > 0) {qry += " AND "}else{qry += " WHERE "};
                    qry += i + " = '" + param[i] + "'";
                }
                
            }
            let sql = "SELECT * FROM " + table_name + qry;
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0]
            };;
        }catch(err){
            //console.log(err);   
            return {
                status : false,
                message: err.message
            };
        }
    },

    selectOne: async (id)=>{
        try{
            if(!id) return false;
            let sql = "SELECT * FROM " + table_name + " WHERE " + primary_key + " = '" + id + "'";
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0][0]
            };
        }catch(err){
            //console.log(err);   
            return {
                status : false,
                message: err.message
            };
        }
    },

    insert : async (data)=>{
        try{
            let dataRs = [];
            if(!data) return false;
            for(var i in dataSetAdd){
                dataRs.push(data[dataSetAdd[i]]);
            }
            let qry = "INSERT INTO " + table_name + "(" + dataSetAdd.join(',') + ") VALUES('" + dataRs.join("','") +"');";
            //console.log(qry);
            let res = await conn.query(qry);
            return {
                status : true,
                data : res[0]
            };
        }catch(err){
            //console.log(err);   
            return {
                status : false,
                message: err.message
            };
        }
    },
    update : async (id,data)=>{
        try{
            let dataRs = [];
            if(!data) return false;
            
            let qry = "UPDATE " + table_name + " SET ";
            for(var i in dataSetUpdate){
                if(i > 0) qry += " ,";
                qry += dataSetUpdate[i] + " = '" + (data[dataSetUpdate[i]]) + "'";
            }
            qry += " WHERE " + primary_key + " = '" + id + "';";
            
            //console.log(qry);
            let res = await conn.query(qry);
            return {
                status : true,
                data : res[0]
            };
        }catch(err){
            //console.log(err);   
            return {
                status : false,
                message: err.message
            };
        }
    },

    delete : async (id)=>{
        try{
            if(!id) return false;
            let sql = "DELETE FROM " + table_name + " WHERE " + primary_key + " = '" + id + "'";
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0]
            };
        }catch(err){
            //console.log(err);   
            return {
                status : false,
                message: err.message
            };
        }
    }
}

module.exports = Mdl;
