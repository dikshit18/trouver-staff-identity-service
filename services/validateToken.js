const {dynamoDb} = require('../dbConfig/dynamoDb');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {schema} = require('../utils/schema');
const {validateSchema} = require('../utils/validator');
const validateToken = async (req, res) => {
  try {
    await validateSchema(req.query, schema.validateToken);
    const {token} = req.query;
    const tokenBoolean = isTokenValid(token);
    if (tokenBoolean) {
      const response = successCodes['tokenValid'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    } else {
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
    KeyConditionExpression: 'token = :token',
    ExpressionAttributeValues: {
      ':token': token
    },
    ProjectionExpression: 'created'
  };
  const tokenDetails = await dynamoDb.query(params);
  if (!tokenDetails.Items.length) return false;
  const {created} = tokenDetails.Items[0];
  const expiry = moment(created).add(24, 'hours');
  const newDate = moment.utc().format();
  return moment(expiry).isBefore(newDate);
};

module.exports = {validateToken};
