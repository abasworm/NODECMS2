const route = require('express').Router();
const auth = require('../../middleware/auth');
const Joi = require('@hapi/joi');
const rest = require('../../config/rest');

const Ms_service = require('./models/crud');
const Ms_service_type = require('../ms_service_type/models/crud');

const JoiSchemaAdd = {
	username : Joi.string().min(6).max(20).required(),
	password : Joi.string().min(6).max(20).required(),
	confpassword : Joi.string().min(6).max(20).required().valid(Joi.ref('password')),
    firstname : Joi.string().min(4).max(30).required(),
    lastname : Joi.string(),
};
const JoiSchemaEdit = {
	id : Joi.number().required(),
	username : Joi.string().min(6).max(20).required(),
	firstname : Joi.string().min(4).max(30).required(),
    lastname : Joi.string(),
};

route
    .get('/service_type', async(req,res,next)=>{
        let result = await Ms_service_type.get();
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    })
    .get('/',auth.isLoginAPI , async (req,res,next)=>{
        let result = await Users.select();
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    })
    .post('/datatable',auth.isLoginDTTbl, async (req,res,next)=>{
        let result = await Users.select();
        if(!result.status) await rest.error('',result.message,res);
        rest.datatable(result.data,res);
    })
    .get('/:id',auth.isLoginAPI, async (req,res,next)=>{
        let id = req.params.id;
        let result = await Users.selectOne(id);
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    })
    .post('/',auth.isLoginAPI, async (req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        
        //getdata
        let data = {
            username : req.body.username,
            password : req.body.password,
            firstname: req.body.firstname,
            lastname : req.body.lastname
        };

        //validating
        try{
            const joiError = await Joi.validate(data, JoiSchemaAdd);
        }catch(err){
            const message = err.details[0].message;
			const value = err.details[0].path[0];
			return rest.error(value,message,res);
        }

        //password hash
        const salt = await bcrypt.genSalt(10);
        const pwd = await bcrypt.hash(req.body.password,salt);
        data.password = pwd;

        //insert user
        try{
            let result = await Users.insert(data);
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
            username : req.body.username,
            firstname: req.body.firstname,
            lastname : req.body.lastname
        };


        //password 
        if(req.body.password){
            JoiSchemaEdit.password = Joi.string().min(6).max(20).required();
            JoiSchemaEdit.confpassword = Joi.string().min(6).max(20).required().valid(Joi.ref('password'));
            data.password = req.body.password;
            data.confpassword = req.body.confpassword;
        }
        
        //validation
        try{
            const joiError = await Joi.validate(data, JoiSchemaEdit);
        }catch(err){
            const message = err.details[0].message;
			const value = err.details[0].path[0];
			return rest.error(value,message,res);
        }
        
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            const pwd = await bcrypt.hash(req.body.password,salt);
            data.password = pwd;
        }

        //insert user
        try{
            let result = await Users.update(req.params.id,data);
            if(!result.status) await rest.error('',result.message,res);
            rest.success(result.data,'sukses',res);
        }catch(err){
            //console.log(err); 
            return rest.error(err,err.message,res);
        }
    })

    .delete('/:id',auth.isLoginAPI,async (req,res,next)=>{
        let id = req.params.id;
        let result = await Users.delete(id);
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    });

module.exports = route;
