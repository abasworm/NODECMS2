const route = require('express').Router();
const view = require('../../config/templating');
const { isLogin } = require('../../middleware/auth');

let link = "ms_reports"
let _layout = {
    title : 'Reports',
    isAddForm : true,
    _link : link
}

route
    .get('/',isLogin ,(req,res,next)=>{
        const _tabel_layout = {
            header : ['id','service_ticket','service_type','serial_number_atm','address','city','service_status'],
            header_table : ['Aksi','Ticket','Service Type','SSBID','ATM LOC','Kota','Status']
        };
        Object.assign(_layout,_tabel_layout);
        view.ViewShow(link + '/table',_layout,req,res);
    })
    .get('/view/:ids',isLogin ,(req,res,next)=>{
        const _edit_layout = {
            ids : req.params.ids
        };
        Object.assign(_layout,_edit_layout);
        _layout.isAddForm = false;
        view.ViewShow(link + '/view',_layout,req,res);
    })
    ;

module.exports = route;