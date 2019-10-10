const route = require('express').Router();
const auth = require('../../middleware/auth');
const rest = require('../../config/rest');

const Mdl = require('./models');
route
    .post('/datatable',auth.isLoginDTTbl, async (req,res,next)=>{
        if(!req.body) return rest.error('','NULL VALUE',res);
        const date_start = req.body.date_start;
        const date_end = req.body.date_end;
        const service_type = req.body.service_type;
        const service_status = req.body.service_status;

        let qry = "";

        //date entry
        if(date_start){
            qry += " AND created_date BETWEEN '" + date_start + "'";
            if(date_end){
                qry += " AND '" + date_end + "'";
            }else{
                qry += " AND DATE_ADD('"+date_start+"', INTERVAL 1 DAY)";
            }
        }

        if(service_status){
            qry += " AND service_status ='"+service_status+"'";
        }else{
            qry += " AND service_status IN('OPEN','DRAFT','CLOSE')";
        }

        if(service_type){
            qry += " AND service_code ='" + service_type +"'";
        }

        const fieldToShow = ['id','service_ticket','service_type','serial_number_atm','service_status','address','city']; //field to show
        let result = await Mdl.select({}, qry); // database result
        if(!result.status) await rest.error('',result.message,res);
        var data = [];
        for(var key in result.data){
            var x = {};
            for(var k in result.data[key]){
                if(fieldToShow.includes(k)){
                    x[k] = result.data[key][k];
                }
            }
            data.push(x);
        }
        rest.datatable(data,res);
    })
    .get('/:id',auth.isLoginAPI, async (req,res,next)=>{
        const username = req.session.username;
        const ids = req.params.id;
        const fieldToShow = [
            'id',
            'service_ticket',
            'service_code',
            'service_type',
            'service_image_path',
            'service_image_path_closed',
            'serial_number_atm',
            'atm.address',
            'atm.city',
            'atm.province',
            'service_notes',
            'service_status',
            'created_date',
            'closed_date',
            'modified_date',
        ]; //field to show
        let paramSrc = {
            created_by : username,
            id : ids
        }; //param to db
        let result = await Mdl.select(paramSrc); // database result
        if(!result.status) await rest.error('',result.message,res);
        var data = {};
        
        for(var k in result.data[0]){
            if(fieldToShow.includes(k)){
                data[k] = result.data[0][k];
            }
            
        }
        
        rest.success(data,'sukses',res);
    })
    .post('/history', auth.isLoginAPI, async (req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        noTicket = req.body.no_ticket;
        try{
            const fieldToShow = [
                'service_ticket',
                'service_notes',
                'service_status',
                'created_date',
                'created_by'
            ]; //field to show
            let result = await Mdl.selectHistory(noTicket); // database result
            if(!result.status) await rest.error('',result.message,res);
            var data = [];
            for(var key in result.data){
                var x = {};
                for(var k in result.data[key]){
                    if(fieldToShow.includes(k)){
                        x[k] = result.data[key][k];
                    }
                }
                data.push(x);
            }
            
            rest.success(data,'sukses',res);
        } catch(err){
            return rest.error(err,err.message,res);
        }
    
    })
    ;

module.exports = route;