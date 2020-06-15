const {dynamoDb} = require('../dbConfig/dynamoDb');
const {cognito} = require('../cognitoConfig/cognito');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {status} = require('../utils/status');

const enableUser = async (req, res) => {
  try {
    const identityId = req.params.identityId; //CongitoSub
    const params = {
      TableName: process.env.STAFF_IDENTITY_TABLE,
      IndexName: process.env.STAFF_IDENTITY_TABLE_SUB_INDEX,
      KeyConditionExpression: 'cognitoSub = :id',
      ExpressionAttributeValues: {
        ':id': identityId
      }
    };
    const details = await dynamoDb.query(params);
    if (!details) {
      const response = errorCodes['userNotFound'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    }
    const {email} = details.Items[0];
    await enableUserFromDb(email);
    await enableFromCognito(identityId);
    const response = successCodes['enableUserSuccess'];
    return res.status(response.statusCode).send({
      statusCode: response.statusCode,
      code: response.code
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

const enableUserFromDb = async email => {
  const params = {
    TableName: process.env.STAFF_IDENTITY_TABLE,
    Key: {email},
    UpdateExpression: 'SET #status = :value',
    ExpressionAttributeNames: {'#status': 'status'},
    ExpressionAttributeValues: {
      ':value': status.confirmed
    }
  };
  await dynamoDb.update(params);
  return;
};
const enableFromCognito = async identityId => {
  return await cognito.adminEnableUser(identityId);
};

module.exports = {enableUser};
