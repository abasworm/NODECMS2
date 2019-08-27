const route = require('express').Router();
const rest = require('../../config/rest');
const { isLogin } = require('../../middleware/auth');

const _layout = {
    title : 'Welcome to dashboard'
}

route
    .get('/',isLogin, (req,res,next)=>{
        res.render('dashboard',_layout);
    })
;

module.exports = route;
