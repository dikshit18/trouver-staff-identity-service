const {errorCodes, successCodes} = require('./responseCodes');

const handleExceptions = error => {
  let errResponse;
  switch (error.origin) {
    case 'SQS':
      errResponse = sqsExceptions[error.code];
      break;
    case 'JOI':
      errResponse = customExceptions['joi'];
      break;
    case 'elasticsearch':
    default:
      errResponse = customExceptions['default'];
      break;
  }
  return errResponse;
};
const handleResponse = response => {
  let successResponse;
};
module.exports = {handleExceptions};
