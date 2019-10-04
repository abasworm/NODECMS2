const route = require('express').Router();
const auth = require('../../middleware/auth');
const Joi = require('@hapi/joi');
//const ImageExt = require('joi-image-extension');
const rest = require('../../config/rest');
const upload = require('../../middleware/upload');

const Mdl = require('./models');

//const customJoi = Joi.extend(ImageExt);

const JoiSchemaAdd = {
	service_code : Joi.string().required(),
	serial_number_atm : Joi.string().min(4).max(20).required(),
	image : Joi.string().required(),
    service_notes : Joi.string()
};

const JoiSchemaEdit = {
    id : Joi.number().required(),
    service_ticket : Joi.string().required(),
    service_notes : Joi.string().required(),
    service_status : Joi.string()
};


route
    .post('/datatable',auth.isLoginDTTbl, async (req,res,next)=>{
        const fieldToShow = ['id','service_ticket','service_code','serial_number_atm','service_status']; //field to show
        let paramCust = " service_status IN('OPEN','DRAFT','CLOSE') AND created_date BETWEEN DATE_ADD(NOW(), INTERVAL -7 DAY) AND NOW()"; //extra query
        let result = await Mdl.select({}, paramCust); // database result
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
    .put('/:id',auth.isLoginAPI, async (req,res,next)=>{
        if(!req.body || !req.params.id) return res.sendStatus(400);
        //getdata
        let data = {
            id : req.params.id,
            service_ticket : req.body.no_ticket,
            service_notes : req.body.service_notes,
            service_status : req.body.service_status
        };

    
        //validation
        try{
            const joiError = await Joi.validate(data, JoiSchemaEdit);
        }catch(err){
            const message = err.details[0].message;
			const value = err.details[0].path[0];
			return rest.error(value,message,res);
        }

        try{

            let dataPlus = {
                username : req.session.username
            }
            Object.assign(data,dataPlus);
            let result = await Mdl.close(req.params.id,data);
            if(!result.status) await rest.error('',result.message,res);
            rest.success(result.data,'sukses',res);
        }catch(err){
            return rest.error(err,err.message,res);
        }

    })

module.exports = route;
