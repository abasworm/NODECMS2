const conn = require('../../../config/dbconnect');
const table_name =  't_atm';
const primary_key = 'id';
const dataSetAdd = [
    'business_partner',
    'customer',
    'serial_number',
    'machine_id',
    'machine_type',
    'model_type',
    'service_center',
    'type_sp',
    'location_name',
    'address',
    'city',
    'province',
    'island',
    'postal_code',
    'warranty_start',
    'warranty_end',
    'service_provider',
    'flm',
    'pm_freq_per_year',
    'pm_period',
    'contract_status',
    'machine_status',
    'district',
    'fsm',
    'sect',
    'fss_supervisor',
    'fs_engineer',
    'fse_code',
    'district_code',
    'grade',
    'fsl',
    'csm',
    'note',
    'atm'
];
const dataSetUpdate = [
    'business_partner',
    'customer',
    'serial_number',
    'machine_id',
    'machine_type',
    'model_type',
    'service_center',
    'type_sp',
    'location_name',
    'address',
    'city',
    'province',
    'island',
    'postal_code',
    'warranty_start',
    'warranty_end',
    'service_provider',
    'flm',
    'pm_freq_per_year',
    'pm_period',
    'contract_status',
    'machine_status',
    'district',
    'fsm',
    'sect',
    'fss_supervisor',
    'fs_engineer',
    'fse_code',
    'district_code',
    'grade',
    'fsl',
    'csm',
    'note',
    'atm'
];

let Mdl = {
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
            if(res) {
                return {
                    status : true,
                    data : res[0]
                };
            }else{
                return {
                    status : false,
                    message: "Not Found"
                };
            }
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
