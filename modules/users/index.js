const route = require('express').Router();

route
    .get('/',(req,res,next)=>{})
    .get('/add',(req,res,next)=>{})
    .get('/edit',(req,res,next)=>{})
;

module.exports = route;