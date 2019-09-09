const route = require('express').Router();
const auth = require('../../middleware/auth');
const Joi = require('@hapi/joi');
//const ImageExt = require('joi-image-extension');
const rest = require('../../config/rest');
const upload = require('../../middleware/upload');
const fs = require('fs');
const uuid = require('uuid/v4');

const Ms_service = require('./models/crud');
const Ms_service_type = require('../ms_service_type/models/crud');

//const customJoi = Joi.extend(ImageExt);

const JoiSchemaAdd = {
	service_code : Joi.string().required(),
	id_atm : Joi.string().min(6).max(20).required(),
	image : Joi.string().required(),
    service_notes : Joi.string().required()
};

const JoiSchemaEdit = {
	id : Joi.number().required(),
	username : Joi.string().min(6).max(20).required(),
	firstname : Joi.string().min(4).max(30).required(),
    lastname : Joi.string(),
};

route
    .get('/service_type', async(req,res,next)=>{
        let result = await Ms_service_type.select();
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    })
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
            id_atm : req.body.id_atm,
            image : req.body.image,
            service_notes : req.body.service_notes
        };

        //validating
        try{
            const joiError = await Joi.validate(data, JoiSchemaAdd);
        }catch(err){
            const message = err.details[0].message;
			const value = err.details[0].path[0];
			return rest.error(value,message,res);
        }

        //insert user
        try{
            let datas = data.image;
            let base64Data = datas.replace(/^data:image\/webp;base64,/,"");
            base64Data += base64Data.replace('+',' ');
            let binaryData = new Buffer(base64Data,'base64').toString('binary');
            let uid = uuid();
            let path2save = "temp/" + uid + ".webp";
            fs.writeFile(path2save,binaryData,"binary",function(err){
                console.log(err);
            });
            // let result = await Ms_service.insert(data);
            // if(!result.status) await rest.error('',result.message,res);
            // rest.success(result.data,'sukses',res);
            res.json({
                a : req.body.image
            });

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
            id_atm : req.body.id_atm,
            image : req.body.image,
            service_notes : req.body.service_notes
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
