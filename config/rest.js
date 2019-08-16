'use strict';

const resp = {
    success : (values,message,res)=>{
        let data = {
            'status' : true,
            'message': message,
            'results' : values
        };
        return res.sendStatus(200).json(data);
    },
    failure : (values,message,res)=>{
        let data = {
            'status' : false,
            'message': message,
            'results' : values
        };
        return res.sendStatus(500).json(data);
    },
    error : (values,message,res)=>{
        let data = {
            'status' : false,
            'message': message,
            'results' : values
        };
        return res.sendStatus(400).json(data);
    },
    notfound : (res)=>{
        return res.sendStatus(404);
    },
}

module.exports = resp;