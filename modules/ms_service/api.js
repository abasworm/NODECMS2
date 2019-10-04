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
	serial_number_atm : Joi.string().min(4).max(20).required(),
	image : Joi.string().required(),
    service_notes : Joi.string()
};

const JoiSchemaEdit = {
    id : Joi.number().required(),
    service_ticket : Joi.string(),
	service_image_closed : Joi.string().required(),
    service_notes : Joi.string()
};

route
    .get('/service_type', async(req,res,next)=>{
        let result = await Ms_service_type.select();
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    })
    // .get('/',auth.isLoginAPI , async (req,res,next)=>{
    //     let result = await Ms_service.select();
    //     if(!result.status) await rest.error('',result.message,res);
    //     rest.success(result.data,'sukses',res);
    // })
    .post('/datatable',auth.isLoginDTTbl, async (req,res,next)=>{
        const username = req.session.username;
        const fieldToShow = ['id','service_ticket','service_code','serial_number_atm','service_status']; //field to show
        let paramSrc = {created_by : username} //param to db
        let paramCust = " created_date BETWEEN DATE_ADD(NOW(), INTERVAL -3 DAY) AND NOW()"; //extra query
        let result = await Ms_service.select(paramSrc, paramCust); // database result
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
            'service_image_path',
            'serial_number_atm',
            'service_notes',
            'service_status'
        ]; //field to show
        let paramSrc = {
            created_by : username,
            id : ids
        }; //param to db
        let result = await Ms_service.select(paramSrc); // database result
        if(!result.status) await rest.error('',result.message,res);
        var data = {};
        
        for(var k in result.data[0]){
            if(fieldToShow.includes(k)){
                data[k] = result.data[0][k];
            }
            
        }
        
        rest.success(data,'sukses',res);
    })
    .post('/',auth.isLoginAPI, async (req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        
        //getdata
        let data = {
            service_code : req.body.service_code,
            serial_number_atm : req.body.id_atm,
            image : req.body.image.trim(),
            service_notes : req.body.service_notes.trim()
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

            //insert Image Data to Folder Temp
            let datas = data.image;
            let base64Data = datas.replace(/^data:image\/webp;base64,/,"");
            base64Data += base64Data.replace('+',' ');
            let binaryData = new Buffer.alloc((3*(base64Data.length /4)),base64Data,'base64').toString('binary');
            let uid = uuid();
            
            //folder Structure
            let fdate = new Date()
            let year = fdate.getFullYear();
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let month = monthNames[fdate.getMonth()];
            let dateNo = "" + fdate.getDate() + (fdate.getMonth()>10?fdate.getMonth():"0"+fdate.getMonth()) + fdate.getFullYear();
            let dir = "./UPLOADER/" + data.service_code + "/" + year + "/" + month + "/" + dateNo + "/" + data.serial_number_atm ;
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir,{recursive:true});
            }

            let path2save = dir + "/open-" + uid + ".webp";
            fs.writeFile(path2save,binaryData,"binary",function(err){
                console.log(err);
            });

            //Delete Data
            delete data.image;
            //create Ticket No
            const ticketNo = await Ms_service.getnoticket(data.service_code, 5);
            let dataPlus = {
                service_image_path : path2save,
                service_ticket : ticketNo,
                created_by : req.session.username
            }
            Object.assign(data,dataPlus);
            
            let result  = await Ms_service.insert(data);
            if(!result.status) await rest.error('',result.message,res);
            rest.success(result.data,'sukses',res);

        }catch(err){
            //console.log(err); 
            return rest.error(err,err.message,res);
        }

    })

    .put('/:id',auth.isLoginAPI, async (req,res,next)=>{
        if(!req.body || !req.params.id) return res.sendStatus(400);
        //getdata
        let data = {
            id : req.params.id,
            service_ticket : req.body.no_ticket,
            service_image_closed : req.body.image,
            service_notes : req.body.service_notes
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
            let paramSrc = {
                created_by : req.session.username,
                id : data.id
            }; //param to db
            let resultA = await Ms_service.select(paramSrc); // database result
            
            if(!resultA.status) return rest.error('',"Data Tidak ditemukan",res);
            let img_path = resultA.data[0].service_image_path;
            let img_post = img_path.lastIndexOf('/');
            let dir = img_path.replace(img_path.substring(img_post,img_path.length),"");
            console.log(dir);
            
            //get binnary data and UUID
            let datas = data.service_image_closed;
            let base64Data = datas.replace(/^data:image\/webp;base64,/,"");
            base64Data += base64Data.replace('+',' ');
            let binaryData = new Buffer.alloc((3*(base64Data.length /4)),base64Data,'base64').toString('binary');
            let uid = uuid();

            
            //let img_post = img_path.lastIndexOf('/');
            //let dir = img_path.replace(img_path.substring(img_post,img_path.length),'');
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir,{recursive:true});
            }

            let path2save = dir + "/closed-" + uid + ".webp";
            fs.writeFile(path2save,binaryData,"binary",function(err){
                console.log(err);
            });

            delete data.service_image_closed;

            let dataPlus = {
                service_image_path : path2save,
                service_status : 'OPEN',
                username : req.session.username
            }
            Object.assign(data,dataPlus);
            let result = await Ms_service.close(req.params.id,data);
            if(!result.status) await rest.error('',result.message,res);
            rest.success(result.data,'sukses',res);
        }catch(err){
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
