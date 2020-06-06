const moment = require('moment');
const {dynamoDb} = require('../dbConfig/dynamoDb');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const sessionValidity = async (req, res) => {
  //To be encrypted later
  const {sessionId} = req.query;
  //Validation additoion pending
  const params = {
    TableName: process.env.STAFF_SESSIONS_TABLE,
    KeyConditionExpression: 'sessionId = :id',
    ExpressionAttributeValues: {
      ':id': sessionId
    },
    ProjectionExpression: 'sessionId,created'
  };
  const sessionExists = await dynamoDb.query(params);
  let response;
  //check  session time here
  if (sessionExists.Items.length) {
    const created = sessionExists.Items[0].created;
    if (checkExpiry(created)) response = successCodes['sessionValid'];
    else response = errorCodes['sessionInvalid'];
  } else response = errorCodes['sessionInvalid'];
  return res.status(response.statusCode).send({
    statusCode: response.statusCode,
    code: response.code
  });
  //Error handler to be added
};

const checkExpiry = created => {
  if (!created) return false;
  const expiry = moment(created).add(1, 'hour');
  const newDate = moment.utc().format();
  return moment(expiry).isAfter(newDate);
};
module.exports = {sessionValidity};
