const {dynamoDb} = require('../dbConfig/dynamoDb');
const {cognito} = require('../cognitoConfig/cognito');
const {validateSchema} = require('../utils/validator');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {schema} = require('../utils/schema');
const {v4: uuidv4} = require('uuid');
const moment = require('moment');
const changePassword = async (req, res) => {
  try {
    await validateSchema(req.body, schema.changePasswordSchema);
    const {oldPassword, newPassword, sessionId} = req.body;
    const {authorization: idToken} = req.headers;
    //const {email} = event.requestContext.authorizer.claims;
    const tokenResponse = await checkIfSessionExists(sessionId, idToken);
    if (tokenResponse.token) {
      await cognito.changePassword(oldPassword, newPassword, tokenResponse.token);
      const response = successCodes['changePasswordSuccess'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    } else {
      const response = errorCodes['changePasswordFailed'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    }
  } catch (e) {
    //Needed to be defined again
    if (e.code === 'schemaError') {
      const response = errorCodes['joi'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    } else {
      //default error
      const response = errorCodes['default'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    }
  }
};

const checkIfSessionExists = async (sessionId, idToken) => {
  const params = {
    TableName: process.env.STAFF_SESSIONS_TABLE,
    KeyConditionExpression: 'sessionId = :id',
    FilterExpression: 'idToken = :token',
    ExpressionAttributeValues: {
      ':id': sessionId,
      ':token': idToken
    },
    ProjectionExpression: 'accessToken'
  };
  const sessionDetails = await dynamoDb.query(params);
  console.log(sessionDetails);
  if (sessionDetails.Items.length) {
    return {token: sessionDetails.Items[0].accessToken};
  } else return {};
};
module.exports = {changePassword};
