const route = require('express').Router();
const view = require('../../config/templating');
const { isLogin } = require('../../middleware/auth');

let link = "at_ticket"
let _layout = {
    title : 'Ticket Plan',
    isAddForm : true,
    _link : link
}

route
    .get('/',isLogin ,(req,res,next)=>{
        const _tabel_layout = {
            header : ['id','service_code','service_type'], 
            header_table :['Aksi','Code','Service Type']
        };
        Object.assign(_layout,_tabel_layout);
        view.ViewShow(link + '/table',_layout,req,res);
    })
    .get('/add',isLogin ,(req,res,next)=>{
        const _tabel_layout = {
            header : ['id','service_code','service_type'], 
            header_table :['Plan','Actual','SN', 'Address']
        };
        Object.assign(_layout,_tabel_layout);
        _layout.isAddForm = true;
        view.ViewShow(link + '/form',_layout,req,res);
    })
    .get('/edit/:ids',isLogin ,(req,res,next)=>{
        const _edit_layout = {
            ids : req.params.ids
        };
        Object.assign(_layout,_edit_layout);
        _layout.isAddForm = false;
        view.ViewShow(link + '/form',_layout,req,res);
    })
;

module.exports = route;