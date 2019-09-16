var route = require('express').Router();

route.use('/dashboard', require('../modules/dashboard'));

//USER MODULE
route.use('/users', require('../modules/users'));
route.use('/api/users', require('../modules/users/api'));

route.use('/api/atm',require('../modules/atm/api'));

route.use('/ms_service_type', require('../modules/ms_service_type'));
route.use('/api/ms_service_type',require('../modules/ms_service_type/api'));

route.use('/ms_service', require('../modules/ms_service'));
route.use('/api/ms_service',require('../modules/ms_service/api'));

route.use('/at_ticket', require('../modules/at_ticket'));
route.use('/api/at_ticket', require('../modules/at_ticket/api'));

module.exports = route;
