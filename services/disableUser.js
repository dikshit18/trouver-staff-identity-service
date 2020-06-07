const {dynamoDb} = require('../dbConfig/dynamoDb');
const {cognito} = require('../cognitoConfig/cognito');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {status} = require('../utils/status');

const details = async (req, res) => {
  try {
    const identityId = req.params.identityId; //CongitoSub
    const params = {
      TableName: process.env.STAFF_IDENTITY_TABLE,
      IndexName: process.env.STAFF_IDENTITY_TABLE_SUB_INDEX,
      Key: {
        cognitoSub: identityId
      }
    };
    const details = await dynamoDb.get(params);
    if (!details) {
      const response = errorCodes['userNotFound'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    }
    const {email} = details;
    await disableUserFromDb(email);
    await disableFromCognito(identityId);
    const response = successCodes['disableUserSuccess'];
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

const disableUserFromDb = async email => {
  const params = {
    TableName: process.env.STAFF_IDENTITY_TABLE,
    Key: {email},
    UpdateExpression: 'SET #status = :value',
    ExpressionAttributeNames: {'#status': 'status'},
    ExpressionAttributeValues: {
      ':value': status.disabled
    }
  };
  await dynamoDb.update(params);
  return;
};
const disableFromCognito = async identityId => {
  return await cognito.adminDisableUser(identityId);
};

module.exports = {details};
