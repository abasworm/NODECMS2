const route = require('express').Router();
const view = require('../../config/templating');
const { isLogin } = require('../../middleware/auth');

let link = "ms_aproval"
let _layout = {
    title : 'Approval Admin',
    isAddForm : true,
    _link : link
}

route
    .get('/',isLogin ,(req,res,next)=>{
        const _tabel_layout = {
            header : ['id','service_ticket','serial_number_atm','service_status'],
            header_table : ['Aksi','Ticket','SSBID','Status']
        };
        Object.assign(_layout,_tabel_layout);
        view.ViewShow(link + '/table',_layout,req,res);
    })

    .get('/check/:ids',isLogin ,(req,res,next)=>{
        const _edit_layout = {
            ids : req.params.ids
        };
        Object.assign(_layout,_edit_layout);
        _layout.isAddForm = false;
        view.ViewShow(link + '/close',_layout,req,res);
    })
    
    .get('/close/:ids',isLogin ,(req,res,next)=>{
        const _edit_layout = {
            ids : req.params.ids
        };
        Object.assign(_layout,_edit_layout);
        _layout.isAddForm = false;
        view.ViewShow(link + '/close',_layout,req,res);
    })
;

module.exports = route;