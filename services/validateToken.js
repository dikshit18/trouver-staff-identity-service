const {dynamoDb} = require('../dbConfig/dynamoDb');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {schema} = require('../utils/schema');
const moment = require('moment');
const {validateSchema} = require('../utils/validator');
const validateToken = async (req, res) => {
  try {
    await validateSchema(req.body, schema.validateToken);
    const {token} = req.body;
    const tokenBoolean = await isTokenValid(token);
    if (tokenBoolean) {
      const response = successCodes['tokenValid'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    } else {
      await deleteExpiredToken(token);
      const response = errorCodes['tokenInvalid'];
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

const isTokenValid = async token => {
  const params = {
    TableName: process.env.SIGNUP_TOKEN_DETAILS_TABLE_NAME,
    KeyConditionExpression: '#token = :token',
    ExpressionAttributeNames: {
      '#token': 'token'
    },
    ExpressionAttributeValues: {
      ':token': token
    },
    ProjectionExpression: 'created,cognitoSub'
  };
  const tokenDetails = await dynamoDb.query(params);
  if (!tokenDetails.Items.length) return false;
  const {created} = tokenDetails.Items[0];
  const expiry = moment(created)
    .add(1, 'days')
    .utc()
    .format();
  const newDate = moment.utc().format();
  return moment(newDate).isBefore(expiry);
};
const deleteExpiredToken = async token => {
  const params = {
    TableName: process.env.SIGNUP_TOKEN_DETAILS_TABLE_NAME,
    Key: {
      token
    }
  };
  return await dynamoDb.delete(params);
};

module.exports = {validateToken};
