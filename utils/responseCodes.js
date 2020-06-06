const successCodes = {
  signUpSuccess: {
    code: 101,
    statusCode: 201
  },
  logInSuccess: {
    code: 102,
    statusCode: 200
  },
  changePasswordSuccess: {
    code: 103,
    statusCode: 200
  },
  forgotPasswordSuccess: {
    code: 104,
    statusCode: 200
  },
  sessionValid: {
    code: 105,
    statusCode: 200
  },
  logoutSuccess: {
    code: 106,
    statusCode: 200
  }
};

const errorCodes = {
  default: {
    statusCode: 500,
    code: 151
  },
  joi: {
    statusCode: 400,
    code: 152
  },
  userNotFound: {
    statusCode: 404,
    code: 153
  },
  userAlreadyExists: {
    statusCode: 400,
    code: 154
  },
  sessionInvalid: {
    statusCode: 401,
    code: 155
  },
  changePasswordFailed: {
    statusCode: 400,
    code: 156
  }
};
module.exports = {errorCodes, successCodes};
