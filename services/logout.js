require('dotenv').config();
const AWS = require('aws-sdk');
const {dynamoDb} = require('../dbConfig/dynamoDb');
const {validateSchema} = require('../utils/validator');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {schema} = require('../utils/schema');
AWS.config.update({
  region: 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
});
const apigwManagementApi = new AWS.ApiGatewayManagementApi({
  apiVersion: '2018-11-29',
  endpoint: process.env.WEB_SOCKET_ENDPOINT,
  region: 'ap-south-1'
});

const logout = async (req, res) => {
  try {
    await validateSchema(req.params, schema.logoutSchema);
    const sessionId = req.params.sessionId;
    await deleteSession(sessionId);
    await publishToConnectedClients(sessionId);
    const response = successCodes['logoutSuccess'];
    return res.status(response.statusCode).send({
      statusCode: response.statusCode,
      code: response.code
    });
  } catch (e) {
    console.log('Error in Logout...', e);
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

const deleteSession = async sessionId => {
  const params = {
    TableName: process.env.STAFF_SESSIONS_TABLE,
    Key: {
      sessionId
    }
  };
  await dynamoDb.delete(params);
  return;
};

const publishToConnectedClients = async sessionId => {
  const params = {
    TableName: process.env.STAFF_WS_CONNECTION_TABLE,
    KeyConditionExpression: 'sessionId = :sessionId',
    ExpressionAttributeValues: {
      ':sessionId': sessionId
    },
    IndexName: 'sessionId-connectionId-index',
    ProjectionExpression: 'connectionId'
  };
  const connections = await dynamoDb.query(params);
  if (connections.Items.length) {
    const connectionIds = connections.Items.map(session => session.connectionId);
    console.log('ConnectionIds are... ', connectionIds);
    const logoutMessage = {dispatch: 'logout'};
    for (const id of connectionIds) {
      try {
        await postToClient(id, logoutMessage);
        await deleteInvalidConnections(id); // Since this client is logged out, closing this connection now
      } catch (error) {
        console.log('Error while sending message to the connected client...', error);
        if (error.code === 'GoneException') {
          await deleteInvalidConnections(id);
        }
      }
    }
  }
  return;
};
const deleteInvalidConnections = async id => {
  const params = {
    TableName: process.env.STAFF_WS_CONNECTION_TABLE,
    Key: {
      connectionId: id
    }
  };
  await dynamoDb.delete(params);
};

const postToClient = (connectionId, message) => {
  return new Promise((res, rej) => {
    const params = {
      ConnectionId: connectionId,
      Data: JSON.stringify(message)
    };
    apigwManagementApi.postToConnection(params, (err, data) => {
      if (err) {
        rej({...err, origin: 'APIG'});
      } else {
        console.log('Message sent...', connectionId, message);
        res(data);
      }
    });
  });
};

module.exports = {logout};
