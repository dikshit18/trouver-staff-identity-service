const {dynamoDb} = require('../dbConfig/dynamoDb');
const {cognito} = require('../cognitoConfig/cognito');
const {validateSchema} = require('../utils/validator');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {schema} = require('../utils/schema');
const {v4: uuidv4} = require('uuid');
const moment = require('moment');
const logIn = async (req, res) => {
  try {
    //Add a condition to check if the user is activated or not
    await validateSchema(req.body, schema.logInSchema);
    const {email, password} = req.body;
    if (await checkIfUserExists(email)) {
      const tokens = await cognito.logIn(email, password);
      const sessionId = await addSessionDetails(tokens, email);
      delete tokens.AccessToken;
      delete tokens.RefreshToken;
      const response = successCodes['logInSuccess'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code,
        sessionId,
        tokens
      });
    } else {
      const response = errorCodes['userNotFound'];
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

const checkIfUserExists = async email => {
  const params = {
    TableName: process.env.STAFF_IDENTITY_TABLE,
    Key: {
      email
    }
  };
  const doesUserExists = await dynamoDb.get(params);
  if (doesUserExists.Item) {
    return true;
  } else return false;
};

const addSessionDetails = async ({IdToken, RefreshToken, AccessToken}, email) => {
  const sessionId = uuidv4();
  const params = {
    TableName: process.env.STAFF_SESSIONS_TABLE,
    Item: {
      sessionId,
      idToken: IdToken,
      refreshToken: RefreshToken,
      accessToken: AccessToken,
      email,
      created: moment.utc().format()
    }
  };
  await dynamoDb.create(params);
  return sessionId;
};
module.exports = {logIn};
