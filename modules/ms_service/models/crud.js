const conn = require('../../../config/dbconnect');
const table_name =  'ms_service';
const primary_key = 'id';
const dataSetAdd = [
    'service_ticket',
    'service_code',
    'service_image_path',
    'serial_number_atm',
    'service_notes',
    'created_by'
];
const dataSetUpdate = [
    'service_code',
    'service_image_path',
    'serial_number_atm',
    'service_notes',
    'created_by'
];

let Mdl = {
    getnoticket: async(param, pad)=>{
        //logic
        let table_num = "service_ticket";
        let table = "ms_service";
        let digit_prefix           = param.length;
        let digit_sum_tanggal      = 4;
        let digit_insert_tanggal   = digit_prefix + 1;
        let digit_insert_padnum    = digit_insert_tanggal + digit_sum_tanggal + 1;
        let kodeNum ="";
        //query
        let query = "SELECT \
            	CAST(DATE_FORMAT(NOW(),'%y%m') AS CHAR) AS DATEi,\
                CASE \
                    WHEN t1.MaxNo > 0 \
                        THEN LPAD(CAST(t1.MaxNo AS UNSIGNED) + 1,  " + pad + ",'0')\
                    ELSE \
                        LPAD(1, " + pad + ",'0') \
                END AS MAXi \
            FROM ( \
                SELECT \
                    MAX(SUBSTRING( " + table_num + ", " + digit_insert_padnum + ", " + pad + ")) MaxNo \
                FROM  " + table + " \
                WHERE \
                    SUBSTRING( " + table_num + ", " + digit_insert_tanggal + ", " + digit_sum_tanggal + ") = CAST(DATE_FORMAT(NOW(),'%y%m') AS CHAR) \
                    AND  " + table_num + " LIKE '" + param + "%' \
            ) AS t1 ";
        try{
            
            let res = await conn.query(query);
            kodeNum = ""+res[0][0].DATEi + res[0][0].MAXi;
            return param + kodeNum;
        }catch(err){
            return false;
            
        }
        
    },

    select : async (param, customParam)=>{
        try{
            let qry = "";
            let ary = [];
            qry += " WHERE is_deleted = 'N' "; //preventif deleted data

            if(param){
                for(var i in param){
                    qry += " AND ";
                    qry += i + " = ? ";
                    ary.push(param[i]);
                }
            }
            if(customParam){
                qry += " AND " +customParam;
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
            let qry1 = " \
                INSERT ms_service_history(service_ticket,service_notes,service_status,created_by) \
                VALUES (?,?,?,?)";
            //console.log(qry);
            let res = await conn.query(qry);
            let res1 = await conn.query(qry1,[data.service_ticket, data.service_notes, "ON PROCESS", data.created_by]);
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

    close : async(id,data) =>{
        try{
            let dataRs = [];
            if(!data || !id) return false;

            let qry1 = " \
                INSERT ms_service_history(service_ticket,service_notes,service_status,created_by) \
                VALUES (?,?,?,?)";
            let qry2 = "UPDATE ms_service \
                SET service_image_path_closed = ?, service_notes_closed = ?, service_status = ?, modified_by = ?, closed_date = NOW() \
                WHERE service_ticket = ? AND id = ?";
            //service_ticket,service_notes,service_status,created_by,service_notes,service_status,username,service_ticket
            dataRs1 = [
                data.service_ticket,
                data.service_notes,
                data.service_status,
                data.username
            ];
            dataRs2 = [
                data.service_image_path,
                data.service_notes,
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
            let sql = "UPDATE " + table_name + " SET is_deleted = 'Y' WHERE " + primary_key + " = '" + id + "'";
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
