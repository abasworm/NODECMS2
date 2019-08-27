const route = require('express').Router();
const Joi = require('@hapi/joi');
const rest = require('../../config/rest');
const bcrypt = require('bcryptjs');
const Users = require('./models/crud');

const JoiSchemaAdd = {
	username : Joi.string().min(6).max(20).required(),
	password : Joi.string().min(6).max(20).required(),
	confpassword : Joi.string().min(6).max(20).required().valid(Joi.ref('password')),
    firstname : Joi.string().min(4).max(30).required(),
    lasttname : Joi.string(),
};
const JoiSchemaEdit = {
	id : Joi.string().required(),
	username : Joi.string().min(6).max(20).required(),
	firstname : Joi.string().min(4).max(30).required(),
    lasttname : Joi.string(),
};
const fieldToShow = [
	'_id',
	'username',
	'fullname'
];

route
    .get('/',async (req,res,next)=>{
        let result = await Users.select();
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    })
    .get('/:id',async (req,res,next)=>{
        let id = req.params.id;
        let result = await Users.selectOne(id);
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    })
    .post('/', async (req,res,next)=>{
        if(!req.body) return res.sendStatus(400);

        //password hash
        const salt = await bcrypt.genSalt(10);
        const pwd = await bcrypt.hash(req.body.password,salt);
        
        //getdata
        let data = {
            username : req.body.username,
            password : pwd,
            firstname: req.body.firstname,
            lastname : req.body.lastname
        };

        //validating
        const { joiError, values} = Joi.validate(data, JoiSchemaAdd);
        if(joiError){
			const message = joiError.details[0].message;
			const value = joiError.details[0].path[0];
			return rest.error(value,message,res);
        }
        
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

    .put('/:id',async (req,res,next)=>{
        if(!req.body) return res.sendStatus(400);

        //getdata
        let data = {
            username : req.body.username,
            firstname: req.body.firstname,
            lastname : req.body.lastname
        };

        //password hash
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            const pwd = await bcrypt.hash(req.body.password,salt);
            JoiSchemaEdit.password = Joi.string().min(6).max(20).required();
            JoiSchemaEdit.confpassword = Joi.string().min(6).max(20).required().valid(Joi.ref('password'));
            data.password = pwd;
        }        

        //validating
        const { joiError, values} = Joi.validate(data, JoiSchemaAdd);
        if(joiError){
			const message = joiError.details[0].message;
			const value = joiError.details[0].path[0];
			return rest.error(value,message,res);
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

    .delete('/:id',async (req,res,next)=>{
        let id = req.params.id;
        let result = await Users.delete(id);
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    });

module.exports = route;
