const route = require('express').Router();
const auth = require('../../middleware/auth');
const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const rest = require('../../config/rest');

const Mdl = require('./models/crud');


const JoiSchemaAdd = {
	atm_serial_number : Joi.string().min(4),
    date_plan : Joi.date().format('YYYY-MM-DD').utc(),
    ticket : Joi.string().min(4),
    date_actual : Joi.date().format('YYYY-MM-DD').utc(),
    status : Joi.string()
};
const JoiSchemaEdit = {
    atm_serial_number : Joi.string().min(4),
    date_plan : Joi.date().format('YYYY-MM-DD').utc(),
    ticket : Joi.string().min(4),
    date_actual : Joi.date().format('YYYY-MM-DD').utc(),
    status : Joi.string()
};

route
    .get('/',auth.isLoginAPI , async (req,res,next)=>{
        let result = await Mdl.select();
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    })
    .post('/datatable/detail',auth.isLoginDTTbl, async (req,res,next)=>{
        let snList = req.body.serial_number_list;
        let param = await snList.trim().split("\n");
        let result = await Mdl.selectWhereIn('serial_number',param);
        if(!result.status) await rest.error('',result.message,res);
        rest.datatable(result.data,res);
    })
    .post('/datatable',auth.isLoginDTTbl, async (req,res,next)=>{
        let result = await Mdl.select();
        if(!result.status) await rest.error('',result.message,res);
        rest.datatable(result.data,res);
    })
    .get('/:id',auth.isLoginAPI, async (req,res,next)=>{
        let id = req.params.id;
        let result = await Mdl.selectOne(id);
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    })
    .post('/',auth.isLoginAPI, async (req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        
        //getdata
        let data = {
            service_code : req.body.service_code,
            service_type : req.body.service_type
        };

        //validating
        try{
            const joiError = await Joi.validate(data, JoiSchemaAdd);
        }catch(err){
            const message = err.details[0].message;
			const value = err.details[0].path[0];
			return rest.error(value,message,res);
        }

        data.notes = req.body.notes;

        //insert user
        try{
            let result = await Mdl.insert(data);
            if(!result.status) await rest.error('',result.message,res);
            rest.success(result.data,'sukses',res);
        }catch(err){
            //console.log(err); 
            return rest.error(err,err.message,res);
        }

    })

    .put('/:id',auth.isLoginAPI, async (req,res,next)=>{
        if(!req.body || !req.params.id) return res.sendStatus(400);
        console.log(req.params.id);
        //getdata
        let data = {
            id : req.params.id,
            service_code : req.body.service_code,
            service_type: req.body.service_type
        };
        
        //validation
        try{
            const joiError = await Joi.validate(data, JoiSchemaEdit);
        }catch(err){
            const message = err.details[0].message;
			const value = err.details[0].path[0];
			return rest.error(value,message,res);
        }
        
        data.notes = req.body.notes;
        
        //insert user
        try{
            let result = await Mdl.update(req.params.id,data);
            if(!result.status) await rest.error('',result.message,res);
            rest.success(result.data,'sukses',res);
        }catch(err){
            //console.log(err); 
            return rest.error(err,err.message,res);
        }
    })

    .delete('/:id',auth.isLoginAPI,async (req,res,next)=>{
        let id = req.params.id;
        let result = await Mdl.delete(id);
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    });

module.exports = route;
