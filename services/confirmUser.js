const {dynamoDb} = require('../dbConfig/dynamoDb');
const {cognito} = require('../cognitoConfig/cognito');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {schema} = require('../utils/schema');
const { validateSchema } = require('../utils/validator');
const { status } = require('../utils/status');
const confirmUser = async (req, res) => {
  try {
    await validateSchema(req.body, schema.confirmUser);
    const {token, password} = req.body;
    const tokenDetails = await fetchTokenFromDb(token);
    const tokenBoolean = isTokenValid(tokenDetails);
    if (tokenBoolean) {
      const {cognitoSub} = tokenDetails.Items[0].length;
        await cognito.adminSetUserPassword(cognitoSub, password);
           await cognito.adminConfirmSignUp(cognitoSub);
        const email = await getUserEmail(cognitoSub);
        await udpateUserActiveStatus(email)
      const response = successCodes['setPasswordSuccess'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    } else {
      const response = errorCodes['tokenExpired'];
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

const isTokenValid = async tokenDetails => {
  if (!tokenDetails.Items.length) return false;
  const {created} = tokenDetails.Items[0];
  const expiry = moment(created).add(24, 'hours');
  const newDate = moment.utc().format();
  return moment(expiry).isBefore(newDate);
};

const fetchTokenFromDb = async token => {
  const params = {
    TableName: process.env.SIGNUP_TOKEN_DETAILS_TABLE_NAME,
    KeyConditionExpression: 'token = :token',
    ExpressionAttributeValues: {
      ':token': token
    },
    ProjectionExpression: 'created,cognitoSub'
  };
  const tokenDetails = await dynamoDb.query(params);
  return tokenDetails;
};

const getUserEmail = async cognitoSub => {
  const params = {
    TableName: process.env.STAFF_IDENTITY_TABLE,
    IndexName: process.env.STAFF_IDENTITY_TABLE_SUB_INDEX,
    Key: {
      cognitoSub
    }
  };
  const details = await dynamoDb.get(params);
  return details.email;
};
const udpateUserActiveStatus = email => {
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
}
module.exports = {confirmUser};
