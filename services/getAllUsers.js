require('dotenv').config();
const {dynamoDb} = require('../dbConfig/dynamoDb');
const {status} = require('../utils/status');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const details = async (req, res) => {
  try {
    const params = {
      TableName: process.env.STAFF_IDENTITY_TABLE,
      FilterExpression: 'status = :value',
      ExpressionAttributeValues: {':value': status.confirmed}
    };
    const details = await dynamoDb.scan(params);
    const users = details.Items.length ? details.Items : [];
    const response = successCodes['getAllUserSuccess'];
    return res.status(response.statusCode).send({
      statusCode: response.statusCode,
      code: response.code,
      staffMembers: users
    });
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

module.exports = {details};
