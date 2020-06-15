const routes = require('express').Router();
const {signUp} = require('./services/signUp');
const {logIn} = require('./services/login');
const {sessionValidity} = require('./services/sessionValidity');
const {changePassword} = require('./services/changePassword');
const {details} = require('./services/details');
const {logout} = require('./services/logout');
const {validateToken} = require('./services/validateToken');
const {confirmUser} = require('./services/confirmUser');
const {fetchAllUsers} = require('./services/getAllUsers');
const {disableUser} = require('./services/disableUser');
const {enableUser} = require('./services/enableUser');
//Not to be exposed via API Gateway Endpoint
//INternal endpoint to be called by Admin App using service discovery
routes.post('/staff/signup', signUp);
routes.get('/staff/users', fetchAllUsers); //Endpoint to get all the staff users
routes.get('/staff/disable/:identityId', disableUser); //Endpoint to deactivate staff members
routes.get('/staff/enable/:identityId', enableUser); //Endpoint to activate staff members

//These endpoints don't need any authorizer
routes.post('/staff/login', logIn);
routes.post('/staff/validate-token', validateToken);
routes.post('/staff/confirm-user', confirmUser);

routes.get('/staff/session', sessionValidity);
routes.get('/staff/details', details);
routes.delete('/staff/session/:sessionId', logout);
routes.post('/staff/change-password', changePassword);

//routes.put('/staff/forgot-password'); //To be implemented across all apps
module.exports = routes;
