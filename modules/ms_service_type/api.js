const route = require('express').Router();
const auth = require('../../middleware/auth');
const Joi = require('@hapi/joi');
const rest = require('../../config/rest');

const Ms_service = require('./models/crud');


const JoiSchemaAdd = {
	service_code : Joi.string().min(3).max(10).required(),
	service_type : Joi.string().min(6).max(100).required()
};
const JoiSchemaEdit = {
    id : Joi.number().required(),
	service_code : Joi.string().min(3).max(10).required(),
	service_type : Joi.string().min(6).max(100).required()
};

route
    .get('/',auth.isLoginAPI , async (req,res,next)=>{
        let result = await Ms_service.select();
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    })
    .post('/datatable',auth.isLoginDTTbl, async (req,res,next)=>{
        let result = await Ms_service.select();
        if(!result.status) await rest.error('',result.message,res);
        rest.datatable(result.data,res);
    })
    .get('/:id',auth.isLoginAPI, async (req,res,next)=>{
        let id = req.params.id;
        let result = await Ms_service.selectOne(id);
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
            let result = await Ms_service.insert(data);
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
            let result = await Ms_service.update(req.params.id,data);
            if(!result.status) await rest.error('',result.message,res);
            rest.success(result.data,'sukses',res);
        }catch(err){
            //console.log(err); 
            return rest.error(err,err.message,res);
        }
    })

    .delete('/:id',auth.isLoginAPI,async (req,res,next)=>{
        let id = req.params.id;
        let result = await Ms_service.delete(id);
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    });

module.exports = route;
