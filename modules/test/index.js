const route = require('express').Router();
const rest = require('../../config/rest');
const view = require('../../config/templating');

const { isLogin } = require('../../middleware/auth');

const _layout = {
    title : 'Welcome to dashboard'
}

route
    .get('/', (req,res,next)=>{
        view.ViewShow('atm',_layout,res);
    })
;

module.exports = route;
