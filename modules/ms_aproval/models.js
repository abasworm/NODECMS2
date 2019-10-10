const conn = require('../../config/dbconnect');
const table_name =  'ms_service';
const primary_key = 'id';

const dataSetUpdate = [
    'service_code',
    'service_image_path',
    'serial_number_atm',
    'service_notes',
    'created_by'
];

let Mdl = {
    select: async(param, customParam, andOr)=>{
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
                qry += " AND " +customParam;
            }
            let sql = "SELECT * FROM " + table_name + qry;
            console.log(ary);
            console.log(sql);
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
    },
    selectDetail : async(param,customParam,andOr)=>{
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
                qry += " AND " +customParam;
            }
            let sql = "SELECT * FROM v_ms_service_detail " + qry;
            //console.log(sql);
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
    },
    selectHistory : async (noTicket)=>{
        try{
            let qry = "SELECT * FROM ms_service_history WHERE service_ticket = ? ";
            let res = await conn.query(qry,[noTicket]);
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
    },
    close: async (id,data)=>{
        try{    
            let dataRs = [];
            if(!data || !id) return false;

            let qry1 = " \
                INSERT ms_service_history(service_ticket,service_notes,service_status,created_by) \
                VALUES (?,?,?,?)";
            let qry2 = "UPDATE ms_service \
                SET service_status = ?, modified_by = ?, closed_date = NOW() \
                WHERE service_ticket = ? AND id = ?";
            //service_ticket,service_notes,service_status,created_by,service_notes,service_status,username,service_ticket
            dataRs1 = [
                data.service_ticket,
                data.service_notes,
                data.service_status,
                data.username
            ];
            dataRs2 = [
                data.service_status,
                data.username,
                data.service_ticket,
                id
            ];
            let res1 = await conn.query(qry1, dataRs1);
            let res2 = await conn.query(qry2, dataRs2);
            return {
                status : true,
                data : res1[0]
            };
        }catch(err){
            //console.log(err);   
            return {
                status : false,
                message: err.message
            };
        }
    }
};

module.exports = Mdl;

