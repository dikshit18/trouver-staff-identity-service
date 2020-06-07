const AWS = require('aws-sdk');
AWS.config.update({
  region: 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
});
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-south-1'
});
const dynamoDb = (() => {
  return {
    get: params => {
      return new Promise((res, rej) => {
        documentClient.get(params, (err, data) => {
          if (err) {
            console.log('Error while getting staff details... ', err);
            rej({...err, origin: 'dynamoDbGet'});
          } else {
            console.log('Succesfully fetched staff details... ', data);
            res(data);
          }
        });
      });
    },
    create: params => {
      return new Promise((res, rej) => {
        console.log('params are ...', params);
        documentClient.put(params, (err, data) => {
          if (err) {
            console.log('Error while creating staff details... ', err);
            rej(err);
          } else {
            console.log('Succesfully creating staff details... ', data);
            res(data);
          }
        });
      });
    },
    update: params => {
      return new Promise((res, rej) => {
        documentClient.update(params, (err, data) => {
          if (err) {
            console.log('Error while updating staff details... ', err);
            rej(err);
          } else {
            console.log('Succesfully updated staff details... ', data);
            res(data);
          }
        });
      });
    },
    query: params => {
      return new Promise((res, rej) => {
        documentClient.query(params, (err, data) => {
          if (err) {
            console.log('Error while querying database... ', err);
            rej(err);
          } else {
            console.log('Succesfully queried database... ', data);
            res(data);
          }
        });
      });
    },
    delete: params => {
      return new Promise((res, rej) => {
        documentClient.delete(params, (err, data) => {
          if (err) {
            console.log('Error while deleting item... ', err);
            rej(err);
          } else {
            console.log('Succesfully deleted item... ', data);
            res(data);
          }
        });
      });
    },
    scan: params => {
      return new Promise((res, rej) => {
        documentClient.scan(params, (err, data) => {
          if (err) {
            console.log('Error while deleting item... ', err);
            rej(err);
          } else {
            console.log('Succesfully deleted item... ', data);
            res(data);
          }
        });
      });
    }
  };
})();
module.exports = {dynamoDb};
