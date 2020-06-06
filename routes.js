const routes = require('express').Router();
const {signUp} = require('./services/signUp');
const {logIn} = require('./services/login');
const {sessionValidity} = require('./services/sessionValidity');
const {changePassword} = require('./services/changePassword');
const {details} = require('./services/details');
const {logout} = require('./services/logout');
//Not to be exposed via API Gateway Endpoint
//INternal endpoint to be called by Admin App using service discovery
routes.post('/staff/signup', signUp);

routes.post('/staff/login', logIn);
routes.get('/staff/session', sessionValidity);
routes.get('/staff/details', details);
routes.delete('/staff/session/:sessionId', logout);
routes.post('/staff/change-password', changePassword);
routes.get('/staff/users'); //Endpoint to get all the staff users
routes.get('/staff/deactivate'); //Endpoint to deactivate staff members
//routes.put('/admin/forgot-password'); //To be implemented across all apps
module.exports = routes;
