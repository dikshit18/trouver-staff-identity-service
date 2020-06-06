const AWS = require('aws-sdk');
require('dotenv').config();
AWS.config.update({
  region: 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
});
const cognitoClient = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});
/*
Module pattern interface the methods from the global space and provide modularity
*/
const cognito = (() => {
  return {
    signUp: (Username, Password) => {
      var params = {
        ClientId: process.env.USER_POOL_CLIENT_ID,
        Password: Password,
        Username: Username
      };
      return new Promise((res, rej) => {
        cognitoClient.signUp(params, (err, data) => {
          if (err) {
            console.log('Error while signup admin...', err);
            rej({
              ...err,
              origin: 'cognitoSignup'
            });
          } else {
            console.log('Admin signed up...');
            res(data);
          }
        });
      });
    },
    logIn: (USERNAME, PASSWORD) => {
      const params = {
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        UserPoolId: process.env.USER_POOL_ID,
        ClientId: process.env.USER_POOL_CLIENT_ID,
        AuthParameters: {
          USERNAME,
          PASSWORD
        }
      };
      return new Promise((res, rej) => {
        cognitoClient.adminInitiateAuth(params, (err, data) => {
          if (err) {
            console.log('Error while signing in... ', err);
            rej(err);
          } else {
            console.log('SignIn done.');
            res(data.AuthenticationResult);
          }
        });
      });
    },
    signOut: () => {
      //Not implementing, as cognito does not expire tokens on Logout
    },
    changePassword: (PreviousPassword, ProposedPassword, AccessToken) => {
      const params = {
        PreviousPassword,
        ProposedPassword,
        AccessToken
      };
      return new Promise((res, rej) => {
        cognitoClient.changePassword(params, err => {
          if (err) {
            console.log('Error while changing password...', err);
            rej(err);
          } else {
            console.log('Password changed');
            res();
          }
        });
      });
    },
    forgotPassword: () => {}
  };
})();
module.exports = {cognito};
