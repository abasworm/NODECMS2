var route = require('express').Router();

route.use('/dashboard', require('../modules/dashboard'));

//USER MODULE
route.use('/users', require('../modules/users'));
route.use('/api/users', require('../modules/users/api'));

route.use('/ms_service_type', require('../modules/ms_service_type'));
route.use('/api/ms_service_type',require('../modules/ms_service_type/api'));


module.exports = route;
