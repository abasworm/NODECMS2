var route = require('express').Router();

route.use('/dashboard', require('../modules/dashboard'));

//USER MODULE
route.use('/users', require('../modules/users'));
route.use('/api/users', require('../modules/users/api'));

module.exports = route;
