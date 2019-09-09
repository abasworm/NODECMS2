const route = require('express').Router();
const auth = require('../../middleware/auth');
const Joi = require('@hapi/joi');
const rest = require('../../config/rest');

const MdlCrud = require('./models/crud');

const JoiSchemaAdd = {
    business_partner : Joi.string(),
    customer : Joi.string(),
    serial_number : Joi.string(),
    machine_id : Joi.string(),
    machine_type : Joi.string(),
    model_type : Joi.string(),
    service_center : Joi.string(),
    type_sp : Joi.string(),
    location_name : Joi.string(),
    address : Joi.string(),
    city : Joi.string(),
    province : Joi.string(),
    island : Joi.string(),
    postal_code : Joi.string(),
    warranty_start : Joi.string(),
    warranty_end : Joi.string(),
    service_provider : Joi.string(),
    flm : Joi.string(),
    pm_freq_per_year : Joi.string(),
    pm_period : Joi.string(),
    contract_status : Joi.string(),
    machine_status : Joi.string(),
    district : Joi.string(),
    fsm : Joi.string(),
    sect : Joi.string(),
    fss_supervisor : Joi.string(),
    fs_engineer : Joi.string(),
    fse_code : Joi.string(),
    district_code : Joi.string(),
    grade : Joi.string(),
    fsl : Joi.string(),
    csm : Joi.string(),
    note : Joi.string(),
    atm : Joi.string()
};
const JoiSchemaEdit = {
	id : Joi.number().required(),
	business_partner : Joi.string(),
    customer : Joi.string(),
    serial_number : Joi.string().required(),
    machine_id : Joi.string(),
    machine_type : Joi.string().required(),
    model_type : Joi.string(),
    service_center : Joi.string(),
    type_sp : Joi.string(),
    location_name : Joi.string(),
    address : Joi.string(),
    city : Joi.string(),
    province : Joi.string(),
    island : Joi.string(),
    postal_code : Joi.string(),
    warranty_start : Joi.string(),
    warranty_end : Joi.string(),
    service_provider : Joi.string(),
    flm : Joi.string(),
    pm_freq_per_year : Joi.string(),
    pm_period : Joi.string(),
    contract_status : Joi.string(),
    machine_status : Joi.string(),
    district : Joi.string(),
    fsm : Joi.string(),
    sect : Joi.string(),
    fss_supervisor : Joi.string(),
    fs_engineer : Joi.string(),
    fse_code : Joi.string(),
    district_code : Joi.string(),
    grade : Joi.string(),
    fsl : Joi.string(),
    csm : Joi.string(),
    note : Joi.string(),
    atm : Joi.string()
};

route
    .get('/ssbid/:id', auth.isLoginAPI ,async(req,res,next)=>{
        let result = await MdlCrud.select({"serial_number":req.params.id});
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    })
    .get('/',auth.isLoginAPI , async (req,res,next)=>{
        let result = await MdlCrud.select();
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    })
    .post('/datatable',auth.isLoginDTTbl, async (req,res,next)=>{
        let result = await MdlCrud.select();
        if(!result.status) await rest.error('',result.message,res);
        rest.datatable(result.data,res);
    })
    .get('/:id',auth.isLoginAPI, async (req,res,next)=>{
        let id = req.params.id;
        let result = await MdlCrud.selectOne(id);
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    })
    .post('/',auth.isLoginAPI, async (req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        
        //getdata
        let data = {
            business_partner : req.body.business_partner,
            customer : req.body.customer,
            serial_number : req.body.serial_number,
            machine_id : req.body.machine_id,
            machine_type : req.body.machine_type,
            model_type : req.body.model_type,
            service_center : req.body.service_center,
            type_sp : req.body.type_sp,
            location_name : req.body.location_name,
            address : req.body.address,
            city : req.body.city,
            province : req.body.province,
            island : req.body.island,
            postal_code : req.body.postal_code,
            warranty_start : req.body.warranty_start,
            warranty_end : req.body.warranty_end,
            service_provider : req.body.service_provider,
            flm : req.body.flm,
            pm_freq_per_year : req.body.pm_freq_per_year,
            pm_period : req.body.pm_period,
            contract_status : req.body.contract_status,
            machine_status : req.body.machine_status,
            district : req.body.district,
            fsm : req.body.fsm,
            sect : req.body.sect,
            fss_supervisor : req.body.fss_supervisor,
            fs_engineer : req.body.fs_engineer,
            fse_code : req.body.fse_code,
            district_code : req.body.district_code,
            grade : req.body.grade,
            fsl : req.body.fsl,
            csm : req.body.csm,
            note : req.body.note,
            atm : req.body.atm
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
            let result = await MdlCrud.insert(data);
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
            business_partner : req.body.business_partner,
            customer : req.body.customer,
            serial_number : req.body.serial_number,
            machine_id : req.body.machine_id,
            machine_type : req.body.machine_type,
            model_type : req.body.model_type,
            service_center : req.body.service_center,
            type_sp : req.body.type_sp,
            location_name : req.body.location_name,
            address : req.body.address,
            city : req.body.city,
            province : req.body.province,
            island : req.body.island,
            postal_code : req.body.postal_code,
            warranty_start : req.body.warranty_start,
            warranty_end : req.body.warranty_end,
            service_provider : req.body.service_provider,
            flm : req.body.flm,
            pm_freq_per_year : req.body.pm_freq_per_year,
            pm_period : req.body.pm_period,
            contract_status : req.body.contract_status,
            machine_status : req.body.machine_status,
            district : req.body.district,
            fsm : req.body.fsm,
            sect : req.body.sect,
            fss_supervisor : req.body.fss_supervisor,
            fs_engineer : req.body.fs_engineer,
            fse_code : req.body.fse_code,
            district_code : req.body.district_code,
            grade : req.body.grade,
            fsl : req.body.fsl,
            csm : req.body.csm,
            note : req.body.note,
            atm : req.body.atm
        };

        
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
            let result = await MdlCrud.update(req.params.id,data);
            if(!result.status) await rest.error('',result.message,res);
            rest.success(result.data,'sukses',res);
        }catch(err){
            //console.log(err); 
            return rest.error(err,err.message,res);
        }
    })

    .delete('/:id',auth.isLoginAPI,async (req,res,next)=>{
        let id = req.params.id;
        let result = await MdlCrud.delete(id);
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    });

module.exports = route;
