const route = require('express').Router();
const rest = require('../../config/rest');
const bcrypt = require('bcryptjs');
const Users = require('./models/crud');

route
    .get('/',async (req,res,next)=>{
        let result = await Users.select();
        if(!result) await rest.error(result,'Error can\'t show the result.',res);
        await rest.success(result,'sukses',res);
    })
    .get('/:id',async (req,res,next)=>{
        let id = req.params.id;
        let result = await Users.selectOne(id);
        if(!result) await rest.error(result,'Error can\'t show the result.',res);
        await rest.success(result,'sukses',res);
    })
    .post('/')
    .put('/:id')
    .delete('/:id');

module.exports = route;
