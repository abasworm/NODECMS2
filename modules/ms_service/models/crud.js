const conn = require('../../../config/dbconnect');
const table_name =  'ms_service';
const primary_key = 'id';
const dataSetAdd = [
    'service_ticket',
    'service_type',
    'service_image_path',
    'id_atm',
    'service_notes',
    'created_by'
];
const dataSetUpdate = [
    'service_ticket',
    'service_type',
    'service_image_path',
    'id_atm',
    'service_notes',
    'modified_by'
];

let Mdl = {
    getnoticket: async(param, pad)=>{
        //logic
        let table_num = "service_ticket";
        let table = "ms_service";
        let digit_prefix           = param.lenght;
        let digit_sum_tanggal      = 4;
        let digit_insert_tanggal   = digit_prefix + 1;
        let digit_insert_padnum    = digit_insert_tanggal + digit_sum_tanggal + 1;

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
                    MAX(SUBSTRING( " + table_num + ", " + digit_insert_padnum + ", " + pad + ") MaxNo \
                FROM  " + table + " \
                WHERE \
                    SUBSTRING( " + table_num + ", " + digit_insert_tanggal + ", " + digit_sum_tanggal + ") = CAST(DATE_FORMAT(NOW(),'%y%m') AS CHAR) \
                    AND  " + table_num + " LIKE '" + param + "%' \
            ) AS t1 ";
        try{
            let res = await conn.query(sql);
            let kodeNum = res['DATEi'] + res['MAXi'];
        }catch(err){
            return {
                status : false,
                data : err.message
            };
        }
        //gabungkan string dengan kode yang telah dibuat tadi
        return {
            status : true,
            data : param+kodeNum
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
