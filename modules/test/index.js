const route = require('express').Router();
const rest = require('../../config/rest');
const { isLogin } = require('../../middleware/auth');

const _layout = {
    title : 'Welcome to dashboard'
}

route
    .get('/', (req,res,next)=>{
        res.render('adminlte/layout',_layout);
    })
;

module.exports = route;
